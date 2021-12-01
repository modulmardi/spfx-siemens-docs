import { WebPartContext } from "@microsoft/sp-webpart-base";
import { getCurrentSiteRootDriveId } from "./getCurrentSiteRootDriveId";

export const fetchDocxFiles = async (
  context: WebPartContext,
  path: string
): Promise<{ name: string; file: Blob }[]> => {
  const client = await context.msGraphClientFactory.getClient();
  const driveId = await getCurrentSiteRootDriveId(context);

  const filesMetas = await fetchDocxDownloadLinks(context, path);
  const files = Promise.all(
    filesMetas
      .filter((fileMeta) => fileMeta.name.match(/.*.docx/))
      .map(async (fileMeta) => {
        const file = await (
          await fetch(`${fileMeta["@microsoft.graph.downloadUrl"]}`)
        ).blob();
        console.log({ name: fileMeta.name, file: file });

        return { name: fileMeta.name, file: file };
      })
  );
  console.log("lol", files);
  return files;
};

export const fetchDocxTagsWithMetas = async (
  context: WebPartContext
): Promise<{ eTag: string; tags: string }[]> => {
  //sites/root/lists/11e8aaae-84f6-4ffd-beab-1866d5c2874b/items?$expand=fields
  const client = await context.msGraphClientFactory.getClient();
  const listId = await client
    .api("sites/root/lists")
    .get()
    .then(
      (response: { value: { name: string; id: string }[] }) =>
        response.value.filter((val) => val.name === "Shared Documents")[0].id
    );
  return await client
    .api(`sites/root/lists/${listId}/items?$expand=fields`)
    .get()
    .then((response: { value: { eTag: string; fields: { tags: string } }[] }) =>
      response.value
        .filter((val) => val.fields.tags !== undefined)
        .map((val) => ({
          eTag: val.eTag.slice(1, 37).toUpperCase(),
          tags: val.fields.tags,
        }))
    );
};

export const fetchDocxDownloadLinks = async (
  context: WebPartContext,
  path: string
): Promise<{ name: string; downloadLink: string; eTag: string }[]> => {
  const client = await context.msGraphClientFactory.getClient();
  const driveId = await getCurrentSiteRootDriveId(context);

  return await client
    .api(
      `drives/${driveId}/root${path === "" ? "" : `:/${path}:`}/children`
    )
    .get()
    .then((respond: { value: any[] }) => {
      return respond.value.filter(
        (item) =>
          item["@microsoft.graph.downloadUrl"] !== undefined &&
          item.name.match(/.*\.docx$/)
      );
    })
    .catch((msGraphError) => console.error("!!!!", msGraphError))
    .then(
      (
        items: {
          name: string;
          "@microsoft.graph.downloadUrl": string;
          eTag: string;
        }[]
      ) =>
        items.map((item) => ({
          name: item.name,
          downloadLink: item["@microsoft.graph.downloadUrl"],
          eTag: item.eTag.slice(2, 38).toUpperCase(),
        }))
    );
};

const fetchDownloadUrls = async (
  context: WebPartContext,
  driveId: string,
  path: string
): Promise<string[]> => {
  const client = await context.msGraphClientFactory.getClient();
  return client
    .api(
      `drives/${driveId}/root${
        path === "/" ? "/" : `:/sites/${path}:/`
      }/children/й.docx/content`
    )
    .get();
};
