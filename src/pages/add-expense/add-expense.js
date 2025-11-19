import { ROUTES } from "../../constant/api_path.js";
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
        hideError();

        const payload = {
            type: categoryEl.value.trim(),
            amount: parseFloat(amountEl.value),
            description: descriptionEl.value.trim(),
        };

        // Validation
        if (!payload.type || payload.amount <= 0) {
            return showError("Please select a category and enter a valid amount.");
        }
        if (String(payload.amount).length > 10) {
            return showError("Amount cannot exceed 10 digits.");
        }

        if (payload.description.length > 200) {
            return showError("Description cannot exceed 200 characters.");
        }
        try {
            await apiPost(ROUTES.TRANSACTION.ADD, payload);

            // SUCCESS TOAST
            const toastEl = document.getElementById("successToast");
            const toastMessage = document.getElementById("successToastMessage");
            const toast = new bootstrap.Toast(toastEl);

            document.activeElement.blur(); // remove focus warning

            toastMessage.innerText = "Expense added successfully!";
            toast.show();

            form.reset();

        } catch (err) {
            showError("Failed to add expense. Please try again.");
            console.error("Expense Error:", err.message);
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
