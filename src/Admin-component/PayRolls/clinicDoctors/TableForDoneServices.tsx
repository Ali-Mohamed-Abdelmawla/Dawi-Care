import React from "react";
import { Box, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import DataGrid from "../../../helper/Styled-Table/CustomDataGrid";
import { DoneService, Service } from "../ClinicsInterfaces";

interface DoneServicesSectionProps {
  doneServices: DoneService[];
  services: Service[];
}

const DoneServicesSection: React.FC<DoneServicesSectionProps> = ({
  doneServices,
  services,
}) => {
  // Create a map of service IDs to service names
  const serviceNameMap = React.useMemo(() => {
    return services.reduce((acc, service) => {
      acc[service.id] = service.name;
      return acc;
    }, {} as Record<number, string>);
  }, [services]);

  // Transform done services to include service name and formatted date
  const transformedServices = React.useMemo(() => {
    return doneServices.map((service) => ({
      ...service,
      serviceName: serviceNameMap[service.service_id] || "غير محدد",
      formattedDate: new Date(service.created_at).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }));
  }, [doneServices, serviceNameMap]);

  // Define columns for the data grid
  const columns: GridColDef[] = [
    {
      field: "formattedDate",
      headerName: "تاريخ الخدمة",
      flex: 1,
    },
    {
      field: "service_id",
      headerName: "رقم الخدمة",
      flex: 1,
    },
    {
      field: "serviceName",
      headerName: "اسم الخدمة",
      flex: 1,
    },
    {
      field: "count",
      headerName: "العدد",
      flex: 1,
    },
    {
      field: "total_cost",
      headerName: "التكلفة الإجمالية",
      flex: 1,
      renderCell: (params) => `${params.value} جنيه`,
    },
  ];

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      {doneServices.length > 0 ? (
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            getRowId={(row) => row.id}
            rows={transformedServices}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 8, 11]}
          />
        </Box>
      ) : (
        <Typography variant="h6" textAlign="center" sx={{ mt: 4 }}>
          لم يتم تنفيذ أي خدمات في هذه العيادة حتى الآن
        </Typography>
      )}
    </Box>
  );
};

export default DoneServicesSection;
