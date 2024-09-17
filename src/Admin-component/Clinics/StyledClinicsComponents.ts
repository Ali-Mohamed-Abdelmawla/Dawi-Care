import { styled } from '@mui/material/styles';
import {
  Card,
  CardContent,
  ButtonBase,
  Paper,
  Modal,
  TableCell,
  TextField
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';


export const StyledCard = styled(Card)({
  height: '280px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
});

export const StyledImageWrapper = styled('div')({
  height: '180px',
  backgroundColor: '#f0f0f0',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const StyledImage = styled('img')({
  maxHeight: '100%',
  maxWidth: '100%',
  objectFit: 'contain',
});

export const StyledCardContent = styled(CardContent)({
  flexGrow: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px',
});

export const StyledButtonBase = styled(ButtonBase)(({ theme }) => ({
  width: '100%',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  borderRadius: '12px',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
  '&:active': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[3],
  },
}));

// Doctor revenue

export const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const StyledPaper = styled(Paper)({
  padding: '20px',
  maxWidth: '400px',
  width: '100%',
});

// ClinicsDetailsPresentation

export const StyledTableCell = styled(TableCell)(() => ({
  fontWeight: 'bold',
}));

export const StyledTablePaper = styled(Paper)({
  padding: '20px',
  marginTop: '20px',
});

export const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    transition: 'all 0.3s ease-in-out',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: "20px",
    borderRadius: '10px',
    '&:hover': {
      boxShadow: '0 3px 4px rgba(0, 0, 0, 0.15)',
      transform: 'translateY(-1px)',
    },
    '&.Mui-focused': {
      boxShadow: '0 4px 5px rgba(0, 0, 0, 0.18)',
      transform: 'translateY(-2px)',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
}));

export const StyledSearchIcon = styled(SearchIcon)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));