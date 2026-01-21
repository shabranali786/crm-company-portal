import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiUserCheck,
  FiSettings,
  FiChevronDown,
  FiMenu,
  FiBarChart,
  FiFileText,
  FiDollarSign,
  FiShield,
  FiLayers,
  FiBriefcase,
  FiMail,
  FiGlobe,
} from "react-icons/fi";
import { BsFillBuildingFill, BsGraphUp, BsPeople, BsGear } from "react-icons/bs";
import { useSelector } from "react-redux";
import { checkPermission } from "../../utils/permissions";

// ============================================
// CRM OWNER MENUS (Platform Level - Completely Separate)
// ============================================
const crmOwnerMenuItems = [
  {
    title: "Dashboard",
    icon: FiHome,
    path: "/",
  },
  {
    title: "Company Management",
    icon: BsFillBuildingFill,
    path: "/companies",
    subItems: [
      { title: "All Companies", path: "/companies" },
      { title: "Add Company", path: "/companies/add" },
      { title: "Subscriptions", path: "/companies/subscriptions" },
    ],
  },
  {
    title: "Platform Analytics",
    icon: BsGraphUp,
    path: "/platform-analytics",
    badge: "New",
  },
  {
    title: "Platform Users",
    icon: BsPeople,
    path: "/platform-users",
    subItems: [
      { title: "All Admins", path: "/platform-users" },
      { title: "Activity Logs", path: "/platform-users/logs" },
    ],
  },
  {
    title: "Billing & Plans",
    icon: FiDollarSign,
    path: "/billing",
    subItems: [
      { title: "Subscription Plans", path: "/billing/plans" },
      { title: "Invoices", path: "/billing/invoices" },
      { title: "Payment History", path: "/billing/history" },
    ],
  },
  {
    title: "Platform Settings",
    icon: BsGear,
    path: "/platform-settings",
    subItems: [
      { title: "General", path: "/platform-settings/general" },
      { title: "Security", path: "/platform-settings/security" },
      { title: "API Keys", path: "/platform-settings/api" },
    ],
  },
];

// ============================================
// COMPANY MENUS (For company_owner & company_user)
// Permission-based show/hide
// ============================================
const companyMenuItems = [
  {
    title: "Dashboard",
    icon: FiHome,
    path: "/",
    type: "single",
    permissions: ["dashboard.index"],
  },
  {
    title: "Sales & Billing",
    icon: FiDollarSign,
    type: "group",
    open_when: ["/leads", "/invoices", "/customer"],
    items: [
      { title: "Leads", path: "/leads", permissions: ["lead.index"] },
      { title: "Customer", path: "/customer", permissions: ["customer.index"] },
      { title: "Invoices", path: "/invoices", permissions: ["invoice.index"] },
    ],
  },
  {
    title: "Finance",
    icon: FiBriefcase,
    type: "group",
    open_when: ["/transactions", "/chargebacks", "/expenses"],
    items: [
      { title: "Transactions", path: "/transactions", permissions: ["payment.index"] },
      { title: "Chargebacks", path: "/chargebacks", permissions: ["chargeback.index"] },
      { title: "Expenses", path: "/expenses", permissions: ["expenses.index"] },
    ],
  },
  {
    title: "Reports",
    icon: FiBarChart,
    type: "group",
    open_when: ["/reports", "/unit-reports", "/sales-reports"],
    items: [
      { title: "Unit Report", path: "/unit-reports", permissions: ["unit-report.index"] },
      { title: "Sales Report", path: "/sales-reports", permissions: ["sales-report.index"] },
      { title: "Team Report", path: "/team-reports", permissions: ["team-wise-report.index"] },
    ],
  },
  {
    title: "Marketing",
    icon: FiMail,
    type: "group",
    open_when: ["/campaigns", "/contact-list"],
    items: [
      { title: "Campaigns", path: "/campaigns", permissions: ["campaign.index"] },
      { title: "Contact List", path: "/contact-list", permissions: ["contact-list.index"] },
    ],
  },
  {
    title: "Access Control",
    icon: FiShield,
    type: "group",
    open_when: ["/users", "/teams", "/roles", "/permissions"],
    items: [
      { title: "Users", path: "/users", permissions: ["user.index"] },
      { title: "Teams", path: "/teams", permissions: ["team.index"] },
      { title: "Roles", path: "/roles", permissions: ["role.index"] },
      { title: "Permissions", path: "/permissions", permissions: ["permission.index"] },
    ],
  },
  {
    title: "Settings",
    icon: FiSettings,
    path: "/settings",
    type: "single",
    permissions: ["settings.index"],
  },
];

