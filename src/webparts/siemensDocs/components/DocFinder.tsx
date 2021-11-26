import { TextField } from "@fluentui/react";
import React, { useEffect, useState } from "react";

interface Props { }

const DocFinder = (props: Props) => {
  const [fetchedDocuments, setFetchedDocuments] = useState<File[]>();
  useEffect(() => {
    
  }, [])
  return <div>
    <TextField placeholder="Введите поисковой запрос" />
  </div>;
};

export default DocFinder;
