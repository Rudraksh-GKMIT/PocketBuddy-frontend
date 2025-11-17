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

