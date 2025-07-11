// src/api/payments.ts
import { api } from "./apiClient";

interface PreferenceData {
  ticketId: string;
  buyerName: string;
  buyerLastName: string;
  buyerEmail: string;
  buyerPhone?: string;
  eventTitle: string;
  price: number;
}

export async function createPaymentPreference(
  data: PreferenceData
): Promise<{ preferenceId: string; initPoint: string }> {
  const res = await api.post("/payment/preference", data);
  return res.data;
}
