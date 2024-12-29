import React, { useEffect, useState, Suspense } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import {
  Box,
  CssBaseline,
  AppBar as MuiAppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Menu,
  MenuItem,
  useMediaQuery,
  ListSubheader,
  AppBarProps as MuiAppBarProps,
  Drawer as MuiDrawer,
  Collapse,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  People as PeopleIcon,
  LocalHospital as DoctorIcon,
  Schedule as ScheduleIcon,
  Business as ClinicIcon,
  PersonAdd as AddPersonIcon,
  ExitToApp as LogoutIcon,
  EventBusy as AddAbsence,
  HomeRounded as HomeIcon,
  MedicalServices as AddClinic,
  Badge as AddEmployee,
  Masks as AddDoctor,
} from "@mui/icons-material";
import axiosInstance from "../helper/auth/axios";
import Loader from "../helper/loading-component/loader";
import BreadcrumbsComponent from "./Bread-Crumd/Bread-crumb-component";
import { Users, Hospital } from "lucide-react";

// Types
interface UserDataProps {
  name?: string;
  email?: string;
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

interface MenuGroup {
  title: string;
  items: {
    text: string;
    icon: JSX.Element;
    path: string;
    children?: {
      text: string;
      icon: JSX.Element;
      path: string;
    }[];
  }[];
}

// Constants
const drawerWidth = 280;

// Styled Components
const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

// Menu Group Component
const MenuGroupComponent: React.FC<{
  group: MenuGroup;
  handleNavigation: (path: string) => void;
  handleToggle: (text: string) => void;
  expanded: string | null;
  open: boolean;
  location: { pathname: string };
}> = ({ group, handleNavigation, handleToggle, expanded, open, location }) => (
  <React.Fragment key={group.title}>
    <ListSubheader sx={{ opacity: open ? 1 : 0, transition: "opacity 0.2s" }}>
      {group.title}
    </ListSubheader>
    {group.items.map((item) => (
      <React.Fragment key={item.text}>
        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton
            onClick={() => {
              // Only handle navigation if there are no children
              if (!item.children) {
                handleNavigation(item.path);
              }
            }}
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
            }}
            selected={location.pathname === item.path}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                opacity: open ? 1 : 0,
                transition: "opacity 0.2s",
              }}
            />
            {item.children && (
              <IconButton
                edge="end"
                onClick={(e) => {
                  e.stopPropagation(); // Stop event from bubbling up
                  handleToggle(item.text);
                }}
                sx={{ ml: "auto" }}
              >
                {expanded === item.text ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </IconButton>
            )}
          </ListItemButton>
        </ListItem>
        {item.children && (
          <Collapse in={expanded === item.text} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => (
                <ListItem
                  key={child.text}
                  disablePadding
                  sx={{ display: "block" }}
                >
                  <ListItemButton
                    sx={{
                      pl: 4,
                    }}
                    onClick={() => handleNavigation(child.path)}
                    selected={location.pathname === child.path}
                  >
                    <ListItemIcon sx={{ minWidth: 35 }}>
                      {child.icon}
                    </ListItemIcon>
                    <ListItemText primary={child.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    ))}
    <Divider />
  </React.Fragment>
);

const TheOne: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [userData, setUserData] = useState<UserDataProps>({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(true);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [expanded, setExpanded] = useState<string | null>(null);

  // Menu Groups Configuration
  const menuGroups: MenuGroup[] = [
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
          icon: <Users />,
          path: "/SystemAdmin/Users",
        },
        {
          text: "الاطباء",
          icon: <DoctorIcon />,
          path: "/SystemAdmin/Doctors",
        },
        {
          text: "الموظفون",
          icon: <PeopleIcon />,
          path: "/SystemAdmin/Employees",
        },
        {
          text: "حساب الرواتب / الخدمات",
          icon: <ClinicIcon />,
          path: "",
          children: [
            {
              text: "حساب الاطباء / إضافة خدمه",
              icon: <DoctorIcon />,
              path: "/SystemAdmin/DoctorsPayroll",
            },
            {
              text: "حساب الموظفين",
              icon: <PeopleIcon />,
              path: "/SystemAdmin/EmployeesDeduction",
            },
          ],
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
          text: "اضافة عيادة",
          icon: <Hospital />,
          path: "DoctorsPayroll/AddClinic",
        },
        {
          text: "تسجيل الغياب",
          icon: <AddAbsence />,
          path: "/SystemAdmin/AddAbsence",
        },
      ],
    },
  ];

  // Effects
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Create a function to get the current date in Egypt's time zone
    const getCurrentEgyptDate = () => {
      const cairoDate = new Date().toLocaleString("en-US", {
        timeZone: "Africa/Cairo",
      });
      return new Date(cairoDate);
    };

    const takeAttendance = async () => {
      try {
        // Add timestamp to request for debugging
        const cairoTime = getCurrentEgyptDate().toISOString();
        const response = await axiosInstance.post("/api/takeattedence", {
          timestamp: cairoTime, // Send timestamp for verification
        });
        console.log("Attendance taken at (Cairo time): ", cairoTime);
        console.log("response is: ", response);
      } catch (error) {
        console.error("Error taking attendance:", error);
      }
    };

    const checkAndTakeAttendance = () => {
      const currentDate = getCurrentEgyptDate();
      const lastAttendanceDate = localStorage.getItem("lastAttendanceDate");

      if (
        !lastAttendanceDate ||
        !isSameDay(new Date(lastAttendanceDate), currentDate)
      ) {
        takeAttendance();
        localStorage.setItem("lastAttendanceDate", currentDate.toISOString());
      }
    };

    // Check every minute
    const timer = setInterval(checkAndTakeAttendance, 60000);

    // Initial check
    checkAndTakeAttendance();

    return () => clearInterval(timer);
  }, []);

  // Helper function to compare dates
  function isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  useEffect(() => {
    const storedUserData = sessionStorage.getItem("userData");
    console.log(storedUserData);
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  // Handlers
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isSmallScreen) {
      setOpen(false);
    }
  };

  const handleToggle = (text: string) => {
    setExpanded((prev) => (prev === text ? null : text));
  };

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
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
                <Typography>اسم المستخدم: {userData?.name}</Typography>
              </MenuItem>
              <MenuItem>
                <Typography>البريد الالكتروني: {userData?.email}</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>تسجيل الخروج</ListItemText>
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isSmallScreen ? "temporary" : "permanent"}
        open={isSmallScreen ? open : open}
        onClose={handleDrawerClose}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuGroups.map((group) => (
            <MenuGroupComponent
              key={group.title}
              group={group}
              handleNavigation={handleNavigation}
              handleToggle={handleToggle}
              expanded={expanded}
              open={open}
              location={location}
            />
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <DrawerHeader />
        <BreadcrumbsComponent />
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </Box>
    </Box>
  );
};

export default TheOne;
