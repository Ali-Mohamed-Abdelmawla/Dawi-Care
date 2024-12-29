// EmployeesTable.tsx
import React, { useState } from "react";
import { Modal, Box, Button } from "@mui/material";
import DataGrid from "../../helper/Styled-Table/CustomDataGrid";
import { Employee } from "./employeeInterfaces";
import EmployeeIdCard from "./EmployeeIdCard";
import NotFound from "../../helper/notFound-component/Not-Found";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid"; // Import the type (render cell parameters' type)

interface EmployeesTableProps {
  employees: Employee[];
  handleEditClick: (employee: Employee) => void;
  handleDeleteClick: (employeeId: number) => void;
}

const EmployeesTable: React.FC<EmployeesTableProps> = ({
  employees,
  handleEditClick,
  handleDeleteClick,
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  const handleOpenDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleCloseDetails = () => {
    setSelectedEmployee(null);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "الاسم",
      type: "string",
      align: "left",
      flex: 1,
      resizable: false,
    },
    {
      field: "description",
      headerName: "التوصيف الوظيفي",
      type: "string",
      align: "left",
      flex: 1,
      resizable: false,
    },
    {
      field: "fixed_salary",
      headerName: "االراتب",
      type: "string",
      align: "left",
      flex: 0.7,
      resizable: false,
    },
    {
      field: "phone_number",
      headerName: "رقم الهاتف",
      type: "string",
      align: "left",
      flex: 1,
      resizable: false,
    },
    {
      field: "actions",
      headerName: "الاعدادات",
      align: "left",
      resizable: false,
      sortable: false,
      filterable: false,
      flex: 2,
      renderCell: (params: GridRenderCellParams<Employee>) => (
        <>
          <Button
            className="tableBtn"
            onClick={() => handleOpenDetails(params.row)}
          >
            تفاصيل
          </Button>
          <Button
            className="tableBtn"
            onClick={() => handleEditClick(params.row)}
          >
            تعديل
          </Button>
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

  const rows = employees.map((employee, index) => ({
    tableIndex: index + 1,
    ...employee, // Spread the rest of the employee properties
  }));

  if (employees.length === 0) {
    return <NotFound />;
  }

  return (
    <div className="table-wrapper" style={{ flex: 1, overflow: "hidden" }}>
      <h1 style={{ marginBottom: "20px" }}>الموظفون</h1>
      <DataGrid
        getRowId={(row) => row.tableIndex}
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
        open={selectedEmployee !== null}
        onClose={handleCloseDetails}
        aria-labelledby="employee-details-modal"
        aria-describedby="employee-details-description"
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
          {selectedEmployee && <EmployeeIdCard employee={selectedEmployee} />}
        </Box>
      </Modal>
    </div>
  );
};

export default EmployeesTable;
