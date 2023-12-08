import multer from "multer";

const fileCfg = multer.memoryStorage()

const upload = multer({ storage: fileCfg });

export { upload };
