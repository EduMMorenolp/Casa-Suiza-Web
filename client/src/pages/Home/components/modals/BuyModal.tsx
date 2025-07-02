// Tipos
interface TicketType {
    name: string;
    description: string;
    price: number;
    quantity: number;
}

interface BuyModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventName: string;
    ticketTypes: TicketType[];
}

export default function BuyModal({ isOpen, onClose, eventName, ticketTypes }: BuyModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
                <h2 className="text-xl font-bold mb-4">Compra de Entradas - {eventName}</h2>

                {/* Tabla de tickets */}
                <table className="w-full text-left">
                    <thead>
                        <tr>
                            <th className="px-2 py-2">Tipo</th>
                            <th className="px-2 py-2">Valor</th>
                            <th className="px-2 py-2">Cantidad</th>
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
                                <td className="px-2 py-2">
                                    <input
                                        type="number"
                                        min="0"
                                        value={ticket.quantity}
                                        onChange={(e) => {
                                            const newQuantity = parseInt(e.target.value, 10);
                                            ticket.quantity = isNaN(newQuantity) ? 0 : newQuantity;
                                        }}
                                        className="border border-gray-300 px-2 py-1 rounded w-16"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Botón de compra */}
                <div className="mt-6 flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    >
                        Comprar
                    </button>
                </div>

                {/* Botón de cerrar (X) */}
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