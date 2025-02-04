import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Grid,
  Fade,
  Paper,
  Typography,
  InputAdornment,
  Pagination,
  Button,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  Coins,
  ChartNoAxesCombined,
  ChartNoAxesColumn,
  BriefcaseMedical,
  User,
} from "lucide-react";
import { StatisticsPresentationProps } from "./Statistics-Interfaces";
import { PersonCard } from "./PersonCard";
import { SalaryView } from "./SalaryView";
import AttendanceTable from "../../helper/Attendance-Table/Attendance-Table";
import { useClinicStyles } from "../PayRolls/useClinicStyles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GeneralStatistics from "./GeneralStatistics/GeneralStatistics";

const StatisticsPresentation: React.FC<StatisticsPresentationProps> = ({
  selectedPerson,
  personType,
  viewType,
  attendanceData,
  salaryData,
  noDataMessage,
  handleViewTypeChange,
  handlePersonTypeChange,
  handlePersonChange,
  handleSalaryUpdate,
  people,
  searchQuery,
  handleSearchChange,
  loading,
  allSalaryData,
}) => {
  const { StyledTextField, StyledSearchIcon } = useClinicStyles();
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    console.log(event);
    setPage(value);
  };

  useEffect(() => {
    if (searchQuery) {
      const index = people.findIndex((person) =>
        person.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (index !== -1) {
        const newPage = Math.floor(index / itemsPerPage) + 1;
        setPage(newPage);
      }
    }
  }, [searchQuery, people, itemsPerPage]);

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPeople = people.slice(startIndex, endIndex);

  const handleGoBack = () => {
    handleViewTypeChange(viewType);
  };

  const renderContent = () => {
    if (viewType === "clinics") {
      return (
        <Box sx={{ mt: 4 }}>
          <GeneralStatistics allSalariesData={allSalaryData} people={people} />
        </Box>
      );
    }

    if (!selectedPerson) {
      return (
        <>
          <Box sx={{ mb: 3 }}>
            <StyledTextField
              autoFocus
              fullWidth
              variant="outlined"
              placeholder={`البحث عن ${
                personType === "doctor" ? "طبيب" : "موظف"
              }...`}
              value={searchQuery}
              onChange={handleSearchChange}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <StyledSearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Grid container spacing={3}>
            {currentPeople.length > 0 ? (
              currentPeople.map((person) => (
                <Grid item xs={12} sm={6} md={4} key={person.id}>
                  <Fade in timeout={500}>
                    <Box>
                      <PersonCard
                        person={person}
                        personType={personType}
                        onSelect={() =>
                          handlePersonChange({
                            value: person.id,
                            label: person.name,
                            weekDays: null,
                          })
                        }
                      />
                    </Box>
                  </Fade>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
                  <Typography variant="h6">
                    {searchQuery
                      ? `لا يوجد نتائج للبحث "${searchQuery}"`
                      : personType === "doctor"
                      ? `لا يوجد أطباء`
                      : `لا يوجد موظفون`}
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={Math.ceil(people.length / itemsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              variant="outlined"
            />
          </Box>
        </>
      );
    }

    return (
      <Fade in timeout={500}>
        <Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <Tooltip title="عوده الي القائمه السابقه">
              <Button
                onClick={handleGoBack}
                sx={{
                  borderRadius: "50%",
                  minWidth: "40px",
                  minHeight: "40px",
                }}
              >
                <ArrowForwardIcon />
              </Button>
            </Tooltip>
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                textAlign: "center",
              }}
            >
              {viewType === "statistics"
                ? `جدول غياب ${
                    personType === "employee" ? "الموظف" : "الطبيب"
                  } ${selectedPerson.label}`
                : `معلومات الراتب ${
                    personType === "employee" ? "للموظف" : "للطبيب"
                  } ${selectedPerson.label}`}
            </Typography>
          </Box>

          {viewType === "statistics" && attendanceData && (
            <Box sx={{ mt: 4 }}>
              <AttendanceTable attendanceData={attendanceData} />
            </Box>
          )}
          {viewType === "salary" && (
            <SalaryView
              data={salaryData}
              onDataUpdate={handleSalaryUpdate}
              personType={personType}
            />
          )}
          {noDataMessage && (
            <Box
              sx={{
                width: "100%",
                mt: 4,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "300px",
              }}
            >
              <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h5" gutterBottom>
                  {noDataMessage}
                </Typography>
                <Typography variant="body1">الرجاء اختيار شخص آخر.</Typography>
              </Paper>
            </Box>
          )}
        </Box>
      </Fade>
    );
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Tabs
        value={viewType}
        onChange={(event, newValue) => {
          console.log(event);
          handleViewTypeChange(newValue);
        }}
        sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
      >
        <Tab
          icon={<ChartNoAxesCombined size={20} />}
          iconPosition="start"
          label="عرض احصائيات عامه عن العيادات"
          value="clinics"
        />
        <Tab
          icon={<ChartNoAxesColumn size={20} />}
          iconPosition="start"
          label="عرض معلومات الغياب"
          value="statistics"
        />
        <Tab
          icon={<Coins size={20} />}
          iconPosition="start"
          label="عرض معلومات الراتب"
          value="salary"
        />
      </Tabs>

      {viewType !== "clinics" && (
        <Tabs
          value={personType}
          onChange={handlePersonTypeChange}
          sx={{ mb: 4, borderBottom: 1, borderColor: "divider", ml: 10 }}
        >
          <Tab
            icon={<BriefcaseMedical size={20} />}
            iconPosition="start"
            label="الأطباء"
            value="doctor"
          />
          <Tab
            icon={<User size={20} />}
            iconPosition="start"
            label="الموظفين"
            value="employee"
          />
        </Tabs>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        renderContent()
      )}
    </Box>
  );
};

export default StatisticsPresentation;
