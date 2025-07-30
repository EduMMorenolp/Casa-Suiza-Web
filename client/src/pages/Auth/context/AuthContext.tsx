import { createContext, useContext, useState }
    from 'react';
import type { ReactNode } from 'react';
import { login as loginApi } from '../../../api/auth';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const response = await loginApi(username, password);

            if (response.status === 200) {
                // Guarda el token en localStorage o en una cookie
                localStorage.setItem('token', response.data.token);
                setIsAuthenticated(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            return false;
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        // Elimina el token de localStorage o de la cookie
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}