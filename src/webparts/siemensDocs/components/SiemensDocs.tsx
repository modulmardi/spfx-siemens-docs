import { WebPartContext } from "@microsoft/sp-webpart-base";
import React, { createContext } from "react";
import DocFinder from "./DocFinder";
import DocMaker from "./DocMaker";

export interface ISiemensDocsProps {
  spContext: WebPartContext;
  editorMode: boolean;
}


export const SPContext = createContext<WebPartContext>(null);

const SiemensDocs = ({
  editorMode,
  spContext,
  ...props
}: ISiemensDocsProps) => {

  return (
    <>
      <SPContext.Provider value={spContext}>
        {(editorMode && (
          <>
            <DocMaker />
          </>
        )) || <DocFinder />}
      </SPContext.Provider>
    </>
  );
};

export default SiemensDocs;
