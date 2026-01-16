import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiUserCheck,
  // FiBarChart3,
  FiSettings,
  FiChevronDown,
  FiMenu,
  // FiBuilding,
  FiBarChart,
} from "react-icons/fi";
import { BsFillBuildingFill } from "react-icons/bs";
import { useSelector } from "react-redux";

const Sidebar = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const { user, userRole } = useSelector((state) => state.auth);

  // Role-based menu configuration
  const getAllMenuItems = () => {
    const baseMenuItems = [
      {
        title: "Dashboard",
        icon: FiHome,
        path: "/",
        badge: null,
        roles: ["top_super_admin", "company_admin", "company_user"],
      }
    ];

    // Top Super Admin - Full platform access
    if (userRole === "top_super_admin") {
      return [
        ...baseMenuItems,
        {
          title: "Company Management",
          icon: BsFillBuildingFill,
          path: "/companies",
          badge: null,
          roles: ["top_super_admin"],
          subItems: [
            { title: "All Companies", path: "/companies" },
            { title: "Add Company", path: "/companies/add" },
            { title: "Company Settings", path: "/companies/settings" },
          ],
        },
        {
          title: "Platform Users",
          icon: FiUserCheck,
          path: "/platform-users",
          badge: null,
          roles: ["top_super_admin"],
          subItems: [
            { title: "All Platform Users", path: "/platform-users" },
            { title: "Company Admins", path: "/platform-users/admins" },
            { title: "System Settings", path: "/platform-users/system" },
          ],
        },
        {
          title: "Platform Analytics",
          icon: FiBarChart,
          path: "/platform-analytics",
          badge: "New",
          roles: ["top_super_admin"],
        },
        {
          title: "Platform Settings",
          icon: FiSettings,
          path: "/platform-settings",
          badge: null,
          roles: ["top_super_admin"],
          subItems: [
            { title: "General Settings", path: "/platform-settings/general" },
            { title: "Billing & Plans", path: "/platform-settings/billing" },
            { title: "API Management", path: "/platform-settings/api" },
            { title: "Security", path: "/platform-settings/security" },
          ],
        },
      ];
    }

    // Company Admin - Company management access
    if (userRole === "company_admin") {
      return [
        ...baseMenuItems,
        {
          title: "Lead Management",
          icon: FiUsers,
          path: "/leads",
          badge: null,
          roles: ["company_admin"],
          subItems: [
            { title: "All Leads", path: "/leads" },
            { title: "Add Lead", path: "/leads/add" },
            { title: "Lead Reports", path: "/leads/reports" },
            { title: "Lead Sources", path: "/leads/sources" },
          ],
        },
        {
          title: "Team Management",
          icon: FiUserCheck,
          path: "/team",
          badge: null,
          roles: ["company_admin"],
          subItems: [
            { title: "All Team Members", path: "/team" },
            { title: "Add Team Member", path: "/team/add" },
            { title: "Roles & Permissions", path: "/team/roles" },
            { title: "Performance", path: "/team/performance" },
          ],
        },
        {
          title: "Company Analytics",
          icon: FiBarChart,
          path: "/analytics",
          badge: "New",
          roles: ["company_admin"],
        },
        {
          title: "Company Settings",
          icon: FiSettings,
          path: "/settings",
          badge: null,
          roles: ["company_admin"],
          subItems: [
            { title: "Company Profile", path: "/settings/profile" },
            { title: "Integrations", path: "/settings/integrations" },
            { title: "Notifications", path: "/settings/notifications" },
            { title: "Security", path: "/settings/security" },
          ],
        },
      ];
    }

    // Company User - Limited access
    if (userRole === "company_user") {
      return [
        ...baseMenuItems,
        {
          title: "My Leads",
          icon: FiUsers,
          path: "/my-leads",
          badge: null,
          roles: ["company_user"],
          subItems: [
            { title: "Assigned Leads", path: "/my-leads" },
            { title: "Add Lead", path: "/my-leads/add" },
            { title: "My Performance", path: "/my-leads/performance" },
          ],
        },
        {
          title: "My Profile",
          icon: FiSettings,
          path: "/profile",
          badge: null,
          roles: ["company_user"],
          subItems: [
            { title: "Personal Settings", path: "/profile/settings" },
            { title: "Change Password", path: "/profile/password" },
            { title: "Notifications", path: "/profile/notifications" },
          ],
        },
      ];
    }

    return baseMenuItems;
  };

  const menuItems = getAllMenuItems();

  const [expandedItems, setExpandedItems] = React.useState({});

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

  const isSubItemActive = (subItems) => {
    return subItems?.some((item) => location.pathname === item.path);
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-white via-white to-gray-50/80 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900/80 backdrop-blur-sm border-r border-gray-100 dark:border-slate-700 shadow-2xl transition-all duration-500 ease-out z-50 flex flex-col ${
          isCollapsed ? "w-16" : "w-64"
        }`}
        style={{
          boxShadow: '0 0 50px rgba(0, 0, 0, 0.08), 0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100/60 dark:border-slate-700/60 bg-gradient-to-r from-transparent via-blue-50/30 dark:via-blue-900/20 to-transparent">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-indigo-800 dark:from-gray-200 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">CRM Pro</span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 hover:shadow-md transition-all duration-300 transform hover:scale-105"
          >
            <FiMenu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 flex-1 overflow-y-auto scrollbar-modern pb-20">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExpanded = expandedItems[item.title];
              const isItemActive =
                isActive(item.path) || isSubItemActive(item.subItems);

              return (
                <li key={item.title}>
                  {/* Main Menu Item */}
                  <div className="relative">
                    {hasSubItems ? (
                      <button
                        onClick={() => toggleExpanded(item.title)}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-left transition-all duration-300 group transform hover:scale-[1.02] hover:translate-x-1 ${
                          isItemActive
                            ? "bg-gradient-to-r from-blue-50 via-blue-50 to-indigo-50 dark:from-blue-900/30 dark:via-blue-800/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-400 border-r-3 border-blue-600 dark:border-blue-500 shadow-lg shadow-blue-100/50 dark:shadow-blue-900/20"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:via-blue-50/30 hover:to-indigo-50/30 dark:hover:from-slate-800 dark:hover:via-blue-900/20 dark:hover:to-indigo-900/20 hover:text-gray-800 dark:hover:text-gray-200 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent
                            className={`w-5 h-5 transition-all duration-300 transform group-hover:scale-110 ${
                              isItemActive
                                ? "text-blue-700 dark:text-blue-400 drop-shadow-sm"
                                : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                            }`}
                          />
                          {!isCollapsed && (
                            <span className="text-sm font-medium dark:text-gray-200">
                              {item.title}
                            </span>
                          )}
                        </div>

                        {!isCollapsed && (
                          <div className="flex items-center space-x-2">
                            {item.badge && (
                              <span className="px-2.5 py-1 text-xs bg-gradient-to-r from-emerald-100 to-green-100 text-green-700 rounded-full font-medium shadow-sm border border-green-200/50 animate-pulse">
                                {item.badge}
                              </span>
                            )}
                            <FiChevronDown
                              className={`w-4 h-4 transition-all duration-300 transform ${
                                isExpanded ? "rotate-180 scale-110" : "group-hover:scale-110"
                              }`}
                            />
                          </div>
                        )}
                      </button>
                    ) : (
                      <NavLink
                        to={item.path}
                        className={({ isActive }) => `
                          flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-300 group transform hover:scale-[1.02] hover:translate-x-1
                          ${
                            isActive
                              ? "bg-gradient-to-r from-blue-50 via-blue-50 to-indigo-50 dark:from-blue-900/30 dark:via-blue-800/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-400 border-r-3 border-blue-600 dark:border-blue-500 shadow-lg shadow-blue-100/50 dark:shadow-blue-900/20"
                              : "text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:via-blue-50/30 hover:to-indigo-50/30 dark:hover:from-slate-800 dark:hover:via-blue-900/20 dark:hover:to-indigo-900/20 hover:text-gray-800 dark:hover:text-gray-200 hover:shadow-md"
                          }
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent
                            className={`w-5 h-5 transition-all duration-300 transform group-hover:scale-110 ${
                              isActive(item.path)
                                ? "text-blue-700 dark:text-blue-400 drop-shadow-sm"
                                : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                            }`}
                          />
                          {!isCollapsed && (
                            <span className="text-sm font-medium dark:text-gray-200">
                              {item.title}
                            </span>
                          )}
                        </div>

                        {!isCollapsed && item.badge && (
                          <span className="px-2.5 py-1 text-xs bg-gradient-to-r from-emerald-100 to-green-100 text-green-700 rounded-full font-medium shadow-sm border border-green-200/50 animate-pulse">
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    )}

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 px-4 py-3 bg-gradient-to-r from-gray-800 via-gray-800 to-gray-900 text-white text-sm rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-50 shadow-2xl border border-gray-700">
                        <span className="font-medium">{item.title}</span>
                        {item.badge && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-gradient-to-r from-emerald-400 to-green-400 text-gray-900 rounded-full font-semibold">
                            {item.badge}
                          </span>
                        )}
                        <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-6 border-transparent border-r-gray-800"></div>
                      </div>
                    )}
                  </div>

                  {/* Sub Menu Items */}
                  {hasSubItems && !isCollapsed && (
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-out transform ${
                        isExpanded
                          ? "max-h-48 opacity-100 translate-y-0"
                          : "max-h-0 opacity-0 -translate-y-2"
                      }`}
                    >
                      <ul className="ml-6 mt-2 space-y-1 border-l-2 border-blue-200/60 dark:border-blue-800/60 pl-2">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.path}>
                            <NavLink
                              to={subItem.path}
                              className={({ isActive }) => `
                                block pl-4 pr-3 py-2.5 text-sm rounded-lg transition-all duration-300 transform hover:translate-x-1
                                ${
                                  isActive
                                    ? "text-blue-700 dark:text-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 font-semibold border-r-2 border-blue-600 dark:border-blue-500 shadow-md"
                                    : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent dark:hover:from-blue-900/20 dark:hover:to-transparent"
                                }
                              `}
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
            })}
          </ul>
        </nav>

        {/* User Profile Section */}
        {!isCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100/60 dark:border-slate-700/60 bg-gradient-to-t from-gray-50/90 via-white/50 to-transparent dark:from-slate-900/90 dark:via-slate-800/50 backdrop-blur-sm z-10">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-r rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300 border-2 border-white ${
                userRole === 'top_super_admin' 
                  ? 'from-purple-500 via-pink-500 to-rose-500'
                  : userRole === 'company_admin'
                  ? 'from-blue-500 via-indigo-500 to-purple-500'
                  : 'from-green-500 via-emerald-500 to-teal-500'
              }`}>
                <span className="text-white font-bold text-sm drop-shadow-sm">
                  {userRole === 'top_super_admin' 
                    ? 'SA' 
                    : userRole === 'company_admin'
                    ? 'CA'
                    : user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-300 bg-clip-text text-transparent truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-medium">
                  {userRole === 'top_super_admin' 
                    ? 'Platform Owner'
                    : userRole === 'company_admin'
                    ? 'Company Admin'
                    : 'Team Member'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default Sidebar;
