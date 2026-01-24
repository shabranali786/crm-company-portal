import { Fragment } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import { BsX, BsPersonFill, BsCalendar, BsEnvelope, BsShield, BsPeople, BsCircleFill } from "react-icons/bs";

export default function ViewUserModal({ open, onClose, user }) {
  if (!user) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <Transition show={open} as={Fragment} appear>
      <Dialog as="div" className="relative z-[9999]" onClose={() => {}}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-700 px-6 py-4">
                  <DialogTitle className="text-xl font-bold text-gray-900 dark:text-slate-100">
                    User Details
                  </DialogTitle>
                  <button
                    onClick={onClose}
                    className="rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                  >
                    <BsX size={24} />
                  </button>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                  {/* User Avatar & Basic Info */}
                  <div className="flex items-start gap-6 mb-8">
                    <div className="flex-shrink-0">
                      {user.avatar ? (
                        <img
                          className="size-20 rounded-full object-cover border-4 border-white shadow-lg"
                          src={user.avatar}
                          alt={user.name}
                        />
                      ) : (
                        <div className="size-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white shadow-lg">
                          <BsPersonFill className="text-white text-2xl" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                        {user.name || "N/A"}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <BsEnvelope className="text-gray-400 text-sm" />
                        <span className="text-gray-600 dark:text-slate-400">{user.email || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BsCircleFill 
                          className={`text-xs ${
                            user.status === "active" ? "text-green-500" : "text-red-500"
                          }`} 
                        />
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                          }`}
                        >
                          {(user.status || "active").charAt(0).toUpperCase() + (user.status || "active").slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                          <BsPersonFill className="text-blue-500" />
                          Basic Information
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-slate-400 block">User ID</label>
                            <p className="text-gray-900 dark:text-slate-100">{user.id || "N/A"}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-slate-400 block">Full Name</label>
                            <p className="text-gray-900 dark:text-slate-100">{user.name || "N/A"}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-slate-400 block">Email Address</label>
                            <p className="text-gray-900 dark:text-slate-100">{user.email || "N/A"}</p>
                          </div>
                          {user.department && (
                            <div>
                              <label className="text-sm font-medium text-gray-500 dark:text-slate-400 block">Department</label>
                              <p className="text-gray-900 dark:text-slate-100">{user.department}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Timestamps */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                          <BsCalendar className="text-green-500" />
                          Account Information
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-slate-400 block">Created At</label>
                            <p className="text-gray-900 dark:text-slate-100">{formatDate(user.created_at)}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-slate-400 block">Last Updated</label>
                            <p className="text-gray-900 dark:text-slate-100">{formatDate(user.updated_at)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Roles & Teams */}
                    <div className="space-y-6">
                      {/* Roles */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                          <BsShield className="text-purple-500" />
                          Roles & Permissions
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-slate-400 block mb-2">Assigned Roles</label>
                            {user.roles && user.roles.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {user.roles.map((role, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                                  >
                                    {role.name}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 dark:text-slate-400">No roles assigned</p>
                            )}
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-slate-400 block mb-2">Permissions Count</label>
                            <p className="text-gray-900 dark:text-slate-100">
                              {user.permissions ? user.permissions.length : 0} permissions
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Teams */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                          <BsPeople className="text-orange-500" />
                          Team Memberships
                        </h4>
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-slate-400 block mb-2">Teams</label>
                          {user.teams && user.teams.length > 0 ? (
                            <div className="space-y-2">
                              {user.teams.map((team, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600"
                                >
                                  <div className="size-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                                    <BsPeople className="text-white text-xs" />
                                  </div>
                                  <span className="font-medium text-gray-900 dark:text-slate-100">
                                    {team.title || team.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 dark:text-slate-400">No teams assigned</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Permissions Details (if any) */}
                  {user.permissions && user.permissions.length > 0 && (
                    <div className="mt-8">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Detailed Permissions</h4>
                      <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 max-h-40 overflow-y-auto">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {user.permissions.map((permission, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-200 text-gray-800 dark:bg-slate-600 dark:text-slate-200"
                            >
                              {permission}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 dark:border-slate-700 px-6 py-4 flex justify-end">
                  <button
                    onClick={onClose}
                    className="btn btn-black"
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}