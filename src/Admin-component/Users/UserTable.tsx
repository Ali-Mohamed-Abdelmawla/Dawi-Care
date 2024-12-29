// UsersTable.tsx
import React, { useState } from "react";
import { Modal, Box, Button } from "@mui/material";
import DataGrid from "../../helper/Styled-Table/CustomDataGrid";
import { User } from "./userInterfaces";
import UserIdCard from "./UserIdCard";
import NotFound from "../../helper/notFound-component/Not-Found";
import { formatDate, roles } from "./UserUtils";
import { GridRenderCellParams, GridColDef } from "@mui/x-data-grid";

interface UsersTableProps {
  users: User[];
  handleEditClick: (user: User) => void;
  handleDeleteClick: (userId: number) => void;
}

type UserRole = keyof typeof roles;

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  // handleEditClick,
  handleDeleteClick,
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleOpenDetails = (user: User) => {
    setSelectedUser(user);
  };

  const handleCloseDetails = () => {
    setSelectedUser(null);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "الاسم",
      align: "left",
      flex: 1,
      resizable: false,
    },
    {
      field: "email",
      headerName: "البريد الالكتروني",
      align: "left",
      flex: 1,
      resizable: false,
    },

    {
      field: "role",
      headerName: "نوع المستخدم",
      align: "left",
      flex: 0.7,
      resizable: false,
      renderCell: (params: GridRenderCellParams) =>
        roles[params.value as UserRole],
    },
    {
      field: "created_at",
      headerName: "تاريخ انشاء الحساب",
      align: "left",
      flex: 1,
      resizable: false,
      renderCell: (params: GridRenderCellParams) => formatDate(params.value),
    },
    {
      field: "actions",
      headerName: "الاعدادات",
      align: "left",
      flex: 2,
      resizable: false,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <Button
            className="tableBtn"
            onClick={() => handleOpenDetails(params.row)}
          >
            تفاصيل
          </Button>
          {/* <button className="tableBtn" onClick={() => handleEditClick(params.row)}>
            تعديل
          </button> */}
          <Button
            className="tableBtn"
            onClick={() => handleDeleteClick(params.row.id)}
          >
            حذف
          </Button>
        </>
      ),
    },
  ];

  const rows = users.map((user) => ({
    ...user, // Spread the rest of the user properties
  }));

  if (users.length === 0) {
    return <NotFound />;
  }

  return (
    <div className="table-wrapper" style={{ flex: 1, overflow: "hidden" }}>
      <h1 style={{ marginBottom: "20px" }}>المستخدمون</h1>
      <DataGrid
        getRowId={(row) => row.id}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 8, 11]}
      />
      <Modal
        open={selectedUser !== null}
        onClose={handleCloseDetails}
        aria-labelledby="user-details-modal"
        aria-describedby="user-details-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: "90%",
            maxHeight: "90%",
            overflow: "auto",
          }}
        >
          {selectedUser && <UserIdCard user={selectedUser} />}
        </Box>
      </Modal>
    </div>
  );
};

export default UsersTable;
