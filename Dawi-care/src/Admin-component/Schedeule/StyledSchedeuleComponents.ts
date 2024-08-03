import { styled } from "@mui/system";
import { TableCell, TableRow, Chip } from "@mui/material";

export const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  border: "1px solid #00000024",
  fontWeight: "bold",
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  border: "1px solid #00000020",
  backgroundColor: theme.palette.schedeuleTableCell.main,
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // "&:nth-of-type(odd)": {
  //   backgroundColor: theme.palette.action.hover,
  // },
}));

export const AppointmentChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.common.white,
  borderColor: theme.palette.secondary.dark,
  borderRadius: "5px",
  fontWeight: "bold",
  margin:"5px 0px"
}));
