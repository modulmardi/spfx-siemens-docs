import { WebPartContext } from "@microsoft/sp-webpart-base";
import React, { createContext, FC } from "react";
import DocFinder from "./DocFinder";
import DocMaker from "./DocMaker";

export interface ISiemensDocsProps {
  spContext: WebPartContext;
  editorMode: boolean;
}

export const SPContext = createContext<WebPartContext>(null);

const SiemensDocs: FC<ISiemensDocsProps> = ({
  editorMode,
  spContext,
  ...props
}: ISiemensDocsProps) => (
  <SPContext.Provider value={spContext}>
    {(editorMode && (
      <>
        <DocMaker />
      </>
    )) || <DocFinder />}
  </SPContext.Provider>
);

export default SiemensDocs;
