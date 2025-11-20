import { keywords, UI_TEXTS } from "../../constant/label.js";
import { isLoggedIn } from "../../auth/auth.js";
import { apiPost } from "../../api.js";
import { ROUTES } from "../../constant/api_path.js";

document.addEventListener("DOMContentLoaded", () => {

    // Redirect if already logged in
    if (isLoggedIn()) {
        window.location.href = "../dashboard/dashboard.html";
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

        try {
            // Use constant API route
            const result = await apiPost(ROUTES.USERS.REGISTER, payload);

            alert("Registration successful! Please login.");
            window.location.href = "../login/login.html";

        } catch (err) {
            errorBox.classList.remove("d-none");
            errorBox.innerText = "Registration failed. Email may already exist.";
        }
    });
});
