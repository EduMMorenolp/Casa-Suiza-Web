import transporter from '../config/email';
import { generateQRCode } from './qrService';

interface EmailData {
  to: string;
  eventTitle: string;
  quantity: number;
  total: number;
  paymentId: string;
}

export const sendPurchaseConfirmation = async (data: EmailData) => {
  const qrCode = await generateQRCode(data.paymentId);
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: data.to,
    subject: `Confirmación de compra - ${data.eventTitle}`,
    html: `
      <h2>¡Compra confirmada!</h2>
      <p>Tu compra para <strong>${data.eventTitle}</strong> ha sido procesada exitosamente.</p>
      <p><strong>Detalles:</strong></p>
      <ul>
        <li>Cantidad de entradas: ${data.quantity}</li>
        <li>Total: $${data.total}</li>
        <li>ID de pago: ${data.paymentId}</li>
      </ul>
      <div style="text-align: center; margin: 20px 0;">
        <p><strong>Tu entrada digital:</strong></p>
        <img src="${qrCode}" alt="QR Code" style="max-width: 200px;" />
      </div>
      <p>¡Nos vemos en el evento!</p>
    `
  };

  await transporter.sendMail(mailOptions);
};