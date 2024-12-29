import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Chip,
  Grid,
  Pagination,
  TextField,
  InputAdornment,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { BriefcaseBusiness, BadgeDollarSign, Search } from "lucide-react";
import { generatePastelColor } from "../../helper/PastelColorGenerator/colors";
import { Doctor, Employee } from "./AbsenceInterfaces";
import { format } from "date-fns";

const ITEMS_PER_PAGE = 6;

interface AbsencePersonCardProps {
  person: Doctor | Employee;
  personType: "doctor" | "employee";
  onSelect: (person: Doctor | Employee) => void;
}

const PersonCard: React.FC<AbsencePersonCardProps> = ({
  person,
  personType,
  onSelect,
}) => {
  useEffect(() => {
    console.log(person);
  }, [person]);
  const bannerColor = useMemo(() => generatePastelColor(), []);
  const theme = useTheme();

  const renderSpecificInfo = () => {
    if (personType === "doctor") {
      const doctor = person as Doctor;
      const mainDoctorDays = doctor.week_days?.filter(day => day.switch_day === null);

      return (
        <Box sx={{ display: "flex",justifyContent:'space-between', mt: 1 }}>
          <Chip
            icon={<BriefcaseBusiness size={16} />}
            label={doctor.clinic?.name || "لا توجد عيادة"}
            size="small"
            sx={{marginRight:1}}
          />
          <Chip
            icon={<BadgeDollarSign size={16} />}
            label={`أيام العمل: ${mainDoctorDays?.length}`}
            size="small"

          />
        </Box>
      );
    }
    const employee = person as Employee;
    return (
      <Box sx={{ display: "flex",justifyContent:'space-between', mt: 1 }}>
        <Chip
          icon={<BriefcaseBusiness size={16} />}
          label={employee.description || "لا يوجد وصف وظيفي لهذا الموظف"}
          size="small"
          sx={{marginRight:1}}

        />
        <Chip
          icon={<BadgeDollarSign size={16} />}
          label={`أيام العمل: ${employee.num_working_days}`}
          size="small"
        />
      </Box>
    );
  };

  const getProfilePhotoUrl = () => {
    if (personType === "doctor") {
      const doctor = person as Doctor;
      return `http://127.0.0.1:8000${doctor?.profile_photo}`;
    }
    return `${person.name.charAt(0).toUpperCase()}`;
  };

  return (
    <Card
      onClick={() => onSelect(person)}
      sx={{
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
        position: "relative",
        border: `1px solid ${theme.palette.dividerColor.main}`,
        height: "100%",
      }}
    >
      <Box
        sx={{
          background: bannerColor,
          height: "70px",
          borderRadius: "11px 11px 0 0",
          border: `1px solid ${theme.palette.dividerColor.main}`,
        }}
      />
      <CardContent sx={{ pt: 0 }}>
        <Box
          sx={{
            textAlign: "center",
            mt: -5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Avatar
            sx={{
              width: 70,
              height: 70,
              border: "3px solid white",
              bgcolor: bannerColor,
              fontSize: "20px",
              boxShadow: 2,
              color: "black",
            }}
            src={getProfilePhotoUrl()}
            alt={person.name.charAt(0).toUpperCase()}
          />

          <Typography
            variant="h6"
            sx={{
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "text.primary",
            }}
          >
            {person.name}
          </Typography>
          {renderSpecificInfo()}
          <Typography variant="body2" color="text.secondary">
            رقم الهاتف: {person.phoneNumber}
          </Typography>
          <Typography variant="body2" sx= {{mt:-1}} color="text.secondary">
            تاريخ التعيين:{" "}
            {format(new Date((person as Doctor).hire_date), "MMM dd, yyyy")}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

interface PeopleGridProps {
  people: (Doctor | Employee)[];
  personType: "doctor" | "employee";
  onPersonSelect: (person: Doctor | Employee) => void;
  selectedPerson: { value: number } | null;
  loading?: boolean;
}

export const PeopleGrid: React.FC<PeopleGridProps> = ({
  people,
  personType,
  onPersonSelect,
  loading = false,
}) => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter people based on search query
  const filteredPeople = useMemo(() => {
    return people?.filter(
      (person) =>
        person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.phoneNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (personType === "doctor" &&
          (person as Doctor).clinic?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (personType === "employee" &&
          (person as Employee).description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()))
    );
  }, [people, searchQuery, personType]);

  const totalPages = Math.ceil(filteredPeople.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const displayedPeople = filteredPeople.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Reset to first page when search query changes
  React.useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={`البحث عن ${
            personType === "doctor" ? "طبيب" : "موظف"
          }...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {displayedPeople.map((person) => (
              <Grid item xs={12} md={6} lg={4} key={person.id}>
                <PersonCard
                  person={person}
                  personType={personType}
                  onSelect={onPersonSelect}
                />
              </Grid>
            ))}
          </Grid>

          {filteredPeople.length === 0 ? (
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Typography variant="body1" color="text.secondary">
                لا يوجد نتائج للبحث
              </Typography>
            </Box>
          ) : (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                size="large"
                shape="rounded"
                variant="outlined"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
