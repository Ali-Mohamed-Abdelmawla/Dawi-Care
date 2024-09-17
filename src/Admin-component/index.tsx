import React, { useEffect, useState, Suspense } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Menu,
  MenuItem,
  IconButton,
  useMediaQuery,
  ListSubheader,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  People as PeopleIcon,
  LocalHospital as DoctorIcon,
  Schedule as ScheduleIcon,
  Business as ClinicIcon,
  PersonAdd as AddPersonIcon,
  ExitToApp as LogoutIcon,
  Menu as MenuIcon,
  EventBusy as AddAbsence,
  HomeRounded as HomeIcon,
  MedicalServices as AddDoctor,
  Badge as AddEmployee,
} from "@mui/icons-material";
import axiosInstance from "../helper/auth/axios";
import Loader from "../helper/loading-component/loader";
import BreadcrumbsComponent from "./Bread-Crumd/Bread-crumb-component";

const drawerWidth = 240;

interface UserDataProps {
  adminData: {
    name?: string;
    email?: string;
  };
}

const TheOne: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [userData, setUserData] = useState<UserDataProps>({ adminData: {} });
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = React.useState(true);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentDateTime, setCurrentDateTime] = React.useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const currentDate = new Date().toDateString();
    const takeAttendance = () => {
      axiosInstance.post('/api/takeattedence', {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        console.log(response.data);
      }).catch((error) => {
        console.log(error);
      });
    };
    const lastAttendanceDate = localStorage.getItem('lastAttendanceDate');
    console.log(lastAttendanceDate !== currentDate);
    if (lastAttendanceDate !== currentDate) {
      takeAttendance();
      localStorage.setItem('lastAttendanceDate', currentDate);
    }
    const checkDate = () => {
      const newDate = new Date().toDateString();
      console.log(newDate !== currentDate);
      if (newDate !== currentDate) {
        takeAttendance();
        localStorage.setItem('lastAttendanceDate', newDate);
      }
    };
    const dailyTimer = setInterval(checkDate, 60000); // Check every minute
    return () => {
      clearInterval(dailyTimer);
    };
  }, []);

  useEffect(() => {
    const timestamp = Date.now();
    const date = new Date(timestamp);
  
    const isFirstDayOfMonth = date.getDate() === 1;
    console.log(isFirstDayOfMonth);

    if (isFirstDayOfMonth) {
      axiosInstance
        .post(
          "/api/numberofweekdays",
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);
  

  useEffect(() => {
    console.log(location);
    // if there is no userData set it
    if (!userData.adminData?.name) {
      setUserData({ adminData: location.state?.adminData || {} });
    }
  }, [location]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isSmallScreen) {
      setOpen(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    navigate("/");
  };

  const menuGroups = [
    {
      title: "إدارة",
      items: [
        {
          text: "الصفحه الرئيسيه",
          icon: <HomeIcon />,
          path: "/SystemAdmin",
        },
        {
          text: "المستخدمون",
          icon: <PeopleIcon />,
          path: "/SystemAdmin/Users",
        },
        { text: "الاطباء", icon: <DoctorIcon />, path: "/SystemAdmin/Doctors" },
        {
          text: "الموظفون",
          icon: <PeopleIcon />,
          path: "/SystemAdmin/Employees",
        },
        {
          text: "الحسابات",
          icon: <ClinicIcon />,
          path: "/SystemAdmin/Clinics",
        },
      ],
    },
    {
      title: "إضافة",
      items: [
        {
          text: "اضافة مستخدم",
          icon: <AddPersonIcon />,
          path: "/SystemAdmin/AddUser",
        },
        {
          text: "اضافة طبيب",
          icon: <AddDoctor />,
          path: "/SystemAdmin/AddDoctor",
        },
        {
          text: "اضافة موظف",
          icon: <AddEmployee />,
          path: "/SystemAdmin/AddEmployee",
        },
        {
          text: "تسجيل الغياب",
          icon: <AddAbsence />,
          path: "/SystemAdmin/AddAbsence",
        },
      ],
    },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          {isSmallScreen && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            داوي-كير
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {currentDateTime.toLocaleString("ar-EG", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            })}
          </Typography>
          <Button
            color="inherit"
            startIcon={<ScheduleIcon />}
            onClick={() => handleNavigation("/SystemAdmin/Schedule")}
            sx={{ mr: 2 }}
          >
            جدول المواعيد
          </Button>
          <div>
            <Button color="inherit" onClick={handleMenu}>
              معلومات المستخدم
            </Button>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem>
                <Typography>
                  اسم المستخدم: {userData?.adminData?.name}
                </Typography>
              </MenuItem>
              <MenuItem>
                <Typography>
                  البريد الالكتروني: {userData?.adminData?.email}
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>تسجيل الخروج</ListItemText>
              </MenuItem>
            </Menu>
          </div>{" "}
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant={isSmallScreen ? "temporary" : "permanent"}
        anchor="left"
        open={isSmallScreen ? open : true}
        onClose={handleDrawerToggle}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {menuGroups.map((group) => (
              <React.Fragment key={group.title}>
                <ListSubheader>{group.title}</ListSubheader>
                {group.items.map((item) => (
                  <ListItem
                    key={item.text}
                    disablePadding
                    selected={location.pathname === item.path}
                  >
                    <ListItemButton onClick={() => handleNavigation(item.path)}>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItemButton>
                  </ListItem>
                ))}
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: "rgba(255, 255, 255, 0.8)", // Add this line
        }}
      >
        <Toolbar />
        <BreadcrumbsComponent />

        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </Box>
    </Box>
  );
};

export default TheOne;
