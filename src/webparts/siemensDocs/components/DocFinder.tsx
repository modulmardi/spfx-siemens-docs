import { DefaultButton, Modal, Stack, TextField } from "@fluentui/react";
import { useBoolean } from '@fluentui/react-hooks';
import React, { useContext, useEffect, useState } from "react";
import strings from "SiemensDocsWebPartStrings";
import { fetchDocxFiles } from "../utils/downloadUtils";
import { SiemensContext } from "./SiemensDocs";

interface Props { }

const DocFinder = (props: Props) => {
  const { spContext, path: path } = useContext(SiemensContext);
  const [fetchedDocuments, setFetchedDocuments] = useState<{ name: string, file: Blob }[]>();
  const [documentHtml, setDocumentHtml] = useState<any>()
  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
    useBoolean(false);
  useEffect(() => {
    fetchDocxFiles(spContext, path).then(fetchedDocuments => setFetchedDocuments(fetchedDocuments))
  }, [])
  return <div>
    <TextField placeholder="Введите поисковой запрос" />
    {fetchedDocuments?.map((document) =>
      <Stack style={{ margin: '5%', width: "100%" }} horizontal>
        <h1 style={{ margin: 0, width: '50%' }}> {document.name} </h1>
        <div style={{ width: "50%" }}>
          <DefaultButton
            disabled={!documentHtml?.value}
            onClick={() => showModal()}
            text={strings.OpenPreviewModalButtonLabel}
          />
        </div>
      </Stack>)}
    <Modal isOpen={isModalOpen} onDismiss={hideModal} isBlocking={false}>
      <div
        className="Container"
        dangerouslySetInnerHTML={{ __html: documentHtml?.value }}
      />
    </Modal>
  </div>;
};

export default DocFinder;
