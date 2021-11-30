import { WebPartContext } from "@microsoft/sp-webpart-base";

export const getCurrentSiteRootDriveId = async (
  context: WebPartContext
): Promise<string> => {
  const client = await context.msGraphClientFactory.getClient();
  const serverRelativeUrl = context.pageContext.site.serverRelativeUrl;
  return client
    .api(
      `/sites/root${
        serverRelativeUrl === "/" ? "/" : `:/sites/${serverRelativeUrl}:/`
      }/drive`
    )
    .get()
    .then((msRespond: { id: string }) => msRespond.id);
};
