import React, { useState } from "react";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { SearchBox } from "../../components/SearchBox";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import ViewUserModal from "./ViewUserModal";
import DeleteUserModal from "./DeleteUserModal";
import PermissionsModal from "./PermissionsModal";
import apiAxios from "../../api/ApiAxios";
import ApiRequest from "../../api/ApiRequest";
import {
  BsArrowRepeat,
  BsPlus,
  BsThreeDotsVertical,
  BsTrash,
  BsPencil,
  BsEye,
  BsShield,
  BsPersonFill,
} from "react-icons/bs";

import { usePaginatedData } from "../../hooks/usePaginatedData";
import { usePermission } from "../../utils/permissions";

const Users = () => {
  const canCreateUser = usePermission(["user.create"]);
  const canEditUser = usePermission(["user.edit"]);
  const canDeleteUser = usePermission(["user.delete"]);
  const canViewUser = usePermission(["user.show"]);
  const canManagePermissions = usePermission(["permission.index"]);

  const [activeModal, setActiveModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    data: users,
    loading,
    totalRows,
    currentPage,
    perPage,
    searchTerm,
    setCurrentPage,
    setPerPage,
    handleSearch,
    refresh,
    fetchData,
  } = usePaginatedData(ApiRequest.users.list);

  const { user: authUser } = useSelector((state) => state.auth);

  const handleAction = (action, row) => {
    setSelectedUser(row);
    switch (action) {
      case "view":
        setActiveModal("view");
        break;
      case "edit":
        setActiveModal("edit");
        break;
      case "delete":
        setActiveModal("delete");
        break;
      case "permissions":
        setActiveModal("permissions");
        break;
      default:
        break;
    }
  };

  const hasAnyActionPermission =
    canViewUser || canEditUser || canDeleteUser || canManagePermissions;

  const columns = [
    {
      name: "User",
      selector: (row) => row.name || "N/A",
      sortable: true,
      minWidth: "200px",
      cell: (row) => (
        <div className="flex items-center gap-3 py-2">
          <div className="flex-shrink-0">
            {row.avatar ? (
              <img
                className="size-10 rounded-full object-cover"
                src={row.avatar}
                alt={row.name}
              />
            ) : (
              <div className="size-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <BsPersonFill className="text-white text-lg" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 dark:text-slate-100 truncate">
              {row.name || "N/A"}
            </div>
            <div className="text-sm text-gray-500 dark:text-slate-400 truncate">
              {row.email || "N/A"}
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "Role",
      selector: (row) =>
        Array.isArray(row.roles) && row.roles.length > 0
          ? row.roles.map((role) => role.name).join(", ")
          : "No Roles",
      sortable: true,
      minWidth: "150px",
      cell: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
          {Array.isArray(row.roles) && row.roles.length > 0
            ? row.roles.map((role) => role.name).join(", ")
            : "No Roles"}
        </span>
      ),
    },
    {
      name: "Teams",
      selector: (row) =>
        Array.isArray(row.teams) && row.teams.length > 0
          ? row.teams.map((team) => team.title || team.name).join(", ")
          : "No Teams",
      sortable: true,
      minWidth: "250px",
      cell: (row) => (
        <div className="space-y-1">
          {Array.isArray(row.teams) && row.teams.length > 0 ? (
            row.teams.slice(0, 2).map((team, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 mr-1"
              >
                {team.title || team.name}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-500 dark:text-slate-400">
              No Teams
            </span>
          )}
          {row.teams && row.teams.length > 2 && (
            <span className="text-xs text-gray-400 dark:text-slate-500">
              +{row.teams.length - 2} more
            </span>
          )}
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.status || "active",
      sortable: true,
      minWidth: "100px",
      cell: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.status === "active"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
          }`}
        >
          <span
            className={`size-1.5 rounded-full mr-1.5 ${
              row.status === "active" ? "bg-green-600" : "bg-red-600"
            }`}
          />
          {(row.status || "active").charAt(0).toUpperCase() + (row.status || "active").slice(1)}
        </span>
      ),
    },

    ...(hasAnyActionPermission
      ? [
          {
            name: "Actions",
            width: "100px",
            right: true,
            allowOverflow: true,
            button: true,
            ignoreRowClick: true,
            cell: (row) => (
              <Menu as="div" className="relative">
                <MenuButton className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-lg leading-normal transition-colors hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                  <BsThreeDotsVertical className="text-gray-500 dark:text-slate-400" />
                </MenuButton>

                <MenuItems
                  anchor="bottom end"
                  className="z-50 w-48 origin-top-right rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg transition duration-100 ease-out [--anchor-gap:4px] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                >
                  <div className="p-2">
                    {canViewUser && (
                      <MenuItem>
                        <button
                          onClick={() => handleAction("view", row)}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          <BsEye className="text-blue-500" />
                          View Details
                        </button>
                      </MenuItem>
                    )}

                    {canEditUser && (
                      <MenuItem>
                        <button
                          onClick={() => handleAction("edit", row)}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          <BsPencil className="text-yellow-500" />
                          Edit User
                        </button>
                      </MenuItem>
                    )}

                    {canManagePermissions && (
                      <MenuItem>
                        <button
                          onClick={() => handleAction("permissions", row)}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          <BsShield className="text-green-500" />
                          Permissions
                        </button>
                      </MenuItem>
                    )}

                    {(canViewUser || canEditUser || canManagePermissions) && canDeleteUser && (
                      <div className="my-1 border-t border-gray-200 dark:border-slate-700" />
                    )}

                    {canDeleteUser && (
                      <MenuItem>
                        <button
                          onClick={() => handleAction("delete", row)}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <BsTrash className="text-red-500" />
                          Delete User
                        </button>
                      </MenuItem>
                    )}
                  </div>
                </MenuItems>
              </Menu>
            ),
          },
        ]
      : []),
  ];

  const handleCreateUser = async (userData) => {
    setSubmitting(true);
    try {
      const response = await apiAxios.post(ApiRequest.users.create, userData);
      toast.success("User created successfully!");
      setActiveModal(null);
      refresh();
    } catch (error) {
      console.error("Error creating user:", error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key][0]}`);
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to create user");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    setSubmitting(true);
    try {
      const response = await apiAxios.put(
        ApiRequest.users.update(userId),
        userData
      );
      toast.success("User updated successfully!");
      setActiveModal(null);
      setSelectedUser(null);
      refresh();
    } catch (error) {
      console.error("Error updating user:", error);
      if (error.response?.status === 500) {
        toast.error(
          "Server error. Please check the data format or contact administrator."
        );
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key][0]}`);
        });
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update user. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    setSubmitting(true);
    try {
      await apiAxios.delete(ApiRequest.users.delete(userId));
      toast.success("User deleted successfully!");
      setActiveModal(null);
      setSelectedUser(null);
      refresh();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };


  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">
            Manage system users, roles, and permissions
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBox
            onSearch={handleSearch}
            placeholder="Search users..."
            size="md"
            icon="search"
            className="w-full sm:w-80"
          />

          <div className="flex gap-2">
            <button
              onClick={refresh}
              disabled={loading}
              className="btn btn-black flex items-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <svg className="animate-spin size-4" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <BsArrowRepeat size={16} />
              )}
              Refresh
            </button>

            {canCreateUser && (
              <button
                onClick={() => setActiveModal("add")}
                className="btn btn-primary flex items-center gap-2 whitespace-nowrap"
              >
                <BsPlus size={20} />
                Add User
              </button>
            )}
          </div>
        </div>
      </div>


      {/* Data Table */}
      <div className="card p-0 overflow-hidden">
        <DataTable
          className="tm-data-table"
          columns={columns}
          data={users}
          progressPending={loading}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          paginationDefaultPage={currentPage}
          paginationPerPage={perPage}
          paginationRowsPerPageOptions={[10, 20, 30, 50]}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          highlightOnHover
          pointerOnHover
          responsive
          noDataComponent={
            <div className="w-full py-20 text-center">
              <div className="mb-4 text-6xl text-gray-300 dark:text-slate-600">
                👥
              </div>
              <div className="text-xl text-gray-500 dark:text-slate-400 mb-2">
                No users found
              </div>
              <div className="text-sm text-gray-400 dark:text-slate-500">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first user'}
              </div>
            </div>
          }
        />
      </div>

      {/* Modals */}
      <AddUserModal
        open={activeModal === "add"}
        onClose={() => setActiveModal(null)}
        onSubmit={handleCreateUser}
        loading={submitting}
      />
      
      <EditUserModal
        open={activeModal === "edit"}
        onClose={() => {
          setActiveModal(null);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSubmit={(userData) => handleUpdateUser(selectedUser?.id, userData)}
        loading={submitting}
      />
      
      <ViewUserModal
        open={activeModal === "view"}
        onClose={() => {
          setActiveModal(null);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />
      
      <DeleteUserModal
        open={activeModal === "delete"}
        onClose={() => {
          setActiveModal(null);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onConfirm={() => handleDeleteUser(selectedUser?.id)}
        loading={submitting}
      />
      
      <PermissionsModal
        open={activeModal === "permissions"}
        onClose={() => {
          setActiveModal(null);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSuccess={() => {
          refresh();
        }}
      />
    </div>
  );
};

export default Users;