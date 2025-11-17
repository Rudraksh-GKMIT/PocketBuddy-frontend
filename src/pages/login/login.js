document.addEventListener("DOMContentLoaded", () => {

    // Load static text from content.js
    document.getElementById("loginTitle").innerText = UI_TEXTS.login.title;
    document.getElementById("noAccountText").innerText = UI_TEXTS.login.noAccount + " ";
    document.getElementById("registerText").innerText = UI_TEXTS.login.register;

    if (isLoggedIn()) {
        window.location.href = "dashboard.html";
        return;
    }

    const form = document.getElementById("loginForm");
    const errorBox = document.getElementById("errorBox");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        errorBox.classList.add("d-none");

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        const loginPayload = { email, password };

        try {
            const data = await apiPost("/users/login", loginPayload);
            localStorage.setItem("token", data.access_token);
            window.location.href = "dashboard.html";

        } catch (err) {
            errorBox.classList.remove("d-none");
            errorBox.innerText = "Invalid email or password.";
        }
    });

});
