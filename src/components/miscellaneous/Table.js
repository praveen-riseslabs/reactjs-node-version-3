import { TableContainer } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

function Table({ columns, rows }) {
  return (
    <TableContainer
      sx={{ bgcolor: "black", height: "35rem" }}
      className="scroll-none"
    >
      <DataGrid
        rows={rows}
        rowHeight={80}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
          columns: {
            columnVisibilityModel: {
              id: false,
            },
          },
        }}
        classes={{ sortIcon: "text-white", menuIcon:"bg-secondary rounded",virtualScroller:"scroll-none", footerContainer:"bg-secondary" }}
        style={{ border: "none" }}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
        disableColumnSelector
      />
    </TableContainer>
  );
}

export default Table;
