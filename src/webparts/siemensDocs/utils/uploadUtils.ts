import { WebPartContext } from "@microsoft/sp-webpart-base";
import { getCurrentSiteRootDriveId, getSharedDocumentsId } from "./idGetters";

export const saveFileOnDrive = async (
  context: WebPartContext,
  driveId: string,
  filePath: string,
  file: File
) => {
  const client = await context.msGraphClientFactory.getClient();
  return await client
    .api(`drives/${driveId}/root:/${filePath}/${file.name}:/content`)
    .header("Content-Type", file.type)
    .put(file)
    .catch((msError) => console.log(msError))
    .then((respond: { eTag: string }) => respond);
};
export const changeTagsByETag = async (
  context: WebPartContext,
  eTag: string,
  tagsString: string
) => {
  const client = await context.msGraphClientFactory.getClient();
  const listId = await getSharedDocumentsId(context);

  const lol = await client
    .api(`sites/root/lists/${listId}/items?$expand=fields`)
    .get()
    .catch((msError) => console.log(msError))
    .then((respond: { value: { id: string; eTag: string }[] }) => {
      console.log(listId);
      console.log(respond);
      console.log(
        "\n\n\n\n\n\n\n\n\n_______________________\n",
        respond.value.filter((item) => {
          console.log(item.eTag, eTag);
          return item.eTag.slice(1, 37).toUpperCase() === eTag;
        })[0]?.id
      );

      return respond.value.filter(
        (item) => item.eTag.slice(1, 37).toUpperCase() === eTag
      )[0]?.id;
    })
    .then(async (id) => {
      return await changeTagsById(context, id, tagsString);
    });
};
export const changeTagsById = async (
  context: WebPartContext,
  id: string,
  tagsString: string
) => {
  const client = await context.msGraphClientFactory.getClient();
  const listId = await getSharedDocumentsId(context);

  return await client
    .api(`sites/root/lists/${listId}/items/${id}/fields`)
    .update({ tags: tagsString })
    .catch((msError) => console.log(msError))
    .then((msRespond) => console.log(msRespond));
};
export const saveFileOnCurrentSite = async (
  context: WebPartContext,
  filePath: string,
  file: File,
  tagsString: string
) => {
  const driveId = await getCurrentSiteRootDriveId(context);
  const eTag = (
    await saveFileOnDrive(context, driveId, filePath, file)
  ).eTag.slice(2, 38);
  const lol = changeTagsByETag(context, eTag, tagsString);
};
