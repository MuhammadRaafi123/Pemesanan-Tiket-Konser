import QRCode from "qrcode";

export const generateQRCode = async (data) => {
  try {
    const qrCode = await QRCode.toDataURL(
      JSON.stringify(data)
    );

    return qrCode;
  } catch (error) {
    throw new Error(
      "Gagal membuat QR Code"
    );
  }
};