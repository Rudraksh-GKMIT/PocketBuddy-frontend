// AUTH.JS — Handles Authentication & Role-Based Access
import { STORAGE_KEYS } from "../constant/keys.js";
import { ROLES } from "../constant/label.js";

// 1. Check if user is logged in
export function isLoggedIn() {
    const token = localStorage.getItem("access_token");
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const now = Date.now() / 1000;

        return payload.exp && payload.exp > now;   // token not expired
    } catch {
        return false;
    }
}


// 2. Redirect if NOT logged in
export function protectPage() {
    if (!isLoggedIn()) {
        window.location.href = "../login/login.html";
    }
}

// 3. Logout user
export function logout() {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    window.location.href = "/index.html";
}

// 4. Decode JWT (header.payload.signature)
function parseJwt(access_token) {
    try {
        const payload = access_token.split(".")[1];
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        const decoded = decodeURIComponent(
            atob(base64)
                .split("")
                .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(decoded);
    } catch (e) {
        console.error("Invalid JWT:", e);
        return null;
    }
}


// 5. Get current logged-in user
export function getCurrentUser() {
    const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!accessToken) return null;

    return parseJwt(accessToken);
}

export function formatDate(input) {
    if (!input) return "-";

    try {
        let value = input.trim();

        // ---------- CASE 1: ISO with microseconds (your backend now sends this)
        // Example: 2025-11-18T21:40:16.599093+05:30
        if (value.includes("T") && value.includes(".")) {
            // Remove extra microsecond digits after 3 digits
            value = value.replace(/\.(\d{3})\d+/, '.$1');
            const d = new Date(value);
            if (!isNaN(d)) return formatOutput(d);
        }

        // ---------- CASE 2: ISO without microseconds
        const iso = new Date(value);
        if (!isNaN(iso)) return formatOutput(iso);

        return "-";

    } catch (err) {
        console.error("Date Parse Error:", input);
        return "-";
    }

    function formatOutput(d) {
        return d.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }
}



// 6. Render navbar based on user role
function getNavbarHTML(role) {

    let html = `
        <a href="../dashboard/dashboard.html" class="btn btn-outline-light me-2 nav-link-btn">Dashboard</a>
        <a href="../add-expense/add-expense.html" class="btn btn-outline-light me-2 nav-link-btn">Add Expense</a>
        <a href="../expense/expenses.html" class="btn btn-outline-light me-2 nav-link-btn">My Expenses</a>
    `;
    
    if (role === ROLES.ADMIN) {
        html += `
            <a href="../admin_member/admin_member.html" class="btn btn-outline-light me-2 nav-link-btn">Members</a>
            <a href="../family/family-summary.html" class="btn btn-outline-light me-2">Family Dashboard</a>
        `;
    }

    html += `<button id="logoutBtn" class="btn btn-danger">Logout</button>`;
    return html;
}

export function renderNavbar() {
    const user = getCurrentUser();
    const nav = document.getElementById("navLinks");

    if (!nav || !user) return;

    nav.innerHTML = getNavbarHTML(user.role);

    // Highlight current page
    const currentPage = window.location.pathname.split("/").pop();

    nav.querySelectorAll("a").forEach(a => {
    const linkPage = a.getAttribute("href")?.split("/").pop();

    if (linkPage === currentPage) {
        a.classList.remove("btn-outline-light");
        a.classList.add("btn-light", "text-primary", "fw-bold");
    }
});


    // Logout handler
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) logoutBtn.addEventListener("click", logout);
}

// 7. Auto-render navbar on page load
document.addEventListener("DOMContentLoaded", () => {
    const nav = document.getElementById("navLinks");
    if (nav) {
        protectPage();   // dashboard, expenses, admin pages
        renderNavbar();  // add navbar
    }
});
