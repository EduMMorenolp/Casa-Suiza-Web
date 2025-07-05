import Sidebar from './components/Sidebar';
import AddEventForm from './components/AddEventForm';

export default function Admin() {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Barra lateral */}
            <Sidebar />

            {/* Contenido principal */}
            <main className="flex-1 p-6">
                <h1 className="text-3xl font-bold mb-6">Dashboard Administrador</h1>
                <p className="mb-6">Aquí puedes gestionar los eventos:</p>

                {/* Formulario para agregar evento */}
                <AddEventForm />
            </main>
        </div>
    );
}