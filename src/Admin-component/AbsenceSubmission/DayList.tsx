import React from "react";
import { DayListProps, WeekDay } from "./AbsenceInterfaces";
import {
  Box,
  Divider,
  Typography,
  useTheme,
  Card,
  CardContent,
  Tooltip,
} from "@mui/material";
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";
import { SwapHoriz } from "@mui/icons-material";

const DayList: React.FC<DayListProps> = ({ days, title, personType }) => {
  const theme = useTheme();

  // Create a slightly darker version of the divider color for hover
  const darkerBorderColor = theme.palette.augmentColor({
    color: { main: theme.palette.divider },
  }).dark;

  return (
    <Box
      sx={{
        p: 2,
        height: "100%",
        borderRadius: "8px",
        border: `2px solid ${theme.palette.divider}`,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          border: `2px solid ${darkerBorderColor}`,
        },
      }}
    >
      <Typography variant="h6" gutterBottom align="center">
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {days.length === 0 ? (
        <Typography variant="body1" align="center">
          لا توجد أيام مبدلة لعرضها.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 2,
          }}
        >
          {days.map((day: WeekDay) => (
            <Card
              key={day.id}
              sx={{
                transition: "all 0.2s ease-in-out",
                border: `1px solid ${theme.palette.divider}`,
                "&:hover": {
                  border: `1px solid #00000070`,
                  transform: "scale(1.02)",
                },
              }}
            >
              <CardContent
                sx={{
                  "&:last-child": {
                    paddingBottom: personType === "doctor" ? "24px" : "2px",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle1">
                    {day.day || day.switch_day}
                  </Typography>

                  {day.day === null && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <SwapHoriz color="action" />
                      <Tooltip
                        title={`التاريخ الأصلي: ${day.switched_day_date}`}
                      >
                        <InfoTwoToneIcon fontSize="small" color="primary" />
                      </Tooltip>
                    </Box>
                  )}
                </Box>
                {personType === "doctor" ? <Divider /> : null}

                <Box sx={{ display: "flex", mt: 1, flexDirection: "column" }}>
                  {day.switch_day_date && (
                    <Typography variant="body2" color="textSecondary">
                      تاريخ الحضور: {day.switch_day_date}
                    </Typography>
                  )}
                  {personType === "doctor" && (
                    <Typography variant="body2" color="text.secondary">
                      الوقت: {day.date?.slice(0, 5)}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default DayList;
