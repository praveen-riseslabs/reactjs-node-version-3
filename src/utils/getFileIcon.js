import { FileIcon, defaultStyles } from "react-file-icon";

export const getFileIcon = (file) => {
  const filename = file.filename?.split("/")[2]?.split("_")?.slice(1).join("");

  const regex = /\.(.+)$/;
  const type = file.filename?.match(regex);
  let finalType = type[1];
  const strArr = finalType.split(".");

  if (strArr.length > 1) {
    finalType = strArr.at(-1);
  } else {
    finalType = strArr[0];
  }

  let comp;
  if (/(jpg|png|jpeg)/.test(finalType)) {
    comp = <img src={file.url} className="h-75 w-100" alt={file.filename} />;
  } else {
    comp = (
      <FileIcon
        color={"dark"}
        extension={finalType}
        {...defaultStyles[finalType]}
      />
    );
  }

  return (
    <>
      {comp}
      <p className="fw-bolder text-center text-secondary" title={filename}>
        {filename}
      </p>
    </>
  );
};
