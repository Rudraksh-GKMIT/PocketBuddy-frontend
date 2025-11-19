export const ROUTES = {
    USERS: {
        BASE: "/users",
        GET_ALL: "/users/",
        REGISTER: "/users/register",
        LOGIN: "/users/login",
    },

    ADMIN: {
        BASE: "/admin",
        GET_MEMBERS: "/admin/members/family",
        ADD_MEMBER: "/admin/members",
        EDIT_MEMBER: (id) => `/admin/members/${id}`,
        DELETE_MEMBER: (id) => `/admin/members/${id}`,
    },

    TRANSACTION: {
        MY: "/transactions/",
        ADD: "/transactions/",
        UPDATE: (id) => `/transactions/${id}`,
        DELETE: (id) => `/transactions/${id}`,
        FAMILY: "/transactions/family",
        BY_TYPE: (type) => `/transactions/type/${type}`,
    },

    SUMMARY: {
        DASHBOARD: "/summary/dashboard",
        FAMILY_DASHBOARD: "/summary/family-dashboard"
    }
};
