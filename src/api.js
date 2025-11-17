import { STORAGE_KEYS } from "./constant/keys.js";
import { API_BASE } from "./constant/api_path.js";

async function apiRequest(method, url, body = null) {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? "Bearer " + token : ""
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const res = await fetch(API_BASE + url, options);

        if (!res.ok) {
            const msg = await res.text();
            throw new Error(msg || `${method} Request Failed`);
        }

        return await res.json();

    } catch (err) {
        console.error(`API ERROR (${method} ${url}):`, err.message);
        throw err;
    }
}

export const apiGet = (url) => apiRequest("GET", url);
export const apiPost = (url, body) => apiRequest("POST", url, body);
export const apiPut = (url, body) => apiRequest("PUT", url, body);
export const apiDelete = (url) => apiRequest("DELETE", url);
