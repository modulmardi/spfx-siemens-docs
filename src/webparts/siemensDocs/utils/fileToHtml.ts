import mammoth from "mammoth";

const fileToHtml = (file: File, callback) => {
  const reader = new FileReader();
  reader.onload = async (loadEvent) => {
    const arrayBuffer = loadEvent.target["result"];
    callback(await mammoth.convertToHtml({ arrayBuffer } as any));
  };
  reader.readAsArrayBuffer(file);
};

export default fileToHtml;
