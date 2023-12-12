import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";
import { CircularProgress, IconButton } from "@mui/material";
import { useThunk } from "../hooks/useThunk";
import { deleteFile } from "../store";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

function FileList({ files }) {
  const [removeUploadedFile, removingFileInProgress, errorRemovingFiles] =
    useThunk(deleteFile);

  //handle deleting files
  const handleDeleteFile = (id) => {
    removeUploadedFile(id);
  };

  return (
    <div className="mt-4">
      <h6>Uploaded Files</h6>
      <div className="mt-3 d-flex flex-column gap-3 pb-2 overflow-auto" style={{height:"30rem"}}>
        {files.map((file) => {
          const filename = file.filename.split("_")[1];
          const date = moment(file.createdAt).format("DD/MM/YYYY - hh:mm A");
          return (
            <div
              className="border p-2 d-flex justify-content-between align-items-center rounded px-3 shadow-lg"
              key={file._id}
            >
              <span className="d-flex flex-column justify-content-center align-items-center">
                <span className="text-secondary">Filename :</span>
                <span>{filename}</span>
              </span>
              <span className="d-flex flex-column justify-content-center align-items-center">
                <span className="text-secondary">Uploaded At :</span>
                <span>{date}</span>
              </span>
              <span className="d-flex justify-content-center align-items-center gap-3">
                <a href={file.fileUrl} download={filename} target="_blank" rel="noreferrer">
                  <IconButton
                    sx={{ color: "#009dff", width: "2rem", height: "2rem" }}
                  >
                    <RemoveRedEyeIcon />
                  </IconButton>
                </a>
                {removingFileInProgress ? (
                  <CircularProgress size={12} />
                ) : errorRemovingFiles ? (
                  <IconButton
                    color="error"
                    sx={{ width: "2rem", height: "2rem" }}
                    title={`Error Removing File : ${filename}`}
                  >
                    <ErrorOutlineIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    color="error"
                    sx={{ width: "2rem", height: "2rem" }}
                    onClick={() => handleDeleteFile(file._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FileList;
