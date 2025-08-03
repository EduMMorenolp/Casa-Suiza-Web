import QRCode from 'qrcode';

export const generateQRCode = async (paymentId: string): Promise<string> => {
  try {
    const qrDataURL = await QRCode.toDataURL(paymentId);
    return qrDataURL;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error generando QR:', error);
    }
    throw error;
  }
};