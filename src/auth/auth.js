// AUTH.JS — Handles Authentication & Role-Based Access
import { STORAGE_KEYS } from "../constant/keys.js";
import { ROLES } from "../constant/label.js";

// 1. Check if user is logged in
export function isLoggedIn() {
    const access_token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    return access_token !== null && access_token !== "";
}

// 2. Redirect if NOT logged in
export function protectPage() {
    if (!isLoggedIn()) {
        window.location.href = "index.html";
    }
}

// 3. Logout user
export function logout() {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    window.location.href = "index.html";
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

// 6. Render navbar based on user role
function getNavbarHTML(role) {

    let html = `
        <a href="../dashboard/dashboard.html" class="btn btn-light me-2">Dashboard</a>
        <a href="../expense/add-expense.html" class="btn btn-light me-2">Add Expense</a>
        <a href="../expense/expenses.html" class="btn btn-light me-2">My Expenses</a>
    `;
    if (role === ROLES.ADMIN) {
        html += `
            <a href="../admin-members/admin-members.html" class="btn btn-warning me-2">Members</a>
            <a href="../family-summary/family-summary.html" class="btn btn-warning me-2">Family Summary</a>
            <a href="../family-expenses/family-expenses.html" class="btn btn-warning me-2">All Expenses</a>
        `;
    }
    // logout button
    html += `<button id="logoutBtn" class="btn btn-danger">Logout</button>`;
    return html;
}

export function renderNavbar() {
    const user = getCurrentUser();
    const nav = document.getElementById("navLinks");

    if (!nav || !user) return;

    nav.innerHTML = getNavbarHTML(user.role);

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) logoutBtn.addEventListener("click", logout);
}

// 7. Auto-render navbar on page load
document.addEventListener("DOMContentLoaded", renderNavbar);
