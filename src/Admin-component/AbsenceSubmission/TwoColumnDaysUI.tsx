import React from "react";
import { Box, Drawer, Grid } from "@mui/material";
import DayList from "./DayList";
import { TwoColumnDaysUIProps } from "./AbsenceInterfaces";


const TwoColumnDaysUI: React.FC<TwoColumnDaysUIProps> = ({ weekDays, showSwitchedDays,  setShowSwitchedDays, personType}) => {


    const regularDays = weekDays.filter((day) => day.day !== null);
    const switchedDays = weekDays.filter((day) => day.day === null);

    const toggleSwitchedDays = () => setShowSwitchedDays(false);

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                    <DayList days={regularDays} title="الأيام العادية" personType={personType} />
                </Grid>
            </Grid>
            <Drawer
                anchor="right"
                open={showSwitchedDays}
                onClose={toggleSwitchedDays}
                PaperProps={{
                    sx: {
                        width: "100%",
                        maxWidth: 500,
                        height: "calc(100% - 64px)",
                        top: 64,
                        transition: "transform 0.3s ease-in-out",
                        transform: showSwitchedDays
                            ? "translateX(0)"
                            : "translateX(100%)",
                        overflowY: "auto",
                    },
                }}
                ModalProps={{ keepMounted: true }}
            >
                <Box sx={{ p: 2, overflowY: "auto", height: "100%" }}>

                    <DayList
                        days={switchedDays}
                        title="الأيام المبدلة هذا الشهر"
                        personType ={personType}
                    />
                </Box>
            </Drawer>


        </Box>
    );
};

export default TwoColumnDaysUI;