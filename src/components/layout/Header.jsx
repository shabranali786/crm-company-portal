import React, { useState, Fragment } from "react";
import { useLocation } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../store/slices/themeSlice";
import { logout } from "../../store/slices/authSlice";
import {
  FiBell,
  FiSearch,
  FiMail,
  FiUser,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiPlus,
  FiGlobe,
  FiDollarSign,
} from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";

const Header = ({ onToggleSidebar }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.theme.isDark);
  const { user, userRole } = useSelector((state) => state.auth);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  // Generate breadcrumbs from current path
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = [{ label: "Dashboard", path: "/" }];

    let currentPath = "";
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const label =
        segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " ");
      breadcrumbs.push({ label, path: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Sample notifications for SaaS CRM
  const notifications = [
    {
      id: 1,
      title: "New Lead Assigned",
      message: "5 new leads have been assigned to your team",
      time: "2 min ago",
      type: "lead",
      unread: true,
    },
    {
      id: 2,
      title: "Company Subscription",
      message: "ABC Corp upgraded to Premium plan",
      time: "1 hour ago",
      type: "billing",
      unread: true,
    },
    {
      id: 3,
      title: "System Update",
      message: "CRM system maintenance completed",
      time: "3 hours ago",
      type: "system",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-white via-gray-50/80 to-white dark:from-slate-900 dark:via-slate-800/80 dark:to-slate-900 backdrop-blur-sm border-b border-gray-100/60 dark:border-slate-700/60 shadow-lg transition-colors duration-300">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section - Breadcrumbs & Quick Actions */}
        {/* <div className="flex items-center space-x-6 flex-1">
          
          <nav className="hidden md:flex items-center space-x-2">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.path}>
                {index > 0 && (
                  <span className="text-gray-400 text-sm">/</span>
                )}
                <button
                  className={`text-sm font-medium transition-all duration-200 hover:text-blue-600 dark:hover:text-blue-400 ${
                    index === breadcrumbs.length - 1
                      ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 rounded-md'
                  }`}
                >
                  {crumb.label}
                </button>
              </React.Fragment>
            ))}
          </nav>


          <button className="hidden lg:flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            <FiPlus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div> */}

        {/* Center Section - Search Bar */}
        <div className="hidden lg:flex items-center justify-center flex-1 max-w-2xl">
          <div className="relative w-full group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 w-5 h-5 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search leads, companies, contacts..."
                className="w-full pl-12 pr-12 py-3.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/60 dark:border-slate-600/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-400/60 dark:focus:border-blue-400/60 focus:bg-white dark:focus:bg-slate-800 transition-all duration-300 text-sm dark:text-gray-200 shadow-lg hover:shadow-xl focus:shadow-2xl placeholder:text-gray-400 dark:placeholder:text-gray-500 group-hover:border-blue-300/60 dark:group-hover:border-blue-400/60"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="flex items-center space-x-1">
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 text-xs rounded-md font-medium border border-gray-200 dark:border-slate-600">
                    ⌘
                  </kbd>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 text-xs rounded-md font-medium border border-gray-200 dark:border-slate-600">
                    K
                  </kbd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Stats, Notifications & Profile */}
        <div className="flex items-center space-x-4 flex-1 justify-end">
          {/* Notifications */}
          <Menu as="div" className="relative">
            <Menu.Button className="relative p-2.5 text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-md">
              <FiBell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95 -translate-y-1"
              enterTo="transform opacity-100 scale-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="transform opacity-100 scale-100 translate-y-0"
              leaveTo="transform opacity-0 scale-95 -translate-y-1"
            >
              <Menu.Items className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200/60 dark:border-slate-600/60 overflow-hidden z-50 focus:outline-none backdrop-blur-sm">
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-slate-50 via-blue-50/50 to-indigo-50/50 dark:from-slate-700 dark:via-blue-900/30 dark:to-indigo-900/30 border-b border-gray-100/60 dark:border-slate-600/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                        Notifications
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {unreadCount} unread messages
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium px-3 py-1 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full transition-colors duration-200">
                        Mark all read
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-96 overflow-y-auto scrollbar-modern">
                  {notifications.map((notification, index) => (
                    <Menu.Item key={notification.id}>
                      {({ active }) => (
                        <div
                          className={`px-6 py-4 transition-colors duration-200 cursor-pointer ${
                            active
                              ? "bg-gradient-to-r from-blue-50/50 to-indigo-50/30 dark:from-blue-900/20 dark:to-indigo-900/20"
                              : ""
                          } ${
                            notification.unread
                              ? "bg-blue-50/20 dark:bg-blue-900/20 border-l-3 border-blue-500 dark:border-blue-400"
                              : ""
                          } ${
                            index !== notifications.length - 1
                              ? "border-b border-gray-50 dark:border-slate-700"
                              : ""
                          }`}
                        >
                          <div className="flex items-start space-x-4">
                            <div
                              className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                                notification.type === "lead"
                                  ? "bg-gradient-to-r from-blue-500 to-blue-600"
                                  : notification.type === "billing"
                                    ? "bg-gradient-to-r from-emerald-500 to-green-500"
                                    : "bg-gradient-to-r from-gray-400 to-gray-500"
                              } shadow-sm`}
                            ></div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate pr-2">
                                  {notification.title}
                                </h4>
                                {notification.unread && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                                )}
                              </div>
                              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                  {notification.time}
                                </span>
                                <span
                                  className={`px-2 py-1 text-xs rounded-full font-medium ${
                                    notification.type === "lead"
                                      ? "bg-blue-100 text-blue-700"
                                      : notification.type === "billing"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {notification.type === "lead"
                                    ? "Lead"
                                    : notification.type === "billing"
                                      ? "Billing"
                                      : "System"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Menu.Item>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-6 py-3 bg-gray-50/80 dark:bg-slate-700/50 border-t border-gray-100 dark:border-slate-600">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`w-full text-center py-2 px-4 rounded-xl font-medium text-sm transition-all duration-200 ${
                          active
                            ? "bg-blue-600 dark:bg-blue-500 text-white shadow-md transform scale-[0.98]"
                            : "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                        }`}
                      >
                        View All Notifications
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

          {/* Messages */}
          <button className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-md">
            <FiMail className="w-5 h-5" />
          </button>

          {/* Profile Dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-3 p-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 rounded-xl transition-all duration-300 hover:shadow-md">
              <div
                className={`w-8 h-8 bg-gradient-to-r rounded-full flex items-center justify-center shadow-lg border-2 border-white ${
                  userRole === "top_super_admin"
                    ? "from-purple-500 via-pink-500 to-rose-500"
                    : userRole === "company_admin"
                      ? "from-blue-500 via-indigo-500 to-purple-500"
                      : "from-green-500 via-emerald-500 to-teal-500"
                }`}
              >
                <span className="text-white font-bold text-sm">
                  {userRole === "top_super_admin"
                    ? "SA"
                    : userRole === "company_admin"
                      ? "CA"
                      : user?.name?.charAt(0) || "U"}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {userRole === "top_super_admin"
                    ? "Platform Owner"
                    : userRole === "company_admin"
                      ? "Company Admin"
                      : "Team Member"}
                </p>
              </div>
              <FiChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300 ui-open:rotate-180" />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95 -translate-y-1"
              enterTo="transform opacity-100 scale-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="transform opacity-100 scale-100 translate-y-0"
              leaveTo="transform opacity-0 scale-95 -translate-y-1"
            >
              <Menu.Items className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200/60 dark:border-slate-600/60 overflow-hidden z-50 focus:outline-none backdrop-blur-sm">
                {/* Profile Header */}
                <div
                  className={`px-6 py-5 bg-gradient-to-br border-b border-gray-100/60 dark:border-slate-600/60 ${
                    userRole === "top_super_admin"
                      ? "from-purple-50 via-pink-50 to-rose-50 dark:from-purple-900/30 dark:via-pink-900/20 dark:to-rose-900/30"
                      : userRole === "company_admin"
                        ? "from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/30 dark:via-indigo-900/20 dark:to-purple-900/30"
                        : "from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/30 dark:via-emerald-900/20 dark:to-teal-900/30"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br rounded-2xl flex items-center justify-center shadow-xl border-2 border-white ${
                          userRole === "top_super_admin"
                            ? "from-purple-500 via-pink-500 to-rose-500"
                            : userRole === "company_admin"
                              ? "from-blue-500 via-indigo-500 to-purple-500"
                              : "from-green-500 via-emerald-500 to-teal-500"
                        }`}
                      >
                        <span className="text-white font-bold text-lg drop-shadow-sm">
                          {userRole === "top_super_admin"
                            ? "SA"
                            : userRole === "company_admin"
                              ? "CA"
                              : user?.name?.charAt(0) || "U"}
                        </span>
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                        {user?.name || "User"}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {user?.email || "user@example.com"}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 bg-gradient-to-r text-xs rounded-full font-semibold border ${
                            userRole === "top_super_admin"
                              ? "from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700"
                              : userRole === "company_admin"
                                ? "from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700"
                                : "from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-2 ${
                              userRole === "top_super_admin"
                                ? "bg-purple-500"
                                : userRole === "company_admin"
                                  ? "bg-blue-500"
                                  : "bg-green-500"
                            }`}
                          ></span>
                          {userRole === "top_super_admin"
                            ? "Platform Owner"
                            : userRole === "company_admin"
                              ? "Company Admin"
                              : "Team Member"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-all duration-200 ${
                          active
                            ? "bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 border-r-2 border-blue-500 dark:border-blue-400"
                            : ""
                        }`}
                      >
                        <div
                          className={`p-2 rounded-xl transition-colors duration-200 ${
                            active
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          <FiUser className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            My Profile
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Manage your account
                          </p>
                        </div>
                      </button>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-all duration-200 ${
                          active
                            ? "bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 border-r-2 border-blue-500 dark:border-blue-400"
                            : ""
                        }`}
                      >
                        <div
                          className={`p-2 rounded-xl transition-colors duration-200 ${
                            active
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          <FiSettings className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Platform Settings
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            System configuration
                          </p>
                        </div>
                      </button>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-all duration-200 ${
                          active
                            ? "bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 border-r-2 border-blue-500 dark:border-blue-400"
                            : ""
                        }`}
                      >
                        <div
                          className={`p-2 rounded-xl transition-colors duration-200 ${
                            active
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          <FiDollarSign className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Billing & Revenue
                              </span>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Financial management
                              </p>
                            </div>
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-medium">
                              Active
                            </span>
                          </div>
                        </div>
                      </button>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-all duration-200 ${
                          active
                            ? "bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 border-r-2 border-blue-500 dark:border-blue-400"
                            : ""
                        }`}
                      >
                        <div
                          className={`p-2 rounded-xl transition-colors duration-200 ${
                            active
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          <FiGlobe className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            API & Integrations
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Developer access
                          </p>
                        </div>
                      </button>
                    )}
                  </Menu.Item>
                </div>

                {/* Divider */}
                <div className="mx-6 border-t border-gray-200 dark:border-slate-600"></div>

                {/* Logout */}
                <div className="p-2">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-all duration-200 ${
                          active
                            ? "bg-gradient-to-r from-red-50 to-pink-50/50 dark:from-red-900/20 dark:to-pink-900/20 border-r-2 border-red-500"
                            : ""
                        }`}
                      >
                        <div
                          className={`p-2 rounded-xl transition-colors duration-200 ${
                            active
                              ? "bg-red-500 text-white"
                              : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                          }`}
                        >
                          <FiLogOut className="w-4 h-4" />
                        </div>
                        <div>
                          <span
                            className={`text-sm font-medium ${
                              active
                                ? "text-red-700 dark:text-red-300"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            Sign Out
                          </span>
                          <p className="text-xs text-red-500 dark:text-red-400">
                            End your session
                          </p>
                        </div>
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

          {/* More Options */}
          <Menu as="div" className="relative">
            <Menu.Button className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all duration-300 hover:shadow-md">
              <BsThreeDots className="w-5 h-5" />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95 -translate-y-1"
              enterTo="transform opacity-100 scale-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="transform opacity-100 scale-100 translate-y-0"
              leaveTo="transform opacity-0 scale-95 -translate-y-1"
            >
              <Menu.Items className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200/60 dark:border-slate-600/60 overflow-hidden z-50 focus:outline-none">
                <div className="py-2">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`w-full flex items-center space-x-3 px-4 py-2.5 text-left transition-colors duration-200 ${
                          active
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                            : "text-gray-700 dark:text-gray-200"
                        }`}
                      >
                        <FiSettings className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Quick Settings
                        </span>
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleToggleTheme}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors duration-200 ${
                          active
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-200"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="w-4 h-4 text-center text-lg">
                            {isDark ? "☀️" : "🌙"}
                          </span>
                          <span className="text-sm font-medium">
                            {isDark ? "Light Mode" : "Dark Mode"}
                          </span>
                        </div>
                        <div
                          className={`w-8 h-4 rounded-full transition-colors duration-200 ${
                            isDark ? "bg-blue-500" : "bg-gray-300"
                          } relative`}
                        >
                          <div
                            className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform duration-200 ${
                              isDark ? "translate-x-4" : "translate-x-0.5"
                            }`}
                          ></div>
                        </div>
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`w-full flex items-center space-x-3 px-4 py-2.5 text-left transition-colors duration-200 ${
                          active
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                            : "text-gray-700 dark:text-gray-200"
                        }`}
                      >
                        <span className="w-4 h-4 text-center text-lg">🔧</span>
                        <span className="text-sm font-medium">
                          System Tools
                        </span>
                      </button>
                    )}
                  </Menu.Item>
                  <hr className="my-2 mx-2 border-gray-200 dark:border-slate-600" />
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`w-full flex items-center space-x-3 px-4 py-2.5 text-left transition-colors duration-200 ${
                          active
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                            : "text-gray-700 dark:text-gray-200"
                        }`}
                      >
                        <span className="w-4 h-4 text-center text-lg">❓</span>
                        <span className="text-sm font-medium">
                          Help & Support
                        </span>
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="lg:hidden px-4 pb-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
