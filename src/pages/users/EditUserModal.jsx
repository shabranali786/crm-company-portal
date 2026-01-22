import { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import Select from "react-select";
import { useSelectStyles } from "../../hooks/useSelectStyles";
import { BsX, BsEye, BsEyeSlash } from "react-icons/bs";

export default function EditUserModal({ open, onClose, user, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: null,
    status: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const selectStyles = useSelectStyles();

  const roleOptions = [
    { value: "superadmin", label: "SuperAdmin" },
    { value: "sales_manager", label: "Sales Manager" },
    { value: "developer", label: "Developer" },
    { value: "support_agent", label: "Support Agent" },
    { value: "marketing_specialist", label: "Marketing Specialist" },
    { value: "content_manager", label: "Content Manager" },
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  // Populate form when user data changes
  useEffect(() => {
    if (user && open) {
      const userRole = user.roles && user.roles.length > 0 
        ? roleOptions.find(role => role.label === user.roles[0].name) || null
        : null;

      const userStatus = statusOptions.find(status => status.value === user.status) || statusOptions[0];

      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "", // Don't populate password for security
        role: userRole,
        status: userStatus,
      });
      setErrors({});
    }
  }, [user, open]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email format is invalid";
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const submitData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role.value,
      status: formData.status.value,
    };

    // Only include password if it's provided
    if (formData.password.trim()) {
      submitData.password = formData.password;
    }

    try {
      await onSubmit(submitData);
      setErrors({});
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: null,
      status: null,
    });
    setErrors({});
    onClose();
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
              <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-700 px-6 py-4">
                  <div>
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-slate-100">
                      Edit User
                    </DialogTitle>
                    <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
                      Update user information and settings
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="rounded-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                  >
                    <BsX size={24} />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-6">
                  <div className="space-y-5">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:text-slate-100 ${
                          errors.name
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-slate-600"
                        }`}
                        placeholder="Enter full name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:text-slate-100 ${
                          errors.email
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-slate-600"
                        }`}
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Password <span className="text-xs text-gray-500">(leave blank to keep current)</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className={`w-full rounded-lg border px-3 py-2.5 pr-10 text-sm outline-none transition-colors focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:text-slate-100 ${
                            errors.password
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 dark:border-slate-600"
                          }`}
                          placeholder="Enter new password (optional)"
                          value={formData.password}
                          onChange={(e) => handleChange("password", e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300"
                        >
                          {showPassword ? <BsEyeSlash size={18} /> : <BsEye size={18} />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Role */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                          Role <span className="text-red-500">*</span>
                        </label>
                        <Select
                          options={roleOptions}
                          value={formData.role}
                          onChange={(option) => handleChange("role", option)}
                          styles={selectStyles}
                          placeholder="Select role..."
                          isSearchable
                          menuPortalTarget={document.body}
                        />
                        {errors.role && (
                          <p className="mt-1 text-xs text-red-500">{errors.role}</p>
                        )}
                      </div>

                      {/* Status */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                          Status
                        </label>
                        <Select
                          options={statusOptions}
                          value={formData.status}
                          onChange={(option) => handleChange("status", option)}
                          styles={selectStyles}
                          placeholder="Select status..."
                          isSearchable={false}
                          menuPortalTarget={document.body}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-8 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="btn btn-outline"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <svg className="animate-spin size-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Updating...
                        </div>
                      ) : (
                        "Update User"
                      )}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}