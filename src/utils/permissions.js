import { useSelector } from "react-redux";
export const checkPermission = (user, requiredPermissions) => {
  if (!user) return false;

  if (user.role === "crm_owner") return true;

  // SuperAdmin (company_owner) bypasses all permission checks
  const isSuperAdmin = user?.roles?.some(
    (role) => role.toLowerCase() === "superadmin",
  );
  if (isSuperAdmin) return true;

  // No required permissions means public access
  if (!requiredPermissions || requiredPermissions.length === 0) return true;

  // Check if user has no permissions
  if (!user?.permissions || user.permissions.length === 0) return false;

  // Check if user has any of the required permissions
  return requiredPermissions.some((permission) =>
    user.permissions.includes(permission),
  );
};

/**
 * React hook for checking permissions in components
 * @param {string[]} requiredPermissions - Array of permission strings
 * @returns {boolean} - Whether user has permission
 */
export const usePermission = (requiredPermissions) => {
  const { user } = useSelector((state) => state.auth);
  return checkPermission(user, requiredPermissions);
};

/**
 * Check if user is CRM Owner (platform level)
 */
export const isCrmOwner = (user) => {
  return user?.role === "crm_owner";
};

/**
 * Check if user is Company Owner (SuperAdmin)
 */
export const isCompanyOwner = (user) => {
  return (
    user?.role === "company_owner" ||
    user?.roles?.some((role) => role.toLowerCase() === "superadmin")
  );
};

/**
 * Check if user is regular Company User
 */
export const isCompanyUser = (user) => {
  return user?.role === "company_user";
};
