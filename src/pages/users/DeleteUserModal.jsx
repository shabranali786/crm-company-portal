import { Fragment } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import { BsX, BsTrash, BsExclamationTriangle, BsPersonFill } from "react-icons/bs";

export default function DeleteUserModal({ open, onClose, user, onConfirm, loading }) {
  if (!user) return null;

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[9999]" onClose={() => {}}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-700 px-6 py-4">
                  <DialogTitle className="text-xl font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <BsTrash />
                    Delete User
                  </DialogTitle>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                    disabled={loading}
                  >
                    <BsX size={24} />
                  </button>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                  {/* Warning Icon */}
                  <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                    <BsExclamationTriangle className="size-8 text-red-600 dark:text-red-400" />
                  </div>

                  {/* User Info */}
                  <div className="mb-6 text-center">
                    <div className="mb-4 flex items-center justify-center gap-3">
                      {user.avatar ? (
                        <img
                          className="size-12 rounded-full object-cover"
                          src={user.avatar}
                          alt={user.name}
                        />
                      ) : (
                        <div className="size-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <BsPersonFill className="text-white text-lg" />
                        </div>
                      )}
                      <div className="text-left">
                        <p className="font-medium text-gray-900 dark:text-slate-100">
                          {user.name || "N/A"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          {user.email || "N/A"}
                        </p>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">
                      Are you absolutely sure?
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
                      This action cannot be undone. This will permanently delete the user account and remove all associated data.
                    </p>
                    
                    {/* Warning List */}
                    <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-left">
                      <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                        This will permanently delete:
                      </p>
                      <ul className="text-xs text-red-700 dark:text-red-300 space-y-1">
                        <li>• User profile and account information</li>
                        <li>• All assigned roles and permissions</li>
                        <li>• Team memberships and associations</li>
                        <li>• User activity history and logs</li>
                        <li>• Any data created or modified by this user</li>
                      </ul>
                    </div>
                  </div>

                  {/* Confirmation Input */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-700 dark:text-slate-300 mb-2">
                      Please type <strong className="text-red-600 dark:text-red-400">DELETE</strong> to confirm:
                    </p>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-red-300 dark:border-red-700 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500 dark:bg-slate-900 dark:text-slate-100"
                      placeholder="Type DELETE to confirm"
                      id="delete-confirmation"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-outline"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById("delete-confirmation");
                      if (input && input.value === "DELETE") {
                        handleConfirm();
                      } else {
                        input?.focus();
                        input?.classList.add("border-red-500", "ring-2", "ring-red-500");
                      }
                    }}
                    className="btn bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 focus:ring-red-500"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin size-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Deleting...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <BsTrash />
                        Delete User
                      </div>
                    )}
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