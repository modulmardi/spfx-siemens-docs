import { WebPartContext } from "@microsoft/sp-webpart-base";

export const getSiteRootDirectoryId = async (context: WebPartContext): Promise<string> => {
  const client = await context.msGraphClientFactory.getClient();
  const serverRelativeUrl = context.pageContext.site.serverRelativeUrl;
  return client.api(
    `/sites/root${serverRelativeUrl === "/" ? "/" : `:/sites/${serverRelativeUrl}:/`}/drive`
  ).get().then((msRespond: { id: string }) => msRespond.id);
};

export const saveFileOnDrive = async (
  context: WebPartContext,
  driveId: string,
  filePath: string,
  file: File
) => {
  const client = await context.msGraphClientFactory.getClient();
  await client
    .api(`drives/${driveId}/root:/${filePath}/${file.name}:/content`)
    .header("Content-Type", file.type)
    .put(file, (msError, msRespond) => {
      if (msError) {
        console.log(msError);
      }
    })
}

export const saveFileOnCurrentSite = async (
  context: WebPartContext,
  filePath: string,
  file: File
) => {
  const driveId = await getSiteRootDirectoryId(context)
  await saveFileOnDrive(context, driveId, filePath, file)
}