import { keywords, UI_TEXTS } from "../../constant/label.js";
import { isLoggedIn } from "../../auth/auth.js";
import { apiPost } from "../../api.js";
import { API_URL } from "../../constant/api_path.js";

document.addEventListener("DOMContentLoaded", () => {

    // Redirect if already logged in
    if (isLoggedIn()) {
        window.location.href = "/src/pages/dashboard/dashboard.html";
        return;
    }
    document.getElementById("registerTitle").innerText = UI_TEXTS.register.title;
    document.getElementById("alreadyHaveAccount").innerText = UI_TEXTS.register.HasAccount;
    document.getElementById("loginLinkText").innerText = UI_TEXTS.login.title;

    // DOM references
    const form = document.getElementById(keywords.REGISTER_FORM);
    const errorBox = document.getElementById(keywords.ERROR_BOX);

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        errorBox.classList.add("d-none");

        // Build request payload
        const payload = {
            family_name: document.getElementById(keywords.FAMILY_NAME).value.trim(),
            name: document.getElementById(keywords.NAME).value.trim(),
            email: document.getElementById(keywords.EMAIL).value.trim(),
            password: document.getElementById(keywords.PASSWORD).value.trim()
        };
        const errors = validateRegisterForm(payload);
        if (errors.length > 0) {
            errorBox.classList.remove("d-none");
            errorBox.innerHTML = errors.join("<br>");
            return;
        }
        try {
            // Use constant API route
            const result = await apiPost(API_URL.USERS.REGISTER, payload);

            alert("Registration successful! Please login.");
            window.location.href = "/src/pages/login/login.html";

        } catch (err) {
            errorBox.classList.remove("d-none");
            errorBox.innerHTML = err.message || "Registration failed.";

        }
        
    });
});
function validateRegisterForm(payload) {
    const errors = [];

    if (!payload.family_name) {
        errors.push("Family name is required.");
    }

    if (!payload.name) {
        errors.push("Your name is required.");
    }

    if (!payload.email) {
        errors.push("Email is required.");
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(payload.email)) {
            errors.push("Enter a valid email address.");
        }
        payload.email = payload.email.toLowerCase();
    }

    if (!payload.password) {
        errors.push("Password is required.");
    } else {
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passRegex.test(payload.password)) {
            errors.push(
                "Password must have at least 6 characters, include uppercase, lowercase, number, and special character."
            );
        }
    }

    return errors;
}