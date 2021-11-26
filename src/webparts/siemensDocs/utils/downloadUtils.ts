import { WebPartContext } from '@microsoft/sp-webpart-base';
import { getCurrentSiteRootDriveId } from './getCurrentSiteRootDriveId';

export const fetchDocxFiles = async (context: WebPartContext, path: string): Promise<File[]> => {
    const client = await context.msGraphClientFactory.getClient();
    const driveId = await getCurrentSiteRootDriveId(context);
    const filesMetas = await client
        .api(`drives/${driveId}/root${path === "/" ? "/" : `:/sites/${path}:/`}/children`)
        .get().then((respond: { value: { name: string, "@microsoft.graph.downloadUrl": string }[] }) => respond.value)

    const files = Promise.all(filesMetas.filter(fileMeta => fileMeta.name.match(/.*.docx/)).map(
        async filesMeta => await client
            .api(`drives/${driveId}/root${path === "/" ? "/" : `:/sites/${path}:/`}/children/${filesMeta.name}/content`)
            .get().then((file: File) => file))
    )
    console.log(files);
    return files

}

const fetchDownloadUrls = async (context: WebPartContext, driveId: string, path: string): Promise<string[]> => {
    const client = await context.msGraphClientFactory.getClient();
    return client.api(`drives/${driveId}/root${path === "/" ? "/" : `:/sites/${path}:/`}/children/й.docx/content`).get()
}