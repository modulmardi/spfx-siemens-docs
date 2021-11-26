import { WebPartContext } from "@microsoft/sp-webpart-base";
import React, { createContext, FC } from "react";
import DocFinder from "./DocFinder";
import DocMaker from "./DocMaker";

export interface ISiemensDocsProps {
  spContext: WebPartContext;
  path: string
  editorMode: boolean;
}

export const SiemensContext = createContext<{ spContext: WebPartContext, path: string }>(null);

const SiemensDocs: FC<ISiemensDocsProps> = ({
  editorMode,
  spContext,
  path,
  ...props
}: ISiemensDocsProps) => (
  <SiemensContext.Provider value={{ spContext, path }}>
    {(editorMode && (
      <>
        <DocMaker />
      </>
    )) || <DocFinder />}
  </SiemensContext.Provider >
);

export default SiemensDocs;
