// AUTH.JS — Handles Authentication & Role-Based Access

import { STORAGE_KEYS } from "../constant/keys.js";


// 1. Check if user is logged in
export function isLoggedIn() {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    return token !== null && token !== "";
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
function parseJwt(token) {
    try {
        const payload = token.split(".")[1];
        const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(decoded);
    } catch (e) {
        console.error("Invalid JWT:", e);
        return null;
    }
}


// 5. Get current logged-in user
export function getCurrentUser() {
    const raw = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!raw) return null;

    return parseJwt(raw);
}


// 6. Render navbar based on user role
export function renderNavbar() {
    const user = getCurrentUser();
    const nav = document.getElementById("navLinks");

    if (!nav || !user) return;

    if (user.role === "admin") {
        nav.innerHTML = `
            <a href="dashboard.html" class="btn btn-light me-2">Dashboard</a>
            <a href="add-expense.html" class="btn btn-light me-2">Add Expense</a>
            <a href="expenses.html" class="btn btn-light me-2">My Expenses</a>

            <a href="admin-members.html" class="btn btn-warning me-2">Members</a>
            <a href="family-summary.html" class="btn btn-warning me-2">Family Summary</a>
            <a href="family-expenses.html" class="btn btn-warning me-2">All Expenses</a>

            <button id="logoutBtn" class="btn btn-danger">Logout</button>
        `;
    } else {
        nav.innerHTML = `
            <a href="dashboard.html" class="btn btn-light me-2">Dashboard</a>
            <a href="add-expense.html" class="btn btn-light me-2">Add Expense</a>
            <a href="expenses.html" class="btn btn-light me-2">My Expenses</a>
            <button id="logoutBtn" class="btn btn-danger">Logout</button>
        `;
    }

    // Attach logout handler
    const btn = document.getElementById("logoutBtn");
    if (btn) btn.addEventListener("click", logout);
}


// 7. Auto-render navbar on page load
document.addEventListener("DOMContentLoaded", renderNavbar);
