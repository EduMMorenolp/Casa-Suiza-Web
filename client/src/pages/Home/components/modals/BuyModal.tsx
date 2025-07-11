import { useState } from "react";
import { createTicket } from "../../../../api/tickets";
import type { TicketData } from "../../../../api/tickets";

interface TicketType {
    name: string;
    description: string;
    price: number;
    quantity: number;
}

interface BuyModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventId: string;
    eventName: string;
    ticketTypes: TicketType[];
}

export default function BuyModal({
    isOpen,
    onClose,
    eventId,
    eventName,
    ticketTypes,
}: BuyModalProps) {
    const [buyerName, setBuyerName] = useState("");
    const [buyerLastName, setBuyerLastName] = useState("");
    const [buyerEmail, setBuyerEmail] = useState("");
    const [buyerPhone, setBuyerPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleBuy = async () => {
        setLoading(true);
        setErrorMsg(null);
        setSuccessMsg(null);

        try {
            if (!buyerName || !buyerLastName || !buyerEmail) {
                setErrorMsg("Por favor completa los campos obligatorios");
                setLoading(false);
                return;
            }

            const ticket: TicketData = {
                eventId,
                buyerName,
                buyerLastName,
                buyerEmail,
                buyerPhone,
            };

            const created = await createTicket(ticket);
            setSuccessMsg(`Entrada comprada con éxito para ${created.buyerName}`);
        } catch (err) {
            setErrorMsg("No se pudo procesar la compra");
            console.log(err)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
                <h2 className="text-xl font-bold mb-4">
                    Compra de Entradas - {eventName}
                </h2>

                {/* Datos del comprador */}
                <div className="space-y-3 mb-4">
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        className="w-full border border-gray-300 px-3 py-2 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Apellido"
                        value={buyerLastName}
                        onChange={(e) => setBuyerLastName(e.target.value)}
                        className="w-full border border-gray-300 px-3 py-2 rounded"
                    />
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                        className="w-full border border-gray-300 px-3 py-2 rounded"
                    />
                    <input
                        type="tel"
                        placeholder="Teléfono (opcional)"
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        className="w-full border border-gray-300 px-3 py-2 rounded"
                    />
                </div>

                {/* Tabla de precios (solo visual) */}
                <table className="w-full text-left mb-4">
                    <thead>
                        <tr>
                            <th className="px-2 py-2">Tipo</th>
                            <th className="px-2 py-2">Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ticketTypes.map((ticket, index) => (
                            <tr key={index} className="border-t border-gray-200">
                                <td className="px-2 py-2">
                                    <strong>{ticket.name}</strong>
                                    <p className="text-sm text-gray-500">{ticket.description}</p>
                                </td>
                                <td className="px-2 py-2">${(ticket.price / 100).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Mensajes */}
                {errorMsg && (
                    <p className="text-red-600 text-sm font-semibold mb-2">{errorMsg}</p>
                )}
                {successMsg && (
                    <p className="text-green-600 text-sm font-semibold mb-2">
                        {successMsg}
                    </p>
                )}

                {/* Botones */}
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleBuy}
                        disabled={loading}
                        className={`px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition ${loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        {loading ? "Procesando..." : "Comprar"}
                    </button>
                </div>

                {/* Botón cerrar (X) */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                >
                    &times;
                </button>
            </div>
        </div>
    );
}
