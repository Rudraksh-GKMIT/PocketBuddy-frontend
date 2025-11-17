import { STORAGE_KEYS } from "./constant/keys.js";
import { API_BASE } from "./constant/api_path.js";

// GET Request
export async function apiGet(url) {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    const res = await fetch(API_BASE + url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? "Bearer " + token : ""
        }
    });

    if (!res.ok) throw new Error(await res.text() || "GET Request Failed");
    return res.json();
}

// POST Request
export async function apiPost(url, body) {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    const res = await fetch(API_BASE + url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? "Bearer " + token : ""
        },
        body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error(await res.text() || "POST Request Failed");
    return res.json();
}
