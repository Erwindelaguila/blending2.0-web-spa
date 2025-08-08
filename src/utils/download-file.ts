export const downloadFileExcel = (fileUrl: string | undefined) => {
  const downloadUrl = fileUrl;
  if (!downloadUrl) return;

  const link = document.createElement("a");
  link.href = downloadUrl;
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
