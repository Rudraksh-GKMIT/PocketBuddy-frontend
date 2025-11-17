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

