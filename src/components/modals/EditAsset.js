import { Button, Chip, IconButton, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import ProgressModal from "./ProgressModal";
import { updateAsset } from "../../store";
import { useThunk } from "../../hooks/useThunk";
import { assetCategory } from "../../constants/assetsCategory";
import CloseIcon from "@mui/icons-material/Close";
import ErrorSnackBar from "./ErrorSnackBar";

function EditAsset({ items: { row: asset }, isMobile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [assetName, setAssetName] = useState(asset.name);
  const [selectedCategory, setSelectedCategory] = useState(
    assetCategory.includes(asset.type) ? asset.type : "Other"
  );
  const [customCategory, setCustomCategory] = useState(
    assetCategory.includes(asset.type) ? "Other" : asset.type
  );
  const [description, setDescription] = useState(asset.description);

  const [
    doUpdateAsset,
    loadingUpdateAsset,
    errorUpdateAsset,
    resetError,
    isUpdateSuccess,
    resetIsUpdateSuccess,
  ] = useThunk(updateAsset);

  //opening/closing of modal
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  //handle create asset
  const handleUpdateAsset = (e) => {
    e.preventDefault();

    const data = {
      id: asset.id,
      name: assetName,
      type: selectedCategory !== "Other" ? selectedCategory : customCategory,
      description: description,
    };

    doUpdateAsset(data);
  };

  //handle reseting error
  useEffect(() => {
    let time;
    if (errorUpdateAsset) {
      time = setTimeout(resetError, 3000);
    }

    return () => clearTimeout(time);
  }, [resetError, errorUpdateAsset]);

  useEffect(() => {
    isUpdateSuccess && handleClose();
  }, [isUpdateSuccess]);

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
      <IconButton title="edit record" onClick={handleOpen}>
        <EditIcon className="text-info hover" />
      </IconButton>
      <Modal open={isOpen}>
        <div
          className="position-absolute top-50 start-50 translate-middle bg-dark
        rounded p-2 text-light"
          style={{ width: isMobile ? "50%" : "30%" }}
        >
          {/* header */}
          <div className="d-flex justify-content-between align-items-center pb-2">
            <h4 className="fs-5 fs-md-4">Edit Asset</h4>
            <IconButton onClick={handleClose} disabled={loadingUpdateAsset}>
              <CloseIcon sx={{ color: "white" }} />
            </IconButton>
          </div>

          {/* content */}
          <form
            className="d-flex flex-column gap-2"
            onSubmit={handleUpdateAsset}
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
              <div className="d-flex flex-wrap gap-1 p-1 rounded bg-black">
                {asset.files.map((file, i) => {
                  const filename = file.filename
                    ?.split("/")[2]
                    ?.split("_")
                    ?.slice(1)
                    .join("");
                  return (
                    <Chip
                      key={i}
                      label={filename}
                      variant="outlined"
                      sx={{
                        backgroundColor: "#009dff",
                        border: "none",
                        fontSize: "0.6rem",
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* error */}
            <div className="text-danger">
              {errorUpdateAsset && errorUpdateAsset}
            </div>

            <Button
              type="submit"
              className="fw-bold"
              style={{ letterSpacing: "1rem" }}
              disabled={loadingUpdateAsset}
            >
              Update
            </Button>
          </form>
        </div>
      </Modal>

      <ErrorSnackBar
        open={errorUpdateAsset}
        severity="error"
        note={"Failed to update asset"}
        onClose={resetError}
        autoHideDuration={3000}
      />
      <ErrorSnackBar
        open={isUpdateSuccess}
        severity="success"
        note={"Asset Was Successfully Updated"}
        onClose={resetIsUpdateSuccess}
        autoHideDuration={3000}
      />
      <ProgressModal loadingEl={loadingUpdateAsset} text={"Updating..."} />
    </>
  );
}

export default EditAsset;
