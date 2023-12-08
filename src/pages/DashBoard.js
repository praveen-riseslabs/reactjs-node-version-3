import { useState } from "react";
import { userApi } from "../store/api/user";

function DashBoard() {
  const [file, setFile] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    // await userApi.post("/file/upload", formData, {
    //   headers: { "Content-Type": "multipart/form-data" },
    // });
  };
  
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
          <button className="btn btn-outline-secondary" type="submit">
            Upload
          </button>
        </div>
      </form>
    </div>
  );
}

export default DashBoard;
