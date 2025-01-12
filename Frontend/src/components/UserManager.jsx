import React from "react";

const UserManager = ({ users }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">User Management</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user.id}
            className="p-2 border border-gray-200 rounded-lg"
          >
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManager;
