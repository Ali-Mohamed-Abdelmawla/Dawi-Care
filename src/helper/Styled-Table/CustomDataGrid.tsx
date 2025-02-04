import React from "react";
import {
  DataGrid,
  GridColDef,
  GridRowSelectionModel,
  GridRowModel,
  GridRowId,
  GridInitialState,
} from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import { arSD } from "@mui/x-data-grid/locales";
import "../../Admin-component/Styles/main.css";


interface CustomDataGridProps<R extends GridRowModel = GridRowModel> {
  rows: R[];
  columns: GridColDef[];
  getRowId: (row: R) => GridRowId;
  initialState: Partial<GridInitialState>;
  pageSizeOptions: number[];
  checkboxSelection?: boolean;
  onRowSelectionModelChange?: (
    newSelectionModel: GridRowSelectionModel
  ) => void;
}

function CustomDataGrid<R extends GridRowModel = GridRowModel>({
  rows,
  columns,
  getRowId,
  initialState,
  pageSizeOptions,
  checkboxSelection,
  onRowSelectionModelChange,
}: CustomDataGridProps<R>): React.ReactElement {
  const theme = useTheme();

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      hideFooterSelectedRowCount={true}
      // loading = {true}
      getRowId={getRowId}
      localeText={arSD.components.MuiDataGrid.defaultProps.localeText}
      initialState={initialState}
      pageSizeOptions={pageSizeOptions}
      checkboxSelection={checkboxSelection}
      onRowSelectionModelChange={onRowSelectionModelChange}
      autoHeight
      sx={{
        width: "100%",
        height: "100%",
        "& .MuiDataGrid-row:hover": {
          backgroundColor: theme.palette.action.hover,
        },
        "& .MuiDataGrid-columnSeparator--resizable:hover":{
          color: theme.palette.background.default
        },
        border: "none",
        "& .MuiDataGrid-cell": {
          borderColor: theme.palette.mode === "light" ? "#f0f0f0" : "#303030",
        },
        "& .MuiDataGrid-columnHeader": {
          backgroundColor: `${theme.palette.primary.main} !important`,
          color: theme.palette.common.white,
          fontSize: 16,
        },
        "& .MuiDataGrid-virtualScroller": {
          backgroundColor: theme.palette.background.default,
        },
        "& .MuiDataGrid-footerContainer": {
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.secondary,
          borderTop: "1px solid",
          borderColor: theme.palette.mode === "light" ? "#f0f0f0" : "#303030",
        },
        "& .MuiCheckbox-root": {
          color: `${theme.palette.secondary.main} !important`,
        },
        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
          color: `${theme.palette.secondary.main} !important`,
        },
        // You can add more styles here if needed
      }}
    />
  );
}

export default CustomDataGrid;
