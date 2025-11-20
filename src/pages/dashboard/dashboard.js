import { isLoggedIn, getCurrentUser, renderNavbar } from "../../auth/auth.js";
import { apiGet } from "../../api.js";
import { API_URL } from "../../constant/api_path.js";

document.addEventListener("DOMContentLoaded", async () => {

    if (!isLoggedIn()) {
        window.location.href = "../login/login.html";
        return;
    }

    renderNavbar();

    const user = getCurrentUser();
    setText("welcomeText", `Welcome, ${user.username}!`);

    try {
        const summary = await apiGet(API_URL.SUMMARY.DASHBOARD);

        // MULTIPLE TOP CATEGORIES
        const top = summary.top_categories;
        setText("topCategory", top.length > 0 ? top.join(", ") : "-");

        // Totals
        setText("totalSpent", formatAmount(summary.total_spent));
        setText("monthlySpent", formatAmount(summary.this_month));

        // Category List
        renderCategories(summary.type_summary);

    } catch (err) {
        console.error("Dashboard Error:", err);
    }
});

function setText(id, text) {
    document.getElementById(id).innerText = text;
}

function formatAmount(amount) {
    return `₹${amount || 0}`;
}

function renderCategories(data) {
    const list = document.getElementById("categoryList");
    list.innerHTML = "";

    if (!data || data.length === 0) {
        list.innerHTML = `<li class="list-group-item text-muted">No data available</li>`;
        return;
    }

    data.forEach(item => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between";
        li.innerHTML = `
            <span>${item.type}</span>
            <strong>₹${item.total}</strong>
        `;
        list.appendChild(li);
    });
}
