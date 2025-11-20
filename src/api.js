import { STORAGE_KEYS,API_BASE } from "./constant/keys.js";


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
            let errorJson;
            try {
                errorJson = await res.json(); // Parse JSON error
            } catch {
                errorJson = { detail: await res.text() }; // Fallback to text
            }
            throw errorJson; // THROW CLEAN JSON OBJECT 
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
