import { useState } from "react";
import { getFileIcon } from "../../utils/getFileIcon";
import DownloadIcon from "@mui/icons-material/Download";
import { IconButton } from "@mui/material";

function FileDownloader({ file, isMobile = false }) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      style={{
        width: isMobile ? "6rem" : "8rem",
        height: isMobile ? "10rem" : "12rem",
        objectFit: "cover",
      }}
      className="overflow-hidden hover"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isHovering ? (
        <div className="w-100 h-100 position-relative">
          <div className="position-absolute z-3 top-50 start-50 translate-middle">
            <a
              href={file.url}
              target="_blank"
              rel="noreferrer"
              className="text-decoration-none"
            >
              <IconButton sx={{ bgcolor: "black" }} disableRipple>
                <DownloadIcon sx={{ color: "white" }} className="hover" />
              </IconButton>
            </a>
          </div>
          {getFileIcon(file)}
        </div>
      ) : (
        <a
          href={file.url}
          target="_blank"
          rel="noreferrer"
          className="text-decoration-none"
        >
          {getFileIcon(file)}
        </a>
      )}
    </div>
  );
}

export default FileDownloader;
