import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportAsPng(element: HTMLElement, filename: string = "storyboard.png") {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
  });
  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), "image/png")
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportAsPdf(element: HTMLElement, filename: string = "storyboard.pdf") {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
  });

  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  // Use A3 landscape for wide storyboard tables
  const pdf = new jsPDF({
    orientation: imgWidth > imgHeight ? "landscape" : "portrait",
    unit: "mm",
    format: "a3",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;
  const contentHeight = (imgHeight / imgWidth) * contentWidth;

  // If content fits in one page
  if (contentHeight <= pageHeight - margin * 2) {
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", margin, margin, contentWidth, contentHeight);
  } else {
    // Multi-page: slice the canvas
    const pagesNeeded = Math.ceil(contentHeight / (pageHeight - margin * 2));
    const sliceHeight = Math.floor(imgHeight / pagesNeeded);

    for (let i = 0; i < pagesNeeded; i++) {
      if (i > 0) pdf.addPage();

      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = imgWidth;
      sliceCanvas.height = sliceHeight;
      const ctx = sliceCanvas.getContext("2d")!;
      ctx.drawImage(canvas, 0, -i * sliceHeight);

      const sliceContentHeight = (sliceHeight / imgWidth) * contentWidth;
      pdf.addImage(
        sliceCanvas.toDataURL("image/png"),
        "PNG",
        margin,
        margin,
        contentWidth,
        sliceContentHeight
      );
    }
  }

  pdf.save(filename);
}
