import { LinearProgress, Modal } from "@mui/material";

function ProgressModal({ loadingEl, text }){
  return (
    <Modal open={loadingEl}>
      <div
        className="position-absolute top-50 start-50 translate-middle bg-dark rounded p-2"
        style={{ width: "20rem" }}
      >
        <p className="text-light">{text}</p>
        <LinearProgress sx={{ bgcolor: "#8a2be2" }} />
      </div>
    </Modal>
  );
}

export default ProgressModal;
