import React, { useContext, useEffect, useState } from "react";
import { SPContext } from "./SiemensDocs";

interface Props {}

const DocMaker = (props: Props) => {
  const spContext = useContext(SPContext);
  const [docFile, setDocFile] = useState<File>();
  useEffect(() => console.log(docFile), [docFile]);
  return (
    <>
      <input
        type="file"
        accept="application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={(e) => setDocFile(e.target.files[0])}
      />
    </>
  );
};

export default DocMaker;
