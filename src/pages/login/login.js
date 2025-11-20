import { ROUTES } from "../../constant/api_path.js";
import { UI_TEXTS, keywords } from "../../constant/label.js";
import { isLoggedIn } from "../../auth/auth.js";
import { STORAGE_KEYS } from "../../constant/keys.js";
import { apiPost } from "../../api.js";

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("loginTitle").innerText = UI_TEXTS.login.title;
    document.getElementById("noAccountText").innerText = UI_TEXTS.login.noAccount + " ";
    document.getElementById("registerText").innerText = UI_TEXTS.login.register;

    if (isLoggedIn()) {
        window.location.href = "dashboard.html";
        return;
    }

    const form = document.getElementById(keywords.LOGIN_FORM);
    const errorBox = document.getElementById(keywords.ERROR_BOX);

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        errorBox.classList.add("d-none");

        const email = document.getElementById(keywords.EMAIL).value.trim();
        const password = document.getElementById(keywords.PASSWORD).value.trim();

        const loginPayload = { email, password };

        try {
            const data = await apiPost(ROUTES.USERS.LOGIN, loginPayload);
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access_token);
            window.location.href = "dashboard.html";

        } catch (err) {
            errorBox.classList.remove("d-none");
            errorBox.innerText = "Invalid email or password.";
        }
    });

});
