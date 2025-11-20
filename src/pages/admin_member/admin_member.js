// admin_member.js — Clean, Modern, Toast-Based Error Handling

import { API_URL } from "../../constant/api_path.js";
import { apiGet, apiPost, apiPut, apiDelete } from "../../api.js";
import { protectPage, getCurrentUser, renderNavbar } from "../../auth/auth.js";

document.addEventListener("DOMContentLoaded", async () => {

    protectPage();
    renderNavbar();

    const user = getCurrentUser();
    if (user.role !== "admin") {
        alert("Access Denied!");
        window.location.href = "../dashboard/dashboard.html";
        return;
    }

    const tableBody = document.getElementById("memberTableBody");

    // Add form
    const addName = document.getElementById("addName");
    const addEmail = document.getElementById("addEmail");
    const addPassword = document.getElementById("addPassword");

    // Edit modal
    const editId = document.getElementById("editId");
    const editName = document.getElementById("editName");
    const editEmail = document.getElementById("editEmail");
    const editPassword = document.getElementById("editPassword");

    const editModal = new bootstrap.Modal(document.getElementById("editModal"));

    // Delete confirmation
    const deleteModal = new bootstrap.Modal(document.getElementById("deleteConfirmModal"));
    let deleteMemberId = null;

    //-------------------------------------------------------
    // TOAST HELPERS
    //-------------------------------------------------------
    const successToastEl = document.getElementById("successToast");
    const successToastMsg = document.getElementById("successToastMessage");

    const errorToastEl = document.getElementById("errorToast");
    const errorToastMsg = document.getElementById("errorToastMessage");

    function showSuccess(message) {
        successToastMsg.textContent = message;
        new bootstrap.Toast(successToastEl).show();
    }

    function showError(message) {
        errorToastMsg.textContent = message;
        new bootstrap.Toast(errorToastEl).show();
    }

    //-------------------------------------------------------
    // UNIFIED FASTAPI ERROR PARSER
    //-------------------------------------------------------
    function extractError(err) {
        let obj = err;

        if (typeof err === "string") {
            try {
                obj = JSON.parse(err);
            } catch {
                return err;
            }
        }

        if (typeof obj.detail === "string") {
            return obj.detail;
        }

        if (Array.isArray(obj.detail) && obj.detail[0]?.msg) {
            return obj.detail[0].msg;
        }

        return "Something went wrong";
    }

    //-------------------------------------------------------
    // LOAD MEMBERS
    //-------------------------------------------------------
    async function loadMembers() {
        try {
            const members = await apiGet(API_URL.ADMIN.GET_MEMBERS);
            renderTable(members);
        } catch (err) {
            showError("Failed to load members");
        }
    }

    function renderTable(members) {
        tableBody.innerHTML = "";

        if (!members.length) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center text-muted">No members found</td>
                </tr>`;
            return;
        }

        members.forEach(member => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${member.name}</td>
                <td>${member.email}</td>
                <td>
                    <button 
                        class="btn btn-warning btn-sm editBtn"
                        data-id="${member.id}"
                        data-name="${member.name}"
                        data-email="${member.email}">
                        Edit
                    </button>

                    <button 
                        class="btn btn-danger btn-sm deleteBtn"
                        data-id="${member.id}">
                        Delete
                    </button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    //-------------------------------------------------------
    // ADD MEMBER
    //-------------------------------------------------------
    document.getElementById("addMemberForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const payload = {
            name: addName.value.trim(),
            email: addEmail.value.trim(),
            password: addPassword.value.trim(),
            family_id: user.family_id
        };
        const errors = validateRegisterForm(payload);
        if (errors.length > 0) {
            errorBox.classList.remove("d-none");
            errorBox.innerHTML = errors.join("<br>");
            return;
        }
        try {
            await apiPost(API_URL.ADMIN.ADD_MEMBER, payload);
            showSuccess("Member added successfully");
            setTimeout(() => location.reload(), 1000);

        } catch (err) {
            showError(extractError(err));
        }
    });

    //-------------------------------------------------------
    // CLICK HANDLER: EDIT + DELETE
    //-------------------------------------------------------
    document.addEventListener("click", (e) => {
        const editBtn = e.target.closest(".editBtn");
        const deleteBtn = e.target.closest(".deleteBtn");

        if (editBtn) return openEditModal(editBtn);
        if (deleteBtn) return confirmDelete(deleteBtn.dataset.id);
    });

    //-------------------------------------------------------
    // OPEN EDIT MODAL
    //-------------------------------------------------------
    function openEditModal(btn) {
        editId.value = btn.dataset.id;
        editName.value = btn.dataset.name;
        editEmail.value = btn.dataset.email;
        editPassword.value = "";

        editModal.show();
    }

    //-------------------------------------------------------
    // UPDATE MEMBER
    //-------------------------------------------------------
    document.getElementById("editMemberForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = editId.value;

        const payload = {
            name: editName.value.trim(),
            email: editEmail.value.trim().toLowerCase(),
            password: editPassword.value.trim() || null
        };

        try {
            await apiPut(API_URL.ADMIN.EDIT_MEMBER(id), payload);
            editModal.hide();

            showSuccess("Member updated");
            setTimeout(() => location.reload(), 1000);

        } catch (err) {
            showError(extractError(err));
        }
    });

    //-------------------------------------------------------
    // DELETE FLOW
    //-------------------------------------------------------
    function confirmDelete(id) {
        deleteMemberId = id;
        deleteModal.show();
    }

    document.getElementById("confirmDeleteBtn").addEventListener("click", async () => {
        try {
            await apiDelete(API_URL.ADMIN.DELETE_MEMBER(deleteMemberId));

            deleteModal.hide();
            showSuccess("Member deleted");

            setTimeout(() => location.reload(), 1000);

        } catch (err) {
            showError(extractError(err));
        }
    });

    function validateRegisterForm(payload) {
        const errors = [];

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
    // INITIAL LOAD
    loadMembers();
});