const Sidebar = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const { user, userRole } = useSelector((state) => state.auth);
  const [expandedItems, setExpandedItems] = useState({});

  // Check if current user is CRM Owner
  const isCrmOwner = userRole === "crm_owner";

  // Filter company menus based on permissions
  const getFilteredCompanyMenus = () => {
    return companyMenuItems
      .map((menuItem) => {
        if (menuItem.type === "single") {
          return checkPermission(user, menuItem.permissions) ? menuItem : null;
        } else if (menuItem.type === "group") {
          const filteredSubItems = menuItem.items?.filter((subItem) =>
            checkPermission(user, subItem.permissions)
          );
          if (filteredSubItems && filteredSubItems.length > 0) {
            return { ...menuItem, items: filteredSubItems };
          }
          return null;
        }
        return menuItem;
      })
      .filter(Boolean);
  };

  // Get menu items based on user role
  const menuItems = isCrmOwner ? crmOwnerMenuItems : getFilteredCompanyMenus();

  // Auto-expand groups based on current route
  useEffect(() => {
    if (!isCrmOwner) {
      const newExpanded = {};
      companyMenuItems.forEach((item) => {
        if (item.type === "group" && item.open_when) {
          const shouldOpen = item.open_when.some((pattern) =>
            location.pathname.includes(pattern)
          );
          if (shouldOpen) {
            newExpanded[item.title] = true;
          }
        }
      });
      setExpandedItems((prev) => ({ ...prev, ...newExpanded }));
    }
  }, [location.pathname, isCrmOwner]);

  const toggleExpanded = (title) => {
    if (isCollapsed) return;
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const isSubItemActive = (items) => {
    return items?.some((item) => location.pathname === item.path);
  };

  // Render menu item (works for both CRM Owner and Company menus)
  const renderMenuItem = (item, index) => {
    const IconComponent = item.icon;
    const hasSubItems = item.subItems?.length > 0 || item.items?.length > 0;
    const subItems = item.subItems || item.items || [];
    const isExpanded = expandedItems[item.title];
    const isItemActive = isActive(item.path) || isSubItemActive(subItems);

    return (
      <li key={item.title}>
        <div className="relative group">
          {hasSubItems ? (
            <button
              onClick={() => toggleExpanded(item.title)}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-left transition-all duration-300 ${
                isItemActive
                  ? "bg-gradient-to-r from-blue-50 via-blue-50 to-indigo-50 dark:from-blue-900/30 dark:via-blue-800/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-400 shadow-lg"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-indigo-50/30 dark:hover:from-slate-800 dark:hover:to-indigo-900/20"
              }`}
            >
              <div className="flex items-center space-x-3">
                <IconComponent
                  className={`w-5 h-5 transition-all duration-300 ${
                    isItemActive
                      ? "text-blue-700 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                />
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.title}</span>
                )}
              </div>

              {!isCollapsed && (
                <div className="flex items-center space-x-2">
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full font-medium">
                      {item.badge}
                    </span>
                  )}
                  <FiChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </div>
              )}
            </button>
          ) : (
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-50 via-blue-50 to-indigo-50 dark:from-blue-900/30 dark:via-blue-800/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-400 shadow-lg"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-indigo-50/30 dark:hover:from-slate-800 dark:hover:to-indigo-900/20"
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <IconComponent
                  className={`w-5 h-5 ${
                    isActive(item.path)
                      ? "text-blue-700 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                />
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.title}</span>
                )}
              </div>

              {!isCollapsed && item.badge && (
                <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full font-medium">
                  {item.badge}
                </span>
              )}
            </NavLink>
          )}

          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-50 shadow-xl">
              {item.title}
            </div>
          )}
        </div>

        {/* Sub Menu Items */}
        {hasSubItems && !isCollapsed && (
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <ul className="ml-6 mt-2 space-y-1 border-l-2 border-blue-200/60 dark:border-blue-800/60 pl-2">
              {subItems.map((subItem) => (
                <li key={subItem.path}>
                  <NavLink
                    to={subItem.path}
                    className={({ isActive }) =>
                      `block pl-4 pr-3 py-2 text-sm rounded-lg transition-all duration-300 ${
                        isActive
                          ? "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 font-semibold"
                          : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                      }`
                    }
                  >
                    {subItem.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </li>
    );
  };

  return (
    <>
      <div
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-white via-white to-gray-50/80 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900/80 border-r border-gray-100 dark:border-slate-700 shadow-2xl transition-all duration-500 z-50 flex flex-col ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100/60 dark:border-slate-700/60">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-lg ${
                isCrmOwner
                  ? "bg-gradient-to-r from-purple-600 to-pink-600"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600"
              }`}>
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-indigo-800 dark:from-gray-200 dark:to-indigo-400 bg-clip-text text-transparent">
                {isCrmOwner ? "CRM Platform" : "CRM Pro"}
              </span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-300"
          >
            <FiMenu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 flex-1 overflow-y-auto scrollbar-modern pb-20">
          {!isCollapsed && (
            <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {isCrmOwner ? "Platform" : "Navigation"}
            </div>
          )}
          <ul className="space-y-1">
            {menuItems.map((item, index) => renderMenuItem(item, index))}
          </ul>
        </nav>

        {/* User Profile Section */}
        {!isCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100/60 dark:border-slate-700/60 bg-gradient-to-t from-gray-50/90 to-transparent dark:from-slate-900/90">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white ${
                  isCrmOwner
                    ? "bg-gradient-to-r from-purple-500 to-pink-500"
                    : userRole === "company_owner"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                    : "bg-gradient-to-r from-green-500 to-emerald-500"
                }`}
              >
                <span className="text-white font-bold text-sm">
                  {user?.name?.charAt(0) || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {isCrmOwner
                    ? "Platform Owner"
                    : userRole === "company_owner"
                    ? "Company Admin"
                    : "Team Member"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default Sidebar;
