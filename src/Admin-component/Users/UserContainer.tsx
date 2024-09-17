// UsersContainer.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UsersTable from "./UserTable";
import Loader from "../../helper/loading-component/loader";
import { User } from "./userInterfaces";
import { useUserApi } from "./useUserApi";
import sweetAlertInstance from "../../helper/SweetAlert";
const UsersContainer: React.FC = () => {
  const [User, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { getAllUsers, deleteUser } = useUserApi();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching User:", error);
      sweetAlertInstance.fire({
        icon: "error",
        title: "Failed to fetch User",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (userData: User) => {
    navigate("/SystemAdmin/EditUser", { state: { editData: userData } });
  };

  const handleDeleteClick = async (userId: number) => {
    try {
      await deleteUser(userId);
      setUsers(User.filter((User) => User.id !== userId));
      sweetAlertInstance.fire({
        icon: "success",
        title: "User data removed successfully.",
      });
    } catch (error) {
      console.error("Error deleting User:", error);
      sweetAlertInstance.fire({
        icon: "error",
        title: "Failed to delete User",
      });
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <UsersTable
      users={User}
      handleEditClick={handleEditClick}
      handleDeleteClick={handleDeleteClick}
    />
  );
};

export default UsersContainer;