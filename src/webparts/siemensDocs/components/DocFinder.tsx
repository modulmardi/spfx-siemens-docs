import { DefaultButton, Modal, Stack, StackItem, TextField } from "@fluentui/react";
import { useBoolean } from '@fluentui/react-hooks';
import React, { useContext, useEffect, useState } from "react";
import strings from "SiemensDocsWebPartStrings";
import { fetchDocxDownloadLinks, fetchDocxTags } from "../utils/downloadUtils";
import blobToHtml from "../utils/fileToHtml";
import { SiemensContext } from "./SiemensDocs";

interface Props { }

const DocFinder = (props: Props) => {
  const { spContext, path: path } = useContext(SiemensContext);
  const [fetchedDocumentsMetas, setFetchedDocumentsMetas] = useState<{ name: string, downloadLink: string, eTag: string }[]>();
  const [fetchedTags, setFetchedTags] = useState<{ eTag: string, tags: string }[]>();
  const [documentHtml, setDocumentHtml] = useState<any>();
  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
    useBoolean(false);
  useEffect(() => {
    fetchDocxDownloadLinks(spContext, path)
      .then(_fetchedDocumentsMetas => setFetchedDocumentsMetas(_fetchedDocumentsMetas));
    fetchDocxTags(spContext)
      .then(_fetchedTags => setFetchedTags(_fetchedTags));
  }, []);
  console.log(fetchedTags);
  console.log(fetchedDocumentsMetas);

  return <div>
    <TextField placeholder="Введите поисковой запрос" />
    <Stack style={{ width: '60%' }}>
      {fetchedDocumentsMetas?.map((document, documentId) =>
        <Stack style={{ margin: '5%', width: "100%" }} >
          <Stack horizontal>
            <StackItem align='start'>
              <h1 style={{ margin: 0 }}> {document.name} </h1>
            </StackItem>
            <StackItem align='end'>
              <DefaultButton
                // disabled={!!document.file}
                onClick={async () => {
                  try {
                    const file = await (await fetch(`${document.downloadLink}`)).blob();
                    blobToHtml(file, (html: any) => setDocumentHtml(html));
                    showModal();
                  } catch { }
                }}
                text={strings.OpenPreviewModalButtonLabel}
              />
            </StackItem>
          </Stack>
          <Stack horizontal>
            {fetchedTags?.filter(val => val.eTag === document.eTag)
              .map(tagsWithMeta => tagsWithMeta.tags.split("#")
                .map(tagToken => tagToken.trim())
                .filter(tagToken => tagToken)
                .map(tag => <h3 style={{ backgroundColor: 'lavenderblush', marginRight: '2%', padding: '2%' }}>{tag}</h3>))}
          </Stack>
        </Stack>)}
    </Stack>
    <Modal isOpen={isModalOpen} onDismiss={hideModal} isBlocking={false}>
      <div
        className="Container"
        dangerouslySetInnerHTML={{ __html: documentHtml?.value }}
      />
    </Modal>
  </div>;
};

export default DocFinder;
