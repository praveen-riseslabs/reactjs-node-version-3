import { useSelector } from "react-redux";
import NewAsset from "../modals/NewAsset";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useThunk } from "../../hooks/useThunk";
import {
  deleteAsset,
  getAllAssets,
  getAllTrashedAssets,
  restoreAsset,
  trashAsset,
} from "../../store";
import { useDeferredValue, useEffect, useState } from "react";
import { Button, CircularProgress, IconButton } from "@mui/material";
import Table from "../miscellaneous/Table";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RestoreIcon from "@mui/icons-material/Restore";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ProgressModal from "../modals/ProgressModal";
import ErrorSnackBar from "../modals/ErrorSnackBar";
import ConfirmationDialog from "../modals/ConfirmationDialog";
import EditAsset from "../modals/EditAsset";

function Assets() {
  const [doFetchAssets, loadingAssets, errorLoadingAssets] =
    useThunk(getAllAssets);
  const [doFetchTrashAssets, loadingTrashAssets, errorLoadingTrashAssets] =
    useThunk(getAllTrashedAssets);

  const [
    doTrashAsset,
    loadingTrashingAsset,
    errorTrashingAsset,
    resetTrashError,
  ] = useThunk(trashAsset);

  const [
    doDeleteAsset,
    loadingDeletingAsset,
    errorDeletingAsset,
    resetDeletingAsset,
  ] = useThunk(deleteAsset);

  const [
    doRestoreAsset,
    loadingRestoringAsset,
    errorRestoringAsset,
    resetRestoringAsset,
  ] = useThunk(restoreAsset);

  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const { assets, trashedAssets } = useSelector((state) => state.asset);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [searchBy, setSearchBy] = useState("name");
  const [selectedRowId, setSelectedRowId] = useState("");
  const [tableState, setTableState] = useState(true);

  const regex = new RegExp(deferredSearch, "i");

  //send to trash
  const handleDeleteClick = (id) => {
    doTrashAsset(id);
  };

  //handle record delete permanently
  const handlePermanentlyDelete = (id) => {
    doDeleteAsset(id);
  };

  //handle record restore
  const handleRestoreRecord = (id) => {
    doRestoreAsset(id);
  };

  //handle open/close of delete confimation dialog
  const handleConfirmationDeleteOpen = () => setOpenDeleteConfirm(true);
  const handleConfirmationDeleteClose = () => setOpenDeleteConfirm(false);

  //reset state function
  const resetState = () => {
    setSearchBy("name");
    setSearch("");
    setSelectedRowId("");
  };

  //handle open/close deleted asset table
  const handleOpenDeletedAssetTable = () => {
    setTableState(false);
    resetState();
  };
  const handleOpenAssetTable = () => {
    setTableState(true);
    resetState();
  };

  //table header data
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 250,
      headerAlign: "center",
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      headerClassName: "fw-bold fs-6 text-secondary",
    },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      headerAlign: "center",
      align: "center",
      editable: true,
      hideable: false,
      disableColumnMenu: true,
      cellClassName: "text-white",
      headerClassName: "fw-bold fs-6 text-secondary",
    },
    {
      field: "type",
      headerName: "Type",
      width: 150,
      headerAlign: "center",
      align: "center",
      editable: true,
      hideable: false,
      disableColumnMenu: true,
      cellClassName: "text-white",
      headerClassName: "fw-bold fs-6 text-secondary",
    },
    {
      field: "description",
      headerName: "Description",
      editable: true,
      headerAlign: "center",
      align: "center",
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      cellClassName: "d-flex position-relative text-white",
      headerClassName: "user-select-none fw-bold fs-6 text-secondary",
    },
    {
      field: "createdAt",
      headerName: "Uploaded At (date-time)",
      width: 200,
      editable: true,
      hideable: false,
      disableColumnMenu: false,
      headerAlign: "center",
      align: "center",
      cellClassName: "text-white",
      headerClassName: "fw-bold fs-6 text-secondary",
    },
    {
      field: "files",
      headerName: "Files",
      width: 200,
      headerAlign: "center",
      align: "center",
      cellClassName: "d-flex flex-wrap overflow-auto",
      headerClassName: "user-select-none fw-bold fs-6 text-secondary",
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => {
        const {
          row: { files },
        } = params;

        return files.map((file, i) => {
          const filename = file.filename
            ?.split("/")[2]
            ?.split("_")
            ?.slice(1)
            .join("");
          return (
            <a
              key={i}
              href={file.url}
              target="_blank"
              rel="noreferrer"
              className="text-decoration-none hover"
            >
              <span style={{ fontSize: "0.6rem" }} role="button">
                {filename} ,
              </span>
            </a>
          );
        });
      },
    },
    {
      field: "",
      headerName: "Edit",
      width: 150,
      headerAlign: "center",
      align: "center",
      headerClassName: "user-select-none fw-bold fs-6 text-secondary fs-6",
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => {
        const {
          row: { id, name, files, type },
        } = params;
        const isLoading = loadingTrashingAsset && selectedRowId === id;
        return (
          <div className="d-flex flex-column align-items-center">
            {tableState ? (
              <div>
                <IconButton
                  title="send to trash"
                  onClick={() => {
                    setSelectedRowId(id);
                    handleDeleteClick(id);
                  }}
                  disabled={loadingTrashingAsset}
                >
                  {isLoading ? (
                    <CircularProgress size={12} />
                  ) : (
                    <DeleteIcon className="text-danger hover" />
                  )}
                </IconButton>
                <EditAsset items={params}/>
              </div>
            ) : (
              <div className="d-flex gap-1 flex-column align-items-center flex-column">
                <Button
                  size="small"
                  startIcon={<RestoreIcon />}
                  title="restore record to previous state"
                  variant="contained"
                  onClick={() => {
                    setSelectedRowId(id);
                    handleRestoreRecord(id);
                  }}
                >
                  Restore
                </Button>
                <ConfirmationDialog
                  open={openDeleteConfirm}
                  onDisagree={handleConfirmationDeleteClose}
                  onAccept={() => {
                    handlePermanentlyDelete(id);
                    handleConfirmationDeleteClose();
                  }}
                  closeText="Cancel"
                  acceptText="Delete Permanently"
                  title={name}
                  content={
                    <>
                      <div>
                        {"type: "}
                        {type}
                      </div>
                      <div>
                        {"no. of files: "}
                        {files.length}
                      </div>
                      <p className="text-danger fw-bold mt-3">
                        Note: Deleted records cannot be restored later
                      </p>
                    </>
                  }
                >
                  <Button
                    size="small"
                    startIcon={<DeleteForeverIcon />}
                    title="delete this record permanently"
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setSelectedRowId(id);
                      handleConfirmationDeleteOpen();
                    }}
                  >
                    Delete
                  </Button>
                </ConfirmationDialog>
              </div>
            )}
            {errorTrashingAsset && (
              <span className="text-danger">{errorTrashingAsset}</span>
            )}
          </div>
        );
      },
    },
  ];

  //table body
  const isCurrentTable = tableState ? [...assets] : [...trashedAssets];
  const rows = isCurrentTable
    .filter((asset) => regex.test(asset[searchBy]))
    .map((asset) => {
      return {
        id: asset._id,
        name: asset.name,
        type: asset.type,
        description: asset.description,
        createdAt: moment(asset.createdAt).format("DD/MM/YYYY - hh:mm A"),
        files: asset.files,
      };
    });

  //fetching assets
  useEffect(() => {
    if (tableState) {
      doFetchAssets();
    } else {
      doFetchTrashAssets(true);
    }
  }, [doFetchAssets, doFetchTrashAssets, tableState]);

  //handle reseting trash error
  useEffect(() => {
    let time;
    if (errorTrashingAsset) {
      time = setTimeout(resetTrashError, 3000);
    }

    return () => clearTimeout(time);
  }, [resetTrashError, errorTrashingAsset]);

  return (
    <div
      className="px-3 overflow-auto position-relative"
      style={{ height: "45rem", scrollSnapType: "y mandatory" }}
    >
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
      >
        <h3 className="py-2 fw-bold">My Assets</h3>
        <NewAsset assets={assets} />
      </div>
      <div
        className="d-flex flex-column jusitfy-content-between"
        style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
      >
        {tableState ? (
          <div
            className="mb-3 align-self-end text-secondary hover"
            role="button"
            onClick={handleOpenDeletedAssetTable}
          >
            Trashed items{" "}
            <ArrowForwardIcon
              sx={{ marginInline: "0.5rem", fontSize: "1.2rem" }}
            />
          </div>
        ) : (
          <div
            className="mb-3 align-self-start text-secondary hover"
            role="button"
            onClick={handleOpenAssetTable}
          >
            <ArrowBackIcon
              sx={{ marginInline: "0.5rem", fontSize: "1.2rem" }}
            />
            Assets
          </div>
        )}
        {/* search text field */}
        <div
          className={`mb-3 ${
            tableState ? "align-self-start" : "align-self-end"
          } bg-dark`}
        >
          <div className="input-group">
            <div className="input-group-text bg-dark border-0">
              <input
                className="form-control shadow-none"
                style={{ width: "20rem" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="search by specific field"
              />
            </div>
            <div className="align-self-center fw-bold">search by</div>
            <select
              className="form-select border-0 shadow-none bg-dark"
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              style={{ color: "#009dff" }}
            >
              <option value="name">Name</option>
              <option value="type">Type</option>
            </select>
          </div>
        </div>

        {/* rendering assets table*/}
        {tableState ? (
          !assets.length ? (
            <h3 className="position-absolute top-50 start-50 translate-middle text-secondary ">
              No Assets Here
            </h3>
          ) : loadingAssets ? (
            <CircularProgress />
          ) : (
            <Table columns={columns} rows={rows} />
          )
        ) : !trashedAssets.length ? (
          <h3 className="position-absolute top-50 start-50 translate-middle text-secondary ">
            No Trashed Assets Here
          </h3>
        ) : loadingTrashAssets ? (
          <CircularProgress />
        ) : (
          <Table columns={columns} rows={rows} />
        )}

        {tableState ? (
          <div className="text-danger">
            {errorLoadingAssets && errorLoadingAssets}
          </div>
        ) : (
          <div className="text-danger">
            {errorLoadingTrashAssets && errorLoadingTrashAssets}
          </div>
        )}
      </div>

      <ProgressModal loadingEl={loadingRestoringAsset} text={"Restoring..."} />
      <ProgressModal loadingEl={loadingDeletingAsset} text={"Deleting..."} />

      <ErrorSnackBar
        open={errorDeletingAsset}
        note={errorDeletingAsset}
        autoHideDuration={5000}
        onClose={resetDeletingAsset}
      />
      <ErrorSnackBar
        open={errorRestoringAsset}
        note={errorRestoringAsset}
        autoHideDuration={5000}
        onClose={resetRestoringAsset}
      />
    </div>
  );
}

export default Assets;
