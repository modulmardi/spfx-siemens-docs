import { DefaultButton, Modal, PrimaryButton } from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import React, { useContext, useEffect, useState } from "react";
import * as strings from "SiemensDocsWebPartStrings";
import fileToHtml from "../utils/fileToHtml";
import { SPContext } from "./SiemensDocs";

interface Props {}

const DocMaker = (props: Props) => {
  const spContext = useContext(SPContext);
  const [docFile, setDocFile] = useState<File>();
  const [docHtml, setDocHtml] = useState<any>();
  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
    useBoolean(false);
  useEffect(() => {
    try {
      fileToHtml(docFile, (html) => setDocHtml(html));
    } catch {}
  }, [docFile]);
  return (
    <>
      <input
        type="file"
        accept="application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={(e) => setDocFile(e.target.files[0])}
      />
      <DefaultButton
        disabled={!docHtml?.value}
        onClick={() => showModal()}
        text={strings.OpenPreviewModalButtonLabel}
      />
      <PrimaryButton
        disabled={!docHtml?.value}
        onClick={() => showModal()}
        text={strings.SaveDocumentButtonLabel}
      />
      <Modal isOpen={isModalOpen} onDismiss={hideModal} isBlocking={false}>
        <div
          className="Container"
          dangerouslySetInnerHTML={{ __html: docHtml?.value }}
        ></div>
      </Modal>
    </>
  );
};

export default DocMaker;
