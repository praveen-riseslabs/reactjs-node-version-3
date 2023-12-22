import { Button, Chip, IconButton, Modal } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useRef, useState } from "react";
import { assetCategory } from "../../constants/assetsCategory";
import { createNewAsset } from "../../store";
import { useThunk } from "../../hooks/useThunk";
import UploadIcon from "@mui/icons-material/Upload";
import ProgressModal from "./ProgressModal";

function NewAsset({ assets, isMobile }) {
  const [open, setOpen] = useState(false);
  const [assetName, setAssetName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("None");
  const [customCategory, setCustomCategory] = useState("Other");
  const [selectedfiles, setSelectedFiles] = useState([]);
  const [description, setDescription] = useState("");

  const uploadFileInputRef = useRef(null);
  const previousAssetsLength = useRef(assets.length);

  const [
    doCreateNewAsset,
    loadingCreateNewAsset,
    errorCreatingNewAsset,
    resetError,
  ] = useThunk(createNewAsset);

  //opening/closing of modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //handle create asset
  const handleCreateAsset = async (e) => {
    e.preventDefault();

    const fd = new FormData();

    fd.append("name", assetName);
    fd.append(
      "type",
      selectedCategory !== "Other" ? selectedCategory : customCategory
    );
    fd.append("description", description);

    for (let i = 0; i < selectedfiles.length; i++) {
      fd.append("files", selectedfiles[i]);
    }
    await doCreateNewAsset(fd);
  };

  //handle upload file click
  const handleUploadFileClick = () => {
    uploadFileInputRef.current.click();
  };

  //handle remove file click
  const handleFileRemove = (file) => {
    setSelectedFiles((oldFiles) =>
      oldFiles.filter(
        (f) => `${f.name + f.size}` !== `${file.name + file.size}`
      )
    );
  };

  //handle reseting error
  useEffect(() => {
    let time;
    if (errorCreatingNewAsset) {
      time = setTimeout(resetError, 3000);
    }

    return () => clearTimeout(time);
  }, [resetError, errorCreatingNewAsset]);

  // closing modal after successful asset creation
  useEffect(() => {
    if (previousAssetsLength.current < assets.length) {
      handleClose();
      setSelectedCategory("None");
      setAssetName("");
      setSelectedFiles([]);
      setDescription("");
    }

    return () => (previousAssetsLength.current = assets.length);
  }, [assets.length]);

  //mapping over assets default category
  const categories = assetCategory.map((category) => (
    <option
      key={category}
      defaultValue={category === selectedCategory}
      value={category}
      title={category}
    >
      {category}
    </option>
  ));

  return (
    <>
      {isMobile ? (
        <IconButton onClick={handleOpen}>
          <AddBoxIcon
            sx={{
              color: "white",
              bgcolor: "#009dff",
              width: "2rem",
              borderRadius: "0.5rem",
            }}
          />
        </IconButton>
      ) : (
        <Button
          variant="contained"
          style={{ backgroundColor: "#009dff" }}
          startIcon={<AddBoxIcon />}
          onClick={handleOpen}
        >
          Create New Asset
        </Button>
      )}

      <Modal open={open}>
        <div
          className="position-absolute top-50 start-50 translate-middle bg-dark
        rounded p-2 text-light"
          style={{ width: isMobile ? "50%" : "30%" }}
        >
          {/* header */}
          <div className="d-flex justify-content-between align-items-center pb-2">
            <h4 className="fs-6 fs-md-4">Create New Asset</h4>
            <IconButton onClick={handleClose} disabled={loadingCreateNewAsset}>
              <CloseIcon sx={{ color: "white" }} />
            </IconButton>
          </div>

          {/* content */}
          <form
            className="d-flex flex-column gap-2"
            onSubmit={handleCreateAsset}
          >
            {/* asset name */}
            <div className="d-flex">
              <label className="fw-bold">Asset name:</label>
              <input
                className="form-control"
                placeholder="Asset name"
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
              />
            </div>

            {/* select asset type */}
            <div className=" d-flex flex-column gap-1">
              <label className="fw-bold">Asset Category</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control shadow-none"
                  disabled={selectedCategory !== "Other"}
                  value={
                    selectedCategory !== "Other"
                      ? selectedCategory
                      : customCategory
                  }
                  title={
                    selectedCategory !== "Other"
                      ? selectedCategory
                      : customCategory
                  }
                  onChange={(e) => setCustomCategory(e.target.value)}
                />
                <select
                  className="pt-2 form-select shadow-none bg-dark text-white"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories}
                </select>
              </div>
            </div>

            {/* asset description */}
            <div className="form-floating">
              <textarea
                className="form-control"
                placeholder="Leave a comment here"
                id="description"
                style={{ resize: "none", height: "10rem" }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
              />
              <label
                htmlFor="description"
                className="fw-bold"
                style={{ color: "#009dff" }}
              >
                Asset Description
              </label>
            </div>

            {/* file upload */}
            <div className="mt-2 d-flex flex-column gap-2">
              <label className="fw-bold">Upload File</label>
              <Button
                onClick={handleUploadFileClick}
                variant="contained"
                startIcon={<UploadIcon />}
              >
                Upload a file
              </Button>
              <input
                type="file"
                name="file"
                multiple
                onChange={(e) => {
                  const files = e.target.files;
                  const filesArray = Array.from(files);
                  setSelectedFiles([...selectedfiles, ...filesArray]);
                }}
                className="d-none"
                ref={uploadFileInputRef}
              />
              {selectedfiles.length > 0 && (
                <div className="d-flex flex-wrap gap-1 p-1 rounded bg-black">
                  {selectedfiles.map((file) => {
                    return (
                      <Chip
                        key={file.name + file.size}
                        label={file.name}
                        variant="outlined"
                        onDelete={() => handleFileRemove(file)}
                        sx={{
                          backgroundColor: "#8a2be2",
                          border: "none",
                          fontSize: "0.6rem",
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* error */}
            <div className="text-danger">
              {errorCreatingNewAsset && errorCreatingNewAsset}
            </div>

            <Button
              type="submit"
              className="fw-bold"
              style={{ letterSpacing: "1rem" }}
              disabled={loadingCreateNewAsset}
            >
              Create
            </Button>
          </form>
        </div>
      </Modal>

      <ProgressModal loadingEl={loadingCreateNewAsset} text={"Creating..."} />
    </>
  );
}

export default NewAsset;
