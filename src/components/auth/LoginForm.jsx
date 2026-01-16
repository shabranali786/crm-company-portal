import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser } from "react-icons/fi";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../store/slices/authSlice";
import axios from "axios";
import { BsFillBuildingFill } from "react-icons/bs";

const LoginForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState("top_super_admin");

  const [formData, setFormData] = useState({
    email: "super@crmplatform.com",
    password: "admin123",
    companyDomain: "",
  });

  const demoCredentials = {
    top_super_admin: {
      email: "super@crmplatform.com",
      password: "admin123",
      label: "Platform Super Admin",
      description: "Manage entire CRM platform",
    },
    company_admin: {
      email: "admin@techcorp.com",
      password: "company123",
      companyDomain: "techcorp.com",
      label: "Company Administrator",
      description: "Manage your company and team",
    },
    company_user: {
      email: "sales@techcorp.com",
      password: "sales123",
      companyDomain: "techcorp.com",
      label: "Company User",
      description: "Access your leads and tasks",
    },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginTypeChange = (type) => {
    setLoginType(type);
    const credentials = demoCredentials[type];
    setFormData({
      email: credentials.email,
      password: credentials.password,
      companyDomain: credentials.companyDomain || "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const response = await axios.get("http://localhost:3001/users");
      const users = response.data;

      const user = users.find(
        (u) => u.email === formData.email && u.password === formData.password
      );

      if (user) {
        if (
          (user.role === "company_admin" || user.role === "company_user") &&
          formData.companyDomain
        ) {
          const companyResponse = await axios.get(
            `http://localhost:3001/companies/${user.companyId}`
          );
          const company = companyResponse.data;

          if (company.domain !== formData.companyDomain) {
            dispatch(loginFailure("Invalid company domain"));
            return;
          }
        }

        const token = `token_${user.id}_${Date.now()}`;

        dispatch(
          loginSuccess({
            user: {
              ...user,
              password: undefined,
            },
            token,
          })
        );
      } else {
        dispatch(loginFailure("Invalid email or password"));
      }
    } catch (error) {
      dispatch(loginFailure("Network error. Please try again."));
    }
  };

  const currentDemo = demoCredentials[loginType];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-xl">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            CRM Pro
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {currentDemo.description}
          </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-col space-y-3">
            {Object.entries(demoCredentials).map(([type, cred]) => (
              <button
                key={type}
                type="button"
                onClick={() => handleLoginTypeChange(type)}
                className={`p-4 rounded-xl text-left transition-all duration-300 border-2 ${
                  loginType === type
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg transform scale-[1.02]"
                    : "border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      type === "top_super_admin"
                        ? "bg-purple-100 dark:bg-purple-900/30"
                        : type === "company_admin"
                        ? "bg-blue-100 dark:bg-blue-900/30"
                        : "bg-green-100 dark:bg-green-900/30"
                    }`}
                  >
                    {type === "top_super_admin" ? (
                      <FiUser className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    ) : type === "company_admin" ? (
                      <BsFillBuildingFill className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <FiUser className="w-5 h-5 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`font-semibold text-sm ${
                        loginType === type
                          ? "text-blue-700 dark:text-blue-300"
                          : "text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      {cred.label}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {cred.email}
                    </p>
                  </div>
                  {loginType === type && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200/60 dark:border-slate-600/60 p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-5 h-5" />
                  ) : (
                    <FiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {(loginType === "company_admin" ||
              loginType === "company_user") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Domain
                </label>
                <div className="relative">
                  <BsFillBuildingFill className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    name="companyDomain"
                    value={formData.companyDomain}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    placeholder="e.g., yourcompany.com"
                    required
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <p className="text-red-700 dark:text-red-400 text-sm font-medium">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                loading ? "animate-pulse" : ""
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 text-sm mb-2">
              Demo Credentials
            </h4>
            <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
              <p>
                <strong>Email:</strong> {currentDemo.email}
              </p>
              <p>
                <strong>Password:</strong> {currentDemo.password}
              </p>
              {currentDemo.companyDomain && (
                <p>
                  <strong>Domain:</strong> {currentDemo.companyDomain}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
