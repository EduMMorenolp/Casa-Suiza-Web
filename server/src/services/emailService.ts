import transporter from '../config/email';

interface EmailData {
  to: string;
  eventTitle: string;
  quantity: number;
  total: number;
  paymentId: string;
}

export const sendPurchaseConfirmation = async (data: EmailData) => {
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
      <p>¡Nos vemos en el evento!</p>
    `
  };

  await transporter.sendMail(mailOptions);
};