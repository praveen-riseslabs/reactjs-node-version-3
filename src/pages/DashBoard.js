import { useEffect, useState } from "react";
import { useThunk } from "../hooks/useThunk";
import { getAllFiles, uploadFile } from "../store";
import FileList from "../components/FileList";
import { CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";

function DashBoard() {
  const [file, setFile] = useState();
  const [doUploadFile, loadingFileUpload] = useThunk(uploadFile);
  const [doLoadFiles, loadingFiles, errorLoadingFiles] = useThunk(getAllFiles);

  const { files } = useSelector((state) => state.file);

  //handle uploading a file
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    doUploadFile(formData);
  };

  //loading all uploaded files
  useEffect(() => {
    if (!files.length) {
      doLoadFiles();
    }
  }, [files.length, doLoadFiles]);

  return (
    <div className="px-3">
      <h3 className="py-2 fw-bold">Dashboard</h3>
      <form onSubmit={handleSubmit}>
        <p>Upload Files</p>
        <div className=" input-group">
          <input
            type="file"
            name="file"
            className="form-control"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            className="btn btn-outline-secondary"
            type="submit"
            disabled={loadingFileUpload || !file}
          >
            {loadingFileUpload ? <CircularProgress /> : "Upload"}
          </button>
        </div>
      </form>
      {loadingFiles ? (
        <CircularProgress
          sx={{ position: "absolute", left: "50%", top: "50%" }}
        />
      ) : errorLoadingFiles ? (
        <div className="alert alert-danger position-absolute top-50 start-50">
          Error Loading Files!
        </div>
      ) : (
        <FileList files={files} />
      )}
    </div>
  );
}

export default DashBoard;
