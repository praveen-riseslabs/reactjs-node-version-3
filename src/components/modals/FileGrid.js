import { IconButton, SwipeableDrawer } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";
import FileDownloader from "../miscellaneous/FileDownloader";

function FileGrid({ files, isMobile }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  //handling opening/closing of menu upon clicking on view icon
  const toggleDrawer = (open) => (e) => {
    if (e && e.type === "keydown" && (e.key === "Tab" || e.key === "Shift")) {
      return;
    }

    setIsDrawerOpen(!isDrawerOpen);
  };

  //render files
  const renderedFiles = files.map((file) => {
    return <FileDownloader key={file.filename} file={file} isMobile={isMobile}/>;
  });

  return (
    <>
      <IconButton onClick={toggleDrawer(true)}>
        <VisibilityIcon sx={{ color: "#009dff" }} />
      </IconButton>
      <SwipeableDrawer
        classes={{ paperAnchorBottom: "h-75 bg-dark scroll-1" }}
        anchor={"bottom"}
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <div className="text-white p-2">
          <h6 className="text-center mb-3 pb-3 border-bottom border-secondary">
            Uploaded Files
          </h6>
          <div className="d-flex justify-content-center flex-wrap gap-5">
            {renderedFiles}
          </div>
        </div>
      </SwipeableDrawer>
    </>
  );
}

export default FileGrid;
