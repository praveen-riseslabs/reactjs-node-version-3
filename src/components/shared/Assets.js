import { useSelector } from "react-redux";
import NewAsset from "../modals/NewAsset";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useThunk } from "../../hooks/useThunk";
import { getAllAssets } from "../../store";
import { useEffect, useState } from "react";
import {
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function Assets() {
  const [doFetchAssets, loadingAssets, errorLoadingAssets] =
    useThunk(getAllAssets);

  const { assets } = useSelector((state) => state.asset);

  // const [sortedData, setSortedData] = useState(assets);

  //fetching assets
  useEffect(() => {
    doFetchAssets();
  }, [doFetchAssets]);

  //table header data
  const headerData = [
    {
      label: "Name",
      isSortable: true,
      onClick() {
        console.log("click on name");
      },
    },
    {
      label: "Type",
      isSortable: true,
      onClick() {
        console.log("click on type");
      },
    },
    { label: "Description", isSortable: false },
    {
      label: "Uploaded At (date-time)",
      isSortable: true,
      onClick() {
        console.log("click on date");
      },
    },
    { label: "Files", isSortable: false },
    { label: "Edit", isSortable: false },
  ];

  //rendered header row
  const renderedHeader = headerData.map((header) => {
    return <TableCell onClick={header.onClick}>{header.label}</TableCell>;
  });

  //rendered assets list
  const renderedAssets = assets.map((asset) => {
    return (
      <TableRow key={asset._id}>
        <TableCell>{asset.name}</TableCell>
        <TableCell>{asset.type}</TableCell>
        <TableCell>{asset.description}</TableCell>
        <TableCell>
          {moment(asset.createdAt).format("DD/MM/YYYY - hh:mm A")}
        </TableCell>
        <TableCell
          className="d-flex gap-1 flex-wrap scroll-none"
          style={{ width: "15rem", overflow: "auto" }}
        >
          {asset.files.map((file, i) => {
            const filename = file.filename.split("/")[2].split("_")[1];
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
          })}
        </TableCell>

        <TableCell>
          <IconButton>
            <DeleteIcon className="text-danger" />
          </IconButton>
          <IconButton>
            <EditIcon className="text-info" />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  });

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
        <div className="mb-3 align-self-end text-secondary hover" role="button">
          deleted items{" "}
          <ArrowForwardIcon
            sx={{ marginInline: "0.5rem", fontSize: "1.2rem" }}
          />
        </div>

        {/* rendering assets table*/}
        {!assets.length ? (
          <h3 className="position-absolute top-50 start-50 translate-middle text-secondary ">
            No Assets Here
          </h3>
        ) : loadingAssets ? (
          <CircularProgress />
        ) : (
          <TableContainer
            sx={{ bgcolor: "white", height: "35rem", borderRadius: "0.5rem" }}
            className="scroll-none"
          >
            <Table stickyHeader>
              {/* table header */}
              <TableHead>
                <TableRow>{renderedHeader}</TableRow>
              </TableHead>

              {/* table body */}
              <TableBody>{renderedAssets}</TableBody>
            </Table>
          </TableContainer>
        )}
        <div className="text-danger">
          {errorLoadingAssets && errorLoadingAssets}
        </div>
      </div>
    </div>
  );
}

export default Assets;
