import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { DoctorWage } from "../ClinicsInterfaces";
import { Service } from "../ClinicsInterfaces";

// Interface definition
interface DoneService {
  id: number;
  service_id: number;
  doctor_id: number;
  clinic_id: number;
  created_at: string;
  total_cost: string;
  count: number;
}

interface ServiceTableProps {
  data: DoneService[];
  services: Service[];
  doctors: DoctorWage[];
}

// Styled Components (keeping the original styling)
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  textAlign: "center",
  border: "1px solid lightblue",
}));

const ServiceCell = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
  border: "1px solid lightgray",
}));

const DateCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: "lightblue",
  textAlign: "center",
  border: "1px solid lightgray",
}));

const MonthTotalCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.light,
  textAlign: "center",
  border: "1px solid lightgray",
}));

// New styled component for the filters container
const FiltersContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));

const ServiceTable: React.FC<ServiceTableProps> = ({
  data,
  services,
  doctors,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [expandedYears, setExpandedYears] = useState<{
    [key: string]: boolean;
  }>({});
  const [expandedMonths, setExpandedMonths] = useState<{
    [key: string]: { [key: string]: boolean };
  }>({});

  // Add filter states
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");

  const [dateFilterMode, setDateFilterMode] = useState<"single" | "range">(
    "single"
  );
  const [singleDate, setSingleDate] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Create lookup maps for services and doctors
  const serviceMap = useMemo(() => {
    const map: Record<number, string> = {};
    services.forEach((service) => {
      map[service.id] = service.name;
    });
    return map;
  }, [services]);

  const doctorMap = useMemo(() => {
    const map: Record<number, string> = {};
    doctors.forEach((doctor) => {
      map[doctor.id] = doctor.name;
    });
    return map;
  }, [doctors]);

  // Filter and group data
  const groupedData = useMemo(() => {
    // Apply filters
    let filteredData = data;

    if (selectedDoctor) {
      filteredData = filteredData.filter(
        (item) => item.doctor_id.toString() === selectedDoctor
      );
    }
    if (selectedService) {
      filteredData = filteredData.filter(
        (item) => item.service_id.toString() === selectedService
      );
    }
    // Date filtering based on mode
    if (dateFilterMode === "single" && singleDate) {
      filteredData = filteredData.filter(
        (item) => item.created_at.split("T")[0] === singleDate
      );
    } else if (dateFilterMode === "range" && (startDate || endDate)) {
      filteredData = filteredData.filter((item) => {
        // Get just the date part of the item's created_at
        const itemDate = item.created_at.split("T")[0];

        return (
          (!startDate || itemDate >= startDate) &&
          (!endDate || itemDate <= endDate)
        );
      });
    }

    // Group the filtered data
    const grouped: {
      [year: string]: {
        [month: string]: {
          [date: string]: DoneService[];
        };
      };
    } = {};

    filteredData.forEach((item) => {
      const date = new Date(item.created_at);
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.toISOString().split("T")[0];

      if (!grouped[year]) grouped[year] = {};
      if (!grouped[year][month]) grouped[year][month] = {};
      if (!grouped[year][month][day]) grouped[year][month][day] = [];

      grouped[year][month][day].push(item);
    });

    return grouped;
  }, [
    data,
    selectedDoctor,
    selectedService,
    dateFilterMode,
    singleDate,
    startDate,
    endDate,
  ]);

  const handleDateModeChange = (
    _: React.MouseEvent<HTMLElement>,
    newMode: "single" | "range" | null
  ) => {
    if (newMode !== null) {
      setDateFilterMode(newMode);
      // Clear all date filters when switching modes
      setSingleDate("");
      setStartDate("");
      setEndDate("");
    }
  };

  const toggleYearExpansion = (year: string) => {
    setExpandedYears((prev) => ({ ...prev, [year]: !prev[year] }));
  };

  const toggleMonthExpansion = (year: string, month: string) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [year]: {
        ...prev[year],
        [month]: !prev[year]?.[month],
      },
    }));
  };

  const renderDateRows = (services: DoneService[]) =>
    services.map((service) => (
      <TableRow key={service.id}>
        <ServiceCell>
          {serviceMap[service.service_id] || "Unknown Service"}
        </ServiceCell>
        <ServiceCell>
          {doctorMap[service.doctor_id] || "Unknown Doctor"}
        </ServiceCell>
        <ServiceCell>{service.total_cost}</ServiceCell>
        <ServiceCell>{service.count}</ServiceCell>
      </TableRow>
    ));

  const renderMonthDetails = (
    year: string,
    month: string,
    monthData: { [date: string]: DoneService[] }
  ) => {
    const isMonthExpanded = expandedMonths[year]?.[month];

    let totalCost = 0;
    let totalCount = 0;
    Object.values(monthData).forEach((services) => {
      services.forEach((service) => {
        totalCost += parseFloat(service.total_cost);
        totalCount += service.count;
      });
    });

    return (
      <React.Fragment key={`${year}-${month}`}>
        <TableRow>
          <StyledTableCell colSpan={4}>
            <IconButton
              onClick={() => toggleMonthExpansion(year, month)}
              size="small"
            >
              {isMonthExpanded ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
            الشهر {month}
          </StyledTableCell>
        </TableRow>
        {isMonthExpanded &&
          Object.entries(monthData).map(([date, services]) => (
            <React.Fragment key={date}>
              <TableRow>
                <DateCell colSpan={4}>التاريخ: {date}</DateCell>
              </TableRow>
              {renderDateRows(services)}
            </React.Fragment>
          ))}
        {isMonthExpanded && (
          <TableRow>
            <MonthTotalCell colSpan={2}>إجمالي الشهر</MonthTotalCell>
            <ServiceCell>{totalCost.toFixed(2)}</ServiceCell>
            <ServiceCell>{totalCount}</ServiceCell>
          </TableRow>
        )}
      </React.Fragment>
    );
  };

  const yearKeys = Object.keys(groupedData);
  const displayedYears = yearKeys.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      {/* Filters */}
      <FiltersContainer>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
          <FormControl fullWidth size="small">
            <InputLabel>الطبيب</InputLabel>
            <Select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              label="الطبيب"
            >
              <MenuItem value="">الكل</MenuItem>
              {doctors.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id.toString()}>
                  {doctor.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>الخدمة</InputLabel>
            <Select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              label="الخدمة"
            >
              <MenuItem value="">الكل</MenuItem>
              {services.map((service) => (
                <MenuItem key={service.id} value={service.id.toString()}>
                  {service.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
          <ToggleButtonGroup
            value={dateFilterMode}
            exclusive
            onChange={handleDateModeChange}
            size="small"
          >
            <ToggleButton value="single">يوم واحد</ToggleButton>
            <ToggleButton value="range">فترة زمنية</ToggleButton>
          </ToggleButtonGroup>

          {dateFilterMode === "single" ? (
            <Box>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="التاريخ"
              value={singleDate}
              onChange={(e) => setSingleDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            </Box>
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="من تاريخ"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                size="small"
                type="date"
                label="إلى تاريخ"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          )}
        </Box>
      </FiltersContainer>

      {/* Original Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>الخدمة</StyledTableCell>
              <StyledTableCell>الطبيب</StyledTableCell>
              <StyledTableCell>التكلفة الإجمالية</StyledTableCell>
              <StyledTableCell>العدد</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedYears.map((year) => (
              <React.Fragment key={year}>
                <TableRow>
                  <StyledTableCell colSpan={4}>
                    <IconButton
                      onClick={() => toggleYearExpansion(year)}
                      size="small"
                    >
                      {expandedYears[year] ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                    السنة {year}
                  </StyledTableCell>
                </TableRow>
                {expandedYears[year] &&
                  Object.entries(groupedData[year]).map(([month, monthData]) =>
                    renderMonthDetails(year, month, monthData)
                  )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={yearKeys.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        labelRowsPerPage="عدد السنوات في الصفحة"
      />
    </Box>
  );
};

export default ServiceTable;
