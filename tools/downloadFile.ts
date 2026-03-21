import fs from "fs";

export const downloadFile = async (
  url: string,
  saveAt: string,
): Promise<Blob> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to download file: ${response.status} ${response.statusText}`,
      );
    }
    const blob = await response.blob();
    fs.writeFileSync(saveAt, Buffer.from(await blob.arrayBuffer()));
    console.log(`File downloaded and saved to ${saveAt}`);
    return blob;
  } catch (error: any) {
    console.error(`Error downloading file: ${error.message}`);
    throw error;
  }
};
