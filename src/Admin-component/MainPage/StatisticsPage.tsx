// StatisticsPage.tsx

import React from "react";
import { Box, Paper, Typography, useTheme, Tabs, Tab } from "@mui/material";
import PersonSelect from "../../helper/personSelect/personSelect";
import AttendanceTable from "../../helper/Attendance-Table/Attendance-Table";
import { StatisticsPresentationProps } from "./Statistics-Interfaces";

const StatisticsPresentation: React.FC<StatisticsPresentationProps> = ({
    selectedPerson,
    personType,
    attendanceData,
    noDataMessage,
    handlePersonTypeChange,
    handlePersonChange,
}) => {
    const theme = useTheme();

    return (
        <Box sx={{ width: "100%" }}>
            <Tabs
                value={personType}
                onChange={handlePersonTypeChange}
                sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
                indicatorColor="secondary"
            >
                <Tab label="طبيب" value="doctor" />
                <Tab label="موظف" value="employee" />
            </Tabs>
            <Box sx={{ mt: 2 }}>
                <PersonSelect
                    personType={personType}
                    onChange={handlePersonChange}
                    value={selectedPerson}
                />
            </Box>
            {noDataMessage ? (
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
                        <Typography variant="body1">
                            الرجاء اختيار شخص آخر .
                        </Typography>
                    </Paper>
                </Box>
            ) : attendanceData ? (
                <Box sx={{ width: "100%", mt: 4 }}>
                    <Box sx={{ mt: 4 }}>
                        <Typography
                            variant="h6"
                            align="center"
                            sx={{
                                mb: 4,
                                borderBottom: 1,
                                borderColor: theme.palette.dividerColor.main,
                                pb: 1,
                            }}
                        >
                            جدول الحضور والغياب لـ {attendanceData.name}
                        </Typography>
                        <AttendanceTable
                            attendanceData={attendanceData.attendance_data}
                        />
                    </Box>
                </Box>
            ) : null}
        </Box>
    );
};

export default StatisticsPresentation;
