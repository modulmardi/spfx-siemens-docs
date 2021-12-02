import { DefaultButton, Depths, Modal, Stack, StackItem, TextField } from "@fluentui/react";
import { useBoolean } from '@fluentui/react-hooks';
import { escapeRegExp } from "lodash";
import React, { useContext, useEffect, useState } from "react";
import strings from "SiemensDocsWebPartStrings";
import { fetchDocxDownloadLinks, fetchDocxTagsWithMetas } from "../utils/downloadUtils";
import blobToHtml from "../utils/fileToHtml";
import { SiemensContext } from "./SiemensDocs";

interface Props { }

const DocFinder = (props: Props) => {
  const { spContext, path: path } = useContext(SiemensContext);
  const [fetchedDocumentsMetas, setFetchedDocumentsMetas] = useState<{
    name: string, downloadLink: string, eTag: string, tags?: string[]
  }[]>();
  const [fetchedTagsWithMetas, setFetchedTagsWithMetas] = useState<{ eTag: string, tags: string }[]>()
  const [documentHtml, setDocumentHtml] = useState<any>();
  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
    useBoolean(false);

  const [searchString, setSearchString] = useState("")
  const [escapedTokenizedSearchString, setEscapedTokenizedSearchString] = useState<string[]>()

  const handleSearchStringInputChange = (e, str: string) => {
    setSearchString(str);
  }

  useEffect(() => {
    setEscapedTokenizedSearchString(escapeRegExp(searchString).split(" "));
  }, [searchString])

  useEffect(() => {
    fetchDocxDownloadLinks(spContext, path)
      .then(_fetchedDocumentsMetas => setFetchedDocumentsMetas(_fetchedDocumentsMetas));
  }, []);


  useEffect(() => {
    fetchDocxTagsWithMetas(spContext)
      .then(_fetchedTagsWithMetas => setFetchedTagsWithMetas(_fetchedTagsWithMetas))
  }, [])

  useEffect(() => {
    if (fetchedDocumentsMetas && fetchedTagsWithMetas) {

      const tagsWithMetas = fetchedTagsWithMetas?.map((tagsWithMeta) => ({
        eTag: tagsWithMeta.eTag, tags: tagsWithMeta.tags?.split("#")
          .map(tagToken => tagToken.trim())
          .filter(tagToken => tagToken)
      }))


      // if(buf)
      //_fetchedDocumentMeta[id] = buf;

      const lol = fetchedDocumentsMetas.map((documentMeta) => {
        return ({
          ...documentMeta, tags: tagsWithMetas?.filter((tagsWithMeta) => {
            return tagsWithMeta.eTag === documentMeta.eTag
          })[0]?.tags
        })
      })
      setFetchedDocumentsMetas(lol);

      // setFetchedDocumentsMetas(lol);
    }
  }, [fetchedTagsWithMetas])
  return <div>
    <TextField placeholder="Введите поисковой запрос" onChange={handleSearchStringInputChange} />
    <Stack style={{ width: '100%' }}>
      {fetchedDocumentsMetas?.filter((item) => {
        let searcher;
        try {
          const regexes = escapedTokenizedSearchString.filter((str) => str).map((str) => new RegExp(str, 'gi'));
          console.error('regexes', regexes);

          const searchName = regexes.every((regex) => item.name.match(regex));

          const searchTags = item.tags?.filter((tag) => regexes.some((regex) => {
            console.log(tag, regex, tag.match(regex), !!tag.match(regex), tag.match(regex)?.length !== 0);

            return !!tag.match(regex)
          })).length >= regexes.length;
          searcher = searchName || searchTags;
          console.log(!!searcher);
          console.log(searcher);
          console.log('name', !!searchName, searchName);
          console.log('tags', !!searchTags, searchTags);
        }
        catch (error) {
          console.error(error);
        }
        return !searchString || searcher;
      }).map((document, documentId) =>
        <Stack onClick={async () => {
          try {
            const file = await (await fetch(`${document.downloadLink}`)).blob();
            blobToHtml(file, (html: any) => setDocumentHtml(html));
            showModal();
          } catch { }
        }} style={{ boxShadow: Depths.depth16, margin: '2%', marginLeft: 0, padding: '5%', width: "100%" }} >
          <StackItem align='start'>
            <h2 style={{ margin: 0 }}> {document.name} </h2>
          </StackItem>
          {document.tags &&
            <Stack wrap horizontal style={{ marginTop: '2%' }}>
              {document.tags.map(tag => {

                return <h3 style={{ backgroundColor: 'lavenderblush', marginRight: '2%', padding: '2%' }}>{tag}</h3>
              })}
            </Stack>}
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
