// AUTH.JS — Handles Authentication & Role-Based Access

import { STORAGE_KEYS } from "../constant/keys.js";


// 1. Check if user is logged in
export function isLoggedIn() {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    return token !== null && token !== "";
}

