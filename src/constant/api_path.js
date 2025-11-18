export const ROUTES = {
    USERS: {
        BASE: "/api/users",
        GET_ALL: "/api/users/",
        REGISTER: "/api/users/register",
        LOGIN: "/api/users/login",
    },

    ADMIN: {
        BASE: "/api/admin",
        GET_MEMBERS: "/api/admin/members/family",
        ADD_MEMBER: "/api/admin/members",
        EDIT_MEMBER: (id) => `/api/admin/members/${id}`,
        DELETE_MEMBER: (id) => `/api/admin/members/${id}`,
    },

    TRANSACTION: {
        BASE: "/api/transaction",
        MY: "/api/transaction/me",
        ADD: "/api/transaction",
        UPDATE: (id) => `/api/transaction/${id}`,
        DELETE: (id) => `/api/transaction/${id}`,
        FAMILY: "/api/transaction/family",
        BY_TYPE: (type) => `/api/transaction/type/${type}`,
    },

    SUMMARY: {
        MY: "/api/transaction/summary/my",
        FAMILY: "/api/transaction/summary/family",
        MONTHLY_CURRENT: "/api/transaction/summary/monthly/current",
        BY_TYPE: "/api/transaction/summary/type",
        MONTHLY: "/api/transaction/summary/monthly"
    }
};
