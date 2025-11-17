document.addEventListener("DOMContentLoaded", () => { // this ensure my script runs only after all the html elements are created

    // If already logged in go to dashboard
    if (isLoggedIn()) {
        window.location.href = "dashboard.html";
        return;
    }

    const form = document.getElementById("loginForm");
    const errorBox = document.getElementById("errorBox");

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // prevent page to get reload 

        errorBox.classList.add("d-none");

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        try {
            const data = await apiPost("/users/login", { email, password });
            localStorage.setItem("token", data.access_token);
            window.location.href = "dashboard.html";

        } catch (err) {
            errorBox.classList.remove("d-none");
            errorBox.innerText = "Invalid email or password.";
        }
    });

});
