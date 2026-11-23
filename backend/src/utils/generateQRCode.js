import QRCode from "qrcode";

export const generateQRCode = async (data) => {
  try {
    const qrCode = await QRCode.toDataURL(
      typeof data === "string" ? data : JSON.stringify(data),
      {
        errorCorrectionLevel: "M",
        margin: 4,
        width: 512,
        type: "image/png",
      }
    );

    return qrCode;
  } catch (error) {
    throw new Error(
      "Gagal membuat QR Code"
    );
  }
};
