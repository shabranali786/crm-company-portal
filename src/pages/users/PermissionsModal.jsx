import { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import { BsX, BsShield, BsPersonFill, BsSearch } from "react-icons/bs";

export default function PermissionsModal({ open, onClose, user, onSuccess }) {
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Available permissions (in a real app, these would come from API)
  const availablePermissions = [
    { id: "dashboard.index", name: "Dashboard Access", category: "Dashboard" },
    { id: "user.index", name: "View Users", category: "User Management" },
    { id: "user.create", name: "Create Users", category: "User Management" },
    { id: "user.edit", name: "Edit Users", category: "User Management" },
    { id: "user.delete", name: "Delete Users", category: "User Management" },
    { id: "user.show", name: "View User Details", category: "User Management" },
    { id: "permission.index", name: "Manage Permissions", category: "User Management" },
    { id: "lead.index", name: "View Leads", category: "Lead Management" },
    { id: "lead.create", name: "Create Leads", category: "Lead Management" },
    { id: "lead.edit", name: "Edit Leads", category: "Lead Management" },
    { id: "lead.delete", name: "Delete Leads", category: "Lead Management" },
    { id: "customer.index", name: "View Customers", category: "Customer Management" },
    { id: "customer.create", name: "Create Customers", category: "Customer Management" },
    { id: "customer.edit", name: "Edit Customers", category: "Customer Management" },
    { id: "invoice.index", name: "View Invoices", category: "Billing" },
    { id: "invoice.create", name: "Create Invoices", category: "Billing" },
    { id: "invoice.edit", name: "Edit Invoices", category: "Billing" },
    { id: "campaign.index", name: "View Campaigns", category: "Marketing" },
    { id: "campaign.create", name: "Create Campaigns", category: "Marketing" },
    { id: "contact-list.index", name: "View Contact Lists", category: "Marketing" },
  ];

  // Group permissions by category
  const groupedPermissions = availablePermissions.reduce((groups, permission) => {
    const category = permission.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(permission);
    return groups;
  }, {});

  // Filter permissions based on search term
  const filteredPermissions = Object.keys(groupedPermissions).reduce((filtered, category) => {
    const categoryPermissions = groupedPermissions[category].filter(
      permission =>
        permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (categoryPermissions.length > 0) {
      filtered[category] = categoryPermissions;
    }
    
    return filtered;
  }, {});

  // Initialize selected permissions when user changes
  useEffect(() => {
    if (user && open) {
      setSelectedPermissions(user.permissions || []);
      setSearchTerm("");
    }
  }, [user, open]);

  const handlePermissionToggle = (permissionId) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };

  const handleCategoryToggle = (category) => {
    const categoryPermissionIds = groupedPermissions[category].map(p => p.id);
    const allSelected = categoryPermissionIds.every(id => selectedPermissions.includes(id));
    
    if (allSelected) {
      // Remove all permissions in this category
      setSelectedPermissions(prev => prev.filter(id => !categoryPermissionIds.includes(id)));
    } else {
      // Add all permissions in this category
      setSelectedPermissions(prev => {
        const newPermissions = [...prev];
        categoryPermissionIds.forEach(id => {
          if (!newPermissions.includes(id)) {
            newPermissions.push(id);
          }
        });
        return newPermissions;
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // In a real app, you would make an API call here
      console.log("Updating permissions for user:", user.id, selectedPermissions);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error updating permissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedPermissions([]);
    setSearchTerm("");
    onClose();
  };

  if (!user) return null;

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
              <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-700 px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img
                          className="size-10 rounded-full object-cover"
                          src={user.avatar}
                          alt={user.name}
                        />
                      ) : (
                        <div className="size-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <BsPersonFill className="text-white text-sm" />
                        </div>
                      )}
                      <div>
                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                          <BsShield className="text-purple-500" />
                          User Permissions
                        </DialogTitle>
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                          Manage permissions for {user.name}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="rounded-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                    disabled={loading}
                  >
                    <BsX size={24} />
                  </button>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                  {/* Search */}
                  <div className="mb-6">
                    <div className="relative">
                      <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search permissions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-slate-600 pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <strong>{selectedPermissions.length}</strong> of {availablePermissions.length} permissions selected
                    </p>
                  </div>

                  {/* Permissions List */}
                  <div className="space-y-6 max-h-96 overflow-y-auto">
                    {Object.keys(filteredPermissions).map(category => {
                      const categoryPermissions = filteredPermissions[category];
                      const categoryPermissionIds = categoryPermissions.map(p => p.id);
                      const allSelected = categoryPermissionIds.every(id => selectedPermissions.includes(id));
                      const someSelected = categoryPermissionIds.some(id => selectedPermissions.includes(id));

                      return (
                        <div key={category} className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
                          {/* Category Header */}
                          <div className="bg-gray-50 dark:bg-slate-700/50 px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                            <label className="flex items-center gap-3 cursor-pointer">
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={allSelected}
                                  ref={input => {
                                    if (input) input.indeterminate = someSelected && !allSelected;
                                  }}
                                  onChange={() => handleCategoryToggle(category)}
                                  className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-slate-100">
                                  {category}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-slate-400">
                                  {categoryPermissions.length} permissions
                                </p>
                              </div>
                            </label>
                          </div>

                          {/* Category Permissions */}
                          <div className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {categoryPermissions.map(permission => (
                                <label
                                  key={permission.id}
                                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedPermissions.includes(permission.id)}
                                    onChange={() => handlePermissionToggle(permission.id)}
                                    className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800"
                                  />
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900 dark:text-slate-100">
                                      {permission.name}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-slate-400">
                                      {permission.id}
                                    </p>
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {Object.keys(filteredPermissions).length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-gray-400 dark:text-slate-500 mb-2">
                        <BsSearch size={48} className="mx-auto" />
                      </div>
                      <p className="text-gray-500 dark:text-slate-400">
                        No permissions found matching "{searchTerm}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    {selectedPermissions.length} permissions selected
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="btn btn-outline"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <svg className="animate-spin size-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Saving...
                        </div>
                      ) : (
                        "Save Permissions"
                      )}
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}