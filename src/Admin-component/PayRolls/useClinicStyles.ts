// useClinicStyles.ts
import { styled } from "@mui/material/styles";
import {
  Card,
  CardContent,
  Paper,
  Modal,
  TableCell,
  TextField,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export const useClinicStyles = () => {
  const theme = useTheme();

  const StyledCard = styled(Card)({
    height: "280px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.5)", // Added distinct shadow
  });

  const StyledImageWrapper = styled("div")({
    height: "180px",
    backgroundColor: "#f0f0f0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  });

  const StyledImage = styled("img")({
    maxHeight: "50%",
    maxWidth: "50%",
    objectFit: "contain",
  });

  const StyledCardContent = styled(CardContent)({
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
  });

  const StyledButtonBase = styled("div")({
    width: "100%",
    position: "relative",
    transition: "all 0.3s ease-in-out",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0px 1px 1px 1px #00000029",

    "&:hover": {
      transform: "translateY(-5px)",

      "& .actions-overlay": {
        opacity: 1,
      },

      "& .edit-button": {
        transform: "translateX(0)",
      },
      "& .delete-button": {
        transform: "translateX(0)",
      },
    },
    "&:active": {
      transform: "translateY(-2px)",
    },
  });

  const StyledModal = styled(Modal)({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });

  const StyledPaper = styled(Paper)({
    padding: "20px",
    maxWidth: "400px",
    width: "100%",
  });

  const StyledTableCell = styled(TableCell)({
    fontWeight: "bold",
  });

  const StyledTablePaper = styled(Paper)({
    padding: "20px",
    marginTop: "20px",
  });

  const StyledTextField = styled(TextField)({
    "& .MuiOutlinedInput-root": {
      transition: "all 0.3s ease-in-out",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      marginBottom: "20px",
      borderRadius: "10px",
      "&:hover": {
        boxShadow: "0 3px 4px rgba(0, 0, 0, 0.15)",
        transform: "translateY(-1px)",
      },
    },
    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main,
    },
  });

  const ActionsOverlay = styled("div")({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(245, 245, 245, 0.95)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    zIndex: 1,
    opacity: 0,
    transition: "opacity 0.3s ease-in-out",
  });

  const ActionIconButton = styled(IconButton)({
    width: "40px",
    height: "40px",
    position: "relative",
    transition: "transform 0.3s ease-in-out",

    "&.edit-button": {
      color: theme.palette.primary.main,
      backgroundColor: "rgba(25, 118, 210, 0.1)",
      transform: "translateX(100px)",
      "&:hover": {
        backgroundColor: "rgba(25, 118, 210, 0.2)",
      },
    },
    "&.delete-button": {
      color: theme.palette.error.main,
      backgroundColor: "rgba(211, 47, 47, 0.1)",
      transform: "translateX(-100px)",
      "&:hover": {
        backgroundColor: "rgba(211, 47, 47, 0.2)",
      },
    },
  });

  const StyledSearchIcon = styled(SearchIcon)({
    color: theme.palette.text.secondary,
  });

  const ProfileHeroSection = styled("div")({
    background: theme.palette.primary.main,
    color: "white",
    padding: "40px 20px",
    borderRadius: "12px",
    marginBottom: "32px",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background:
        "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
      pointerEvents: "none",
    },
  });

  const ServicesSection = styled("div")({
    marginBottom: "32px",
  });

  const ServicesGrid = styled("div")({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px",
    padding: "20px 0",
  });

  const ServiceCard = styled(Card)({
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: "12px",
    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
    "&:hover": {
      border: `1px solid ${theme.palette.primary.main}`,
      transform: "translateY(-2px)",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
    },
  });

  const ServiceCardContent = styled(CardContent)({
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  });

  const ServiceIcon = styled("div")({
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: theme.palette.primary.light,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.primary.main,
    marginBottom: "8px",
  });

  const ServicePrice = styled(Typography)({
    color: theme.palette.success.main,
    fontWeight: "bold",
    fontSize: "1.25rem",
  });

  const CreatedAtText = styled(Typography)({
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "0.875rem",
  });

  return {
    StyledCard,
    StyledImageWrapper,
    StyledImage,
    StyledCardContent,
    StyledButtonBase,
    StyledModal,
    StyledPaper,
    StyledTableCell,
    StyledTablePaper,
    StyledTextField,
    ActionsOverlay,
    CreatedAtText,
    ProfileHeroSection,
    ServicesSection,
    ServicesGrid,
    ServiceCard,
    ServiceCardContent,
    ServiceIcon,
    ServicePrice,
    ActionIconButton,
    StyledSearchIcon,
    EditIcon, // Exporting icons for use in components
    DeleteIcon,
  };
};
