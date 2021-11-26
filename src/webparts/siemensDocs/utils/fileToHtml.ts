import mammoth from "mammoth";

const blobToHtml = (blob: Blob, callback) => {
  const reader = new FileReader();
  reader.onload = async (loadEvent) => {
    const arrayBuffer = loadEvent.target["result"];
    callback(await mammoth.convertToHtml({ arrayBuffer } as any));
  };
  reader.readAsArrayBuffer(blob);
};

export default blobToHtml;
