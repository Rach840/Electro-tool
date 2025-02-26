
import { pdf } from "@react-pdf/renderer";

export default async function handleDownload(CreateDocument) {
    let url = "";
    try {
      const blob = await pdf(<CreateDocument  />).toBlob();
      url = URL.createObjectURL(blob);

      const response = await fetch(url);
      const blobData = await response.blob();
      const blobUrl = window.URL.createObjectURL(blobData);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `Продукт-${Date.now()}.pdf`;
      link.click();

    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      if (url) URL.revokeObjectURL(url);
    }
	}