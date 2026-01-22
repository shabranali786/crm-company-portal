const ApiRequest = {
  // Authentication
  auth: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    profile: "/api/auth/profile",
  },

  // Users Management
  users: {
    list: "/users",
    show: (id) => `/users/${id}`,
    create: "/users",
    update: (id) => `/users/${id}`,
    delete: (id) => `/users/${id}`,
    updatePermissions: (id) => `/users/${id}/permissions`,
  },

  // Companies Management (for multi-tenant CRM)
  companies: {
    list: "/api/companies",
    show: (id) => `/api/companies/${id}`,
    create: "/api/companies",
    update: (id) => `/api/companies/${id}`,
    delete: (id) => `/api/companies/${id}`,
  },

  // Roles Management
  roles: {
    list: "/api/roles",
    show: (id) => `/api/roles/${id}`,
    create: "/api/roles",
    update: (id) => `/api/roles/${id}`,
    delete: (id) => `/api/roles/${id}`,
  },

  // Permissions Management
  permissions: {
    list: "/api/permissions",
    all: "/api/permissions/all",
  },
};

export default ApiRequest;