import { protectPage, getCurrentUser, renderNavbar,formatDate } from "../../auth/auth.js";
import { apiGet } from "../../api.js";
import { ROUTES } from "../../constant/api_path.js";

document.addEventListener("DOMContentLoaded", async () => {

    protectPage();
    renderNavbar();

    const user = getCurrentUser();
    if (user.role !== "admin") {
        alert("Access Denied: Only Admins can view this page");
        window.location.href = "../dashboard/dashboard.html";
        return;
    }

    const totalFamilySpentEl = document.getElementById("totalFamilySpent");
    const monthlySpentEl = document.getElementById("familyMonthlySpent");
    const topCategoryEl = document.getElementById("familyTopCategory");
    const categoryList = document.getElementById("familyCategoryList");
    const errorBox = document.getElementById("errorBox");

    const tableBody = document.getElementById("familyExpenseTableBody");
    const filter = document.getElementById("categoryFilter");

    let familyMembers = {};
    let allExpenses = [];

    try {
        const members = await apiGet(ROUTES.ADMIN.GET_MEMBERS);
        members.forEach(m => {
            familyMembers[String(m.id)] = m.name;
        });

        // Add formatted admin label
        familyMembers[String(user.user_id)] = `${user.username} (You)`;

        // 2. CALL YOUR NEW API
        const dashboard = await apiGet(ROUTES.SUMMARY.FAMILY_DASHBOARD);

        // Update cards
        totalFamilySpentEl.innerText = `₹${dashboard.total_family_spent || 0}`;
        monthlySpentEl.innerText = `₹${dashboard.this_month_family || 0}`;
        topCategoryEl.innerText = dashboard.top_categories?.join(", ") || "-";

        // Update Category Breakdown
        updateCategoryBreakdown(dashboard.type_summary);

        // 🔹 3. Load ALL FAMILY EXPENSES (you still need actual rows)
        allExpenses = await apiGet(ROUTES.TRANSACTION.FAMILY);

        renderTable(allExpenses);

        // Filter dropdown
        filter.addEventListener("change", () => {
            const val = filter.value;
            if (val === "all") renderTable(allExpenses);
            else renderTable(allExpenses.filter(t => t.type === val));
        });

    } catch (err) {
        console.error("FAMILY DASHBOARD ERROR:", err);
        errorBox.classList.remove("d-none");
        errorBox.innerText = "Failed to load family dashboard data.";
    }

    function renderTable(expenses) {
        tableBody.innerHTML = "";

        if (!expenses.length) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-muted">No expenses found.</td>
                </tr>
            `;
            return;
        }
        
        expenses.forEach(exp => {
            const memberName =
                String(exp.user_id) === String(user.user_id)
                    ? `${user.username} (You)`
                    : (familyMembers[String(exp.user_id)] ?? "Unknown");
            
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${memberName}</td>
                <td>${exp.type}</td>
                <td>₹${exp.amount}</td>
                <td>${exp.description ?? "-"}</td>
                <td>${formatDate(exp.created_at)}</td>
            `;
            tableBody.appendChild(tr);
        });
    }


    function updateCategoryBreakdown(list) {
        categoryList.innerHTML = "";

        if (!list || !list.length) {
            categoryList.innerHTML = `<li class="list-group-item text-muted">No data</li>`;
            return;
        }

        list.forEach(item => {
            const li = document.createElement("li");
            li.className =
                "list-group-item d-flex justify-content-between align-items-center";
            li.innerHTML = `
                <span>${item.type}</span>
                <strong>₹${item.total}</strong>
            `;
            categoryList.appendChild(li);
        });
    }
});

