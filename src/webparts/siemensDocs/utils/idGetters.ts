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

export const getSharedDocumentsId = async (
  context: WebPartContext
): Promise<string> => {
  const client = await context.msGraphClientFactory.getClient();
  return await client
    .api("sites/root/lists")
    .get()
    .then(
      (response: { value: { name: string; id: string }[] }) =>
        response.value.filter((val) => val.name === "Shared Documents")[0].id
    );
};
