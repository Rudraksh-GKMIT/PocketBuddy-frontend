// expenses.js — Rewritten & Improved

import { API_URL } from "../../constant/api_path.js";
import { apiGet, apiDelete, apiPut } from "../../api.js";
import { protectPage, renderNavbar } from "../../auth/auth.js";

let expenseToDelete = null;
let expenseToEdit = null;

document.addEventListener("DOMContentLoaded", async () => {
    protectPage();
    renderNavbar();

    const tableBody = document.getElementById("expenseTableBody");
    const errorBox = document.getElementById("errorBox");

    const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
    const editModal = new bootstrap.Modal(document.getElementById("editModal"));

    const saveEditBtn = document.getElementById("saveEditBtn");
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    const editErrorBox = document.getElementById("editErrorBox");

    // Toast
    const toastEl = document.getElementById("successToast");
    const toastMsg = document.getElementById("successToastMessage");

    // --------------------------------------------
    // LOAD EXPENSES
    // --------------------------------------------
    try {
        const expenses = await apiGet(API_URL.TRANSACTION.MY);
        expenses.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        if (!expenses.length) {
            renderNoData(tableBody);
        } else {
            renderTableRows(tableBody, expenses, editModal, deleteModal);
        }

    } catch (err) {
        showError(errorBox, "Failed to load expenses.");
        console.error(err);
    }

    // --------------------------------------------
    // DELETE CONFIRM BUTTON
    // --------------------------------------------
    confirmDeleteBtn.addEventListener("click", async () => {
        try {
            await apiDelete(API_URL.TRANSACTION.DELETE(expenseToDelete));

            deleteModal.hide();
            showSuccess("Expense deleted!");

            setTimeout(() => location.reload(), 1200);

        } catch (err) {
            showError(errorBox, "Failed to delete expense.");
        }
    });

    // --------------------------------------------
    // SAVE EDIT BUTTON
    // --------------------------------------------
    saveEditBtn.addEventListener("click", async () => {
        hideEditError();

        const updatedData = {
            type: document.getElementById("editType").value,
            amount: parseFloat(document.getElementById("editAmount").value),
            description: document.getElementById("editDescription").value.trim()
        };

        if (!updatedData.type || !updatedData.amount || !updatedData.description) {
            return showEditError("Please enter all required fields.");
        }

        if (updatedData.amount <= 0) {
            return showEditError("Amount must be a positive number.");
        }

        if (updatedData.amount.toString().length > 10) {
            return showEditError("Amount cannot exceed 10 digits.");
        }

        if (updatedData.description.length > 200) {
            return showEditError("Description cannot exceed 200 characters.");
        }

        try {
            await apiPut(API_URL.TRANSACTION.UPDATE(expenseToEdit.id), updatedData);
            editModal.hide();
            showSuccess("Expense updated!");
            setTimeout(() => location.reload(), 1200);
        } catch (err) {
            showEditError("Failed to update expense.");
        }
    });


    // --------------------------------------------
    // UTILITY FUNCTIONS
    // --------------------------------------------

    function renderNoData(tableBody) {
        tableBody.innerHTML = `<tr>
            <td colspan="5" class="text-muted">No expenses found.</td>
        </tr>`;
    }

    function renderTableRows(container, expenses, editModal, deleteModal) {
        container.innerHTML = "";

        expenses.forEach(exp => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${exp.type}</td>
                <td>₹${exp.amount}</td>
                <td>${exp.description ?? "-"}</td>
                <td>${formatDate(exp.created_at)}</td>
                <td>
                    <button class="btn btn-warning btn-sm me-2 edit-btn">Edit</button>
                    <button class="btn btn-danger btn-sm delete-btn">Delete</button>
                </td>
            `;

            // EDIT BUTTON
            tr.querySelector(".edit-btn").addEventListener("click", () => {
                expenseToEdit = exp;

                document.getElementById("editType").value = exp.type;
                document.getElementById("editAmount").value = exp.amount;
                document.getElementById("editDescription").value = exp.description ?? "";

                editModal.show();
            });

            // DELETE BUTTON
            tr.querySelector(".delete-btn").addEventListener("click", () => {
                expenseToDelete = exp.id;
                deleteModal.show();
            });

            container.appendChild(tr);
        });
    }

    function showError(box, msg) {
        box.classList.remove("d-none");
        box.innerText = msg;
    }

    function showSuccess(message) {
        toastMsg.textContent = message;
        new bootstrap.Toast(toastEl).show();
    }

    function formatDate(dateString) {
        if (!dateString) return "-";
        const d = new Date(dateString.replace(" ", "T"));
        return isNaN(d) ? "-" : d.toLocaleDateString();
    }
    function showEditError(msg) {
        editErrorBox.classList.remove("d-none");
        editErrorBox.innerText = msg;
    }

    function hideEditError() {
        editErrorBox.classList.add("d-none");
        editErrorBox.innerText = "";
    }

});
