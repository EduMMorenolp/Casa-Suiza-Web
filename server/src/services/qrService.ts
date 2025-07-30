import QRCode from 'qrcode';

export const generateQRCode = async (paymentId: string): Promise<string> => {
  try {
    const qrDataURL = await QRCode.toDataURL(paymentId);
    return qrDataURL;
  } catch (error) {
    console.error('Error generando QR:', error);
    throw error;
  }
};