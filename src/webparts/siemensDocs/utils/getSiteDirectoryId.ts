import { WebPartContext } from "@microsoft/sp-webpart-base";

const getSiteDirectoryId = async (context: WebPartContext) => {
  const client = await context.msGraphClientFactory.getClient();
  const serverRelativeUrl = context.pageContext.site.serverRelativeUrl;
  client.api(
    `/sites/root${serverRelativeUrl === "/" ? "/" : `:${serverRelativeUrl}/:`}`
  );
};
