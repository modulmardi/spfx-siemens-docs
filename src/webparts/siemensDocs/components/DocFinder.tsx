import { TextField } from "@fluentui/react";
import React, { useContext, useEffect, useState } from "react";
import { fetchDocxFiles } from "../utils/downloadUtils";
import { SiemensContext } from "./SiemensDocs";

interface Props { }

const DocFinder = (props: Props) => {
  const { spContext, path: path } = useContext(SiemensContext);
  const [fetchedDocuments, setFetchedDocuments] = useState<File[]>();
  useEffect(() => {
    fetchDocxFiles(spContext, path)
  }, [])
  return <div>
    <TextField placeholder="Введите поисковой запрос" />
  </div>;
};

export default DocFinder;
