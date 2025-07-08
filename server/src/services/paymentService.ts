import mercadopago from "../config/mercadoPago";

interface PaymentPreferenceItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
}

interface PaymentPreferenceData {
  items: PaymentPreferenceItem[];
  payer: {
    name: string;
    surname: string;
    email: string;
    phone?: {
      area_code: string;
      number: string;
    };
  };
  back_urls: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return: "approved" | "all" | "none";
  notification_url: string;
}

interface MockPreferenceResponse {
  id: string;
  status: string; // Para que puedas cambiarlo
  init_point: string;
  items: PaymentPreferenceData["items"];
  payer: PaymentPreferenceData["payer"];
  [key: string]: any; // Otros campos opcionales
}

export async function createPreference(
  data: PaymentPreferenceData,
  mockStatus = "pending"
): Promise<MockPreferenceResponse> {
  //   try {
  //     const response = await mercadopago.preferences.create(data);
  //     return response.body;
  //   } catch (error) {
  //     throw new Error("Error creando preferencia de pago");
  //   }

  return {
    id: "MOCK_ID_123456",
    status: mockStatus, // "pending", "approved", "cancelled", etc.
    init_point:
      "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=MOCK_ID_123456",
    items: data.items,
    payer: data.payer,
    back_urls: data.back_urls,
    notification_url: data.notification_url,
  };
}
