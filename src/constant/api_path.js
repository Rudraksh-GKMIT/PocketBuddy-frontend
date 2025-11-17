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
        BASE: "/transaction",
        MY: "/transaction/me",
        ADD: "/transaction",
        UPDATE: (id) => `/transaction/${id}`,
        DELETE: (id) => `/transaction/${id}`,
        FAMILY: "/transaction/family",
        BY_TYPE: (type) => `/transaction/type/${type}`,
    },

    SUMMARY: {
        MY: "/transaction/summary/my",
        FAMILY: "/transaction/summary/family",
        MONTHLY_CURRENT: "/transaction/summary/monthly/current",
        BY_TYPE: "/transaction/summary/type",
        MONTHLY: "/transaction/summary/monthly"
    }
};
