// DoctorsTable.tsx
import React, { useState } from 'react';
import { Avatar, Modal, Box,Button } from '@mui/material';
import DataGrid from '../../helper/Styled-Table/CustomDataGrid';
import { Doctor } from './doctorInterfaces';
import DoctorIdCard from './DoctorIdCard';
import NotFound from '../../helper/notFound-component/Not-Found';
import { GridRenderCellParams, GridColDef } from '@mui/x-data-grid';

interface DoctorsTableProps {
  doctors: Doctor[];
  handleEditClick: (doctor: Doctor) => void;
  handleDeleteClick: (doctorId: number) => void;
}

const DoctorsTable: React.FC<DoctorsTableProps> = ({
  doctors,
  handleEditClick,
  handleDeleteClick,
}) => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const handleOpenDetails = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleCloseDetails = () => {
    setSelectedDoctor(null);
  };

  const columns: GridColDef[] = [
    {
      field: 'profile_photo',
      headerName: 'الصوره الشخصيه',
      flex: 0.5,
      renderCell: (params: GridRenderCellParams) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: "100%",
            marginRight: "5px",
          }}
        >
          <ImageCell value={`http://127.0.0.1:8000${params.value}`} />
        </div>      ),
    },
    { field: 'name', headerName: 'الاسم', align: 'left', flex: 1 ,      
    },
    { field: 'fixed_salary', headerName: 'االراتب', align: 'left', flex: 0.7 ,      
    },
    { field: 'phone_number', headerName: 'رقم الهاتف', align: 'left', flex: 1,      
    },
    {
      field: 'actions',
      headerName: 'الاعدادات',
      align: 'left',
      flex: 1,

      renderCell: (params: GridRenderCellParams) => (
        <>
          <Button className="tableBtn" onClick={() => handleOpenDetails(params.row)}>
            تفاصيل
          </Button>
          <Button className="tableBtn" onClick={() => handleEditClick(params.row)}>
            تعديل
          </Button>
          <Button className="tableBtn" onClick={() => handleDeleteClick(params.row.id)}>
            حذف
          </Button>
        </>
      ),
    },
  ];

  const rows = doctors.map((doctor, index) => ({
    rowId: index + 1,
    ...doctor, // Spread the rest of the doctor properties
  }));

  if (doctors.length === 0) {
    return <NotFound />;
  }

  return (
    <div className="table-wrapper" style={{ flex: 1, overflow: 'hidden' }}>
      <h1 style={{ marginBottom: '20px' }}>الأطباء</h1>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.rowId}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 8, 11]}
      />
      <Modal
        open={selectedDoctor !== null}
        onClose={handleCloseDetails}
        aria-labelledby="doctor-details-modal"
        aria-describedby="doctor-details-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '90%',
            maxHeight: '90%',
            overflow: 'auto',
          }}
        >
          {selectedDoctor && <DoctorIdCard doctor={selectedDoctor} />}
        </Box>
      </Modal>
    </div>
  );
};

const ImageCell: React.FC<{ value: string }> = ({ value }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Avatar
        src={value}
        alt="Profile Photo"
        sx={{ width: 40, height: 40, cursor: 'pointer' }}
        onClick={handleOpen}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <img
            src={value}
            alt="Profile Photo"
            style={{ maxWidth: '100%', maxHeight: '80vh' }}
          />
        </Box>
      </Modal>
    </>
  );
};

export default DoctorsTable;