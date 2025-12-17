import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow p-8">
                    <h1 className="text-2xl font-bold text-center mb-6">oceans restaurant</h1>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                placeholder="tu@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">contrasena</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                placeholder="********"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {loading ? 'cargando...' : 'iniciar sesion'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t">
                        <p className="text-xs text-gray-600 mb-2">credenciales de prueba:</p>
                        <div className="text-xs space-y-2">
                            <div className="bg-gray-50 p-2 rounded">
                                <p className="font-medium">admin@oceans.com</p>
                                <p className="text-gray-600">password123</p>
                            </div>
                            <div className="bg-gray-50 p-2 rounded">
                                <p className="font-medium">mesero@oceans.com</p>
                                <p className="text-gray-600">password123</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
