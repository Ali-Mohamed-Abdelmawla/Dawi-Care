import { DayListProps, WeekDay } from "./AbsenceInterfaces";
import {
    Box,
    Divider,
    List,
    ListItem,
    ListItemText,
    Paper,
    Tooltip,
    Typography,
} from "@mui/material";
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";
import { SwapHoriz } from "@mui/icons-material";

const DayList: React.FC<DayListProps> = ({ days, title }) => (
    <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
        <Typography variant="h6" gutterBottom align="center">
            {title}
        </Typography>
        <Divider />
        <List>
            {days.length === 0 ? (
                <Typography variant="body1" align="center">
                    لا توجد أيام مبدلة لعرضها.
                </Typography>
            ) : (
                days.map((day: WeekDay) => (
                    <ListItem key={day.id}>
                        <ListItemText
                            primary={day.day || day.switch_day}
                            secondary={`الوقت: ${day.date.slice(0, 5)}`}
                        />
                        {day.day === null && (
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mr: 1,
                                }}
                            >
                                <SwapHoriz />
                                <Tooltip
                                    title={`التاريخ الأصلي: ${day.attendance}`}
                                >
                                    <InfoTwoToneIcon
                                        fontSize="small"
                                        sx={{ mr: 1 }}
                                        color="primary"
                                    />
                                </Tooltip>
                            </Box>
                        )}
                    </ListItem>
                ))
            )}
        </List>
    </Paper>
);

export default DayList;
