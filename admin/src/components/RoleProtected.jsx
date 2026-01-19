import React from "react";
import { AiOutlineStop } from "react-icons/ai";
import useAccess from "../hooks/useAccess";

const RoleProtected = ({ allowedRoles = [], children }) => {
  const { user } = useAccess();

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
        <div className="bg-white shadow-md rounded-2xl p-8 text-center max-w-md w-full border border-gray-100">
          <AiOutlineStop size={64} className="text-red-500 mb-4 mx-auto" />
          <h2 className="text-3xl font-bold mb-2 text-gray-800">
            Access Denied
          </h2>
          <p className="text-gray-500">
            You do not have permission to view this page. Please contact the
            administrator if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default RoleProtected;
