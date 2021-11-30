import { WebPartContext } from "@microsoft/sp-webpart-base";
import { getCurrentSiteRootDriveId } from "./getCurrentSiteRootDriveId";

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
    });
};

export const saveFileOnCurrentSite = async (
  context: WebPartContext,
  filePath: string,
  file: File
) => {
  const driveId = await getCurrentSiteRootDriveId(context);
  await saveFileOnDrive(context, driveId, filePath, file);
};
