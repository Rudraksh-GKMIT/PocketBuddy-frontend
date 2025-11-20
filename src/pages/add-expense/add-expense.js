import { API_URL } from "../../constant/api_path.js";
import { keywords } from "../../constant/label.js";
import { apiPost } from "../../api.js";
import { isLoggedIn, renderNavbar } from "../../auth/auth.js";

document.addEventListener("DOMContentLoaded", () => {

    // Block access if not logged in
    if (!isLoggedIn()) {
        window.location.href = "../login/login.html";
        return;
    }

    // Render Navbar
    renderNavbar();

    // References
    const form = document.getElementById("expenseForm");
    const errorBox = document.getElementById(keywords.ERROR_BOX);
    const categoryEl = document.getElementById("category");
    const amountEl = document.getElementById("amount");
    const descriptionEl = document.getElementById("description");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Reset all invalid states
        categoryEl.classList.remove("is-invalid");
        amountEl.classList.remove("is-invalid");
        descriptionEl.classList.remove("is-invalid");

        let hasError = false;

        // CATEGORY VALIDATION
        if (!categoryEl.value.trim()) {
            categoryEl.classList.add("is-invalid");
            hasError = true;
        }

        // AMOUNT VALIDATION
        const amt = amountEl.value.trim();
        if (!amt || Number(amt) <= 0) {
            amountError.textContent = "Amount must be greater than 0.";
            amountEl.classList.add("is-invalid");
            hasError = true;
        } else if (amt.length > 10) {
            amountError.textContent = "Amount cannot exceed 10 digits.";
            amountEl.classList.add("is-invalid");
            hasError = true;
        }

        // DESCRIPTION VALIDATION
        if (!descriptionEl.value.trim()) {
            descriptionError.textContent = "Description is required.";
            descriptionEl.classList.add("is-invalid");
            hasError = true;
        } else if (descriptionEl.value.trim().length > 200) {
            descriptionError.textContent = "Description cannot exceed 200 characters.";
            descriptionEl.classList.add("is-invalid");
            hasError = true;
        }

        if (hasError) return; // Stop if validation failed

        // Submit payload
        try {
            await apiPost(API_URL.TRANSACTION.ADD, {
                type: categoryEl.value,
                amount: Number(amountEl.value),
                description: descriptionEl.value.trim()
            });

            new bootstrap.Toast(document.getElementById("successToast")).show();
            form.reset();

        } catch (err) {
            console.error("Expense Error:", err);
        }
    });

    function showError(msg) {
        errorBox.classList.remove("d-none");
        errorBox.innerText = msg;
    }

    function hideError() {
        errorBox.classList.add("d-none");
        errorBox.innerText = "";
    }
});
