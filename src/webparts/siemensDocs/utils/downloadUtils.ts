import { WebPartContext } from '@microsoft/sp-webpart-base';
import { getCurrentSiteRootDriveId } from './getCurrentSiteRootDriveId';

export const fetchDocxFiles = async (context: WebPartContext, path: string): Promise<{ name: string, file: Blob }[]> => {

    const client = await context.msGraphClientFactory.getClient();
    const driveId = await getCurrentSiteRootDriveId(context);

    const filesMetas = await client
        .api(`drives/${driveId}/root${path === "" ? "" : `:/sites/${path}:`}/children`)
        .get().then((respond: { value: any[] }) => {
            return respond.value
                .filter(item => item["@microsoft.graph.downloadUrl"] !== undefined)
        })
        .catch((msGraphError) => console.error("!!!!", msGraphError))
        .then((item: { name: string, "@microsoft.graph.downloadUrl": string }[]) => item)
    const files = Promise.all(filesMetas.filter(fileMeta => fileMeta.name.match(/.*.docx/)).map(
        async fileMeta => {
            const file = await (await fetch(`${fileMeta['@microsoft.graph.downloadUrl']}`)).blob();
            console.log({ name: fileMeta.name, file: file });

            return { name: fileMeta.name, file: file }
        }
    ))
    console.log("lol", files);
    return files

}

const fetchDownloadUrls = async (context: WebPartContext, driveId: string, path: string): Promise<string[]> => {
    const client = await context.msGraphClientFactory.getClient();
    return client.api(`drives/${driveId}/root${path === "/" ? "/" : `:/sites/${path}:/`}/children/й.docx/content`).get()
}