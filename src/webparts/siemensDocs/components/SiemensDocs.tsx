import { WebPartContext } from "@microsoft/sp-webpart-base";
import React, { createContext, FC } from "react";
import DocFinder from "./DocFinder";
import DocMaker from "./DocMaker";

export interface ISiemensDocsProps {
  spContext: WebPartContext;
  filePath: string
  editorMode: boolean;
}

export const SiemensContext = createContext<{ spContext: WebPartContext, filePath: string }>(null);

const SiemensDocs: FC<ISiemensDocsProps> = ({
  editorMode,
  spContext,
  filePath,
  ...props
}: ISiemensDocsProps) => (
  <SiemensContext.Provider value={{ spContext, filePath }}>
    {(editorMode && (
      <>
        <DocMaker />
      </>
    )) || <DocFinder />}
  </SiemensContext.Provider >
);

export default SiemensDocs;
