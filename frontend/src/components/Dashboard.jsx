import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('products');
    const { user, logout } = useAuth();

    const handleLogout = () => {
        if (window.confirm('cerrar sesion?')) {
            logout();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold">oceans restaurant</h1>
                        <p className="text-sm text-gray-600">{user?.nombre} - {user?.rol}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        salir
                    </button>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="bg-white rounded shadow mb-6">
                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`px-6 py-3 font-medium ${activeTab === 'products'
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-gray-600'
                                }`}
                        >
                            productos
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`px-6 py-3 font-medium ${activeTab === 'orders'
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-gray-600'
                                }`}
                        >
                            crear orden
                        </button>
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`px-6 py-3 font-medium ${activeTab === 'dashboard'
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-gray-600'
                                }`}
                        >
                            ordenes
                        </button>
                    </div>
                </div>

                <div>
                    {activeTab === 'products' && <ProductForm />}
                    {activeTab === 'orders' && <OrderForm />}
                    {activeTab === 'dashboard' && <OrderDashboard />}
                </div>
            </div>
        </div>
    );
}

function ProductForm() {
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editNombre, setEditNombre] = useState('');
    const [editPrecio, setEditPrecio] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!nombre.trim()) {
            setError('nombre es requerido');
            return;
        }

        if (!precio || parseFloat(precio) <= 0) {
            setError('precio debe ser mayor a cero');
            return;
        }

        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
            const response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: nombre.trim(), precio: parseFloat(precio) })
            });

            const data = await response.json();

            if (data.ok) {
                setNombre('');
                setPrecio('');
                setSuccess('producto creado');
                // Refresh search if there's a search term
                if (searchTerm) {
                    handleSearch();
                }
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('error al crear producto');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            setHasSearched(false);
            return;
        }

        setSearching(true);
        setHasSearched(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
            const response = await fetch(`${API_URL}/products/search?nombre=${encodeURIComponent(searchTerm.trim())}`);
            const data = await response.json();

            if (data.ok) {
                setSearchResults(data.data);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('error al buscar productos');
        } finally {
            setSearching(false);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setEditNombre(product.nombre);
        setEditPrecio(product.precio.toString());
        setError('');
        setSuccess('');
    };

    const handleUpdate = async () => {
        setError('');
        setSuccess('');

        if (!editNombre.trim()) {
            setError('nombre es requerido');
            return;
        }

        if (!editPrecio || parseFloat(editPrecio) <= 0) {
            setError('precio debe ser mayor a cero');
            return;
        }

        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
            const response = await fetch(`${API_URL}/products/${editingProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: editNombre.trim(),
                    precio: parseFloat(editPrecio)
                })
            });

            const data = await response.json();

            if (data.ok) {
                setSuccess('producto actualizado');
                setEditingProduct(null);
                // Refresh search results
                if (searchTerm) {
                    handleSearch();
                }
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('error al actualizar producto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Search Section */}
            <div className="bg-white rounded shadow p-6">
                <h2 className="text-xl font-bold mb-4">buscar productos</h2>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="flex-1 px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                        placeholder="buscar por nombre..."
                    />
                    <button
                        onClick={handleSearch}
                        disabled={searching}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {searching ? 'buscando...' : 'buscar'}
                    </button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                    <div className="mt-4">
                        <h3 className="font-medium mb-2">resultados ({searchResults.length})</h3>
                        <div className="space-y-2">
                            {searchResults.map(product => (
                                <div key={product.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
                                    <div>
                                        <p className="font-medium">{product.nombre}</p>
                                        <p className="text-sm text-gray-600">ID: {product.id}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <p className="text-lg font-bold text-green-600">${product.precio.toFixed(2)}</p>
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
                                        >
                                            editar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {hasSearched && searchResults.length === 0 && !searching && (
                    <div className="mt-4 p-3 bg-gray-100 text-gray-600 rounded text-center">
                        no se encontraron productos
                    </div>
                )}
            </div>

            {/* Create Product Form */}
            <div className="bg-white rounded shadow p-6">
                <h2 className="text-xl font-bold mb-4">crear producto</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">nombre</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                            placeholder="aguacate"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">precio</label>
                        <input
                            type="number"
                            step="0.01"
                            value={precio}
                            onChange={(e) => setPrecio(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                            placeholder="$4.000 COP"
                        />
                    </div>

                    {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>}
                    {success && <div className="p-3 bg-green-100 text-green-700 rounded">{success}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? 'creando...' : 'crear producto'}
                    </button>
                </form>
            </div>

            {/* Edit Product Modal */}
            {editingProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">editar producto</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">nombre</label>
                                <input
                                    type="text"
                                    value={editNombre}
                                    onChange={(e) => setEditNombre(e.target.value)}
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">precio</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editPrecio}
                                    onChange={(e) => setEditPrecio(e.target.value)}
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>}
                            {success && <div className="p-3 bg-green-100 text-green-700 rounded">{success}</div>}

                            <div className="flex gap-2">
                                <button
                                    onClick={handleUpdate}
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                                >
                                    {loading ? 'guardando...' : 'guardar'}
                                </button>
                                <button
                                    onClick={() => setEditingProduct(null)}
                                    disabled={loading}
                                    className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 disabled:bg-gray-400"
                                >
                                    cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function OrderForm() {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
            const response = await fetch(`${API_URL}/products`);
            const data = await response.json();
            if (data.ok) setProducts(data.data);
        } catch (err) {
            setError('error al cargar productos');
        }
    };

    const handleProductToggle = (product) => {
        const exists = selectedProducts.find(p => p.id === product.id);
        if (exists) {
            setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
        } else {
            setSelectedProducts([...selectedProducts, { ...product, cantidad: 1 }]);
        }
    };

    const handleQuantityChange = (productId, cantidad) => {
        setSelectedProducts(
            selectedProducts.map(p =>
                p.id === productId ? { ...p, cantidad: parseInt(cantidad) || 1 } : p
            )
        );
    };

    const calculateTotal = () => {
        return selectedProducts.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
    };

    const handleSubmit = async () => {
        setError('');
        setSuccess('');

        if (selectedProducts.length === 0) {
            setError('selecciona al menos un producto');
            return;
        }

        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productos: selectedProducts.map(p => ({ id: p.id, cantidad: p.cantidad }))
                })
            });

            const data = await response.json();

            if (data.ok) {
                setSelectedProducts([]);
                setSuccess('orden creada');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('error al crear orden');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-bold mb-4">crear orden</h2>

            <div className="mb-6">
                <h3 className="font-medium mb-2">productos disponibles</h3>
                {products.length === 0 ? (
                    <p className="text-gray-500">no hay productos</p>
                ) : (
                    <div className="space-y-2">
                        {products.map(product => (
                            <label key={product.id} className="flex items-center p-2 border rounded hover:bg-gray-50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedProducts.some(p => p.id === product.id)}
                                    onChange={() => handleProductToggle(product)}
                                    className="mr-3"
                                />
                                <span className="flex-1">{product.nombre}</span>
                                <span className="font-medium">${product.precio.toFixed(2)}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {selectedProducts.length > 0 && (
                <div className="mb-6">
                    <h3 className="font-medium mb-2">productos seleccionados</h3>
                    <div className="space-y-2">
                        {selectedProducts.map(product => (
                            <div key={product.id} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                                <span>{product.nombre}</span>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        min="1"
                                        value={product.cantidad}
                                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                        className="w-16 px-2 py-1 border rounded"
                                    />
                                    <span className="w-20 text-right">${(product.precio * product.cantidad).toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-between text-lg font-bold">
                        <span>total</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                </div>
            )}

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
            {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}

            <button
                onClick={handleSubmit}
                disabled={loading || selectedProducts.length === 0}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            >
                {loading ? 'creando...' : 'crear orden'}
            </button>
        </div>
    );
}

function OrderDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [editProducts, setEditProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadOrders();
        loadAllProducts();
    }, []);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
            const response = await fetch(`${API_URL}/orders`);
            const data = await response.json();
            if (data.ok) {
                setOrders(data.data);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('error al cargar ordenes');
        } finally {
            setLoading(false);
        }
    };

    const loadAllProducts = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
            const response = await fetch(`${API_URL}/products`);
            const data = await response.json();
            if (data.ok) {
                setAllProducts(data.data);
            }
        } catch (err) {
            console.error('error al cargar productos:', err);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        setSearching(true);
        setShowSearchResults(true);
        setError('');
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

            // Si el término de búsqueda es un número, buscar por ID
            const isNumeric = /^\d+$/.test(searchTerm.trim());

            if (isNumeric) {
                // Buscar por ID específico
                const response = await fetch(`${API_URL}/orders/${searchTerm.trim()}`);
                const data = await response.json();

                if (data.ok) {
                    setSearchResults([data.data]);
                } else {
                    setSearchResults([]);
                    setError('orden no encontrada');
                }
            } else {
                // Buscar por nombre de producto
                const response = await fetch(`${API_URL}/orders/search?productoNombre=${encodeURIComponent(searchTerm.trim())}`);
                const data = await response.json();

                if (data.ok) {
                    setSearchResults(data.data);
                } else {
                    setError(data.message);
                }
            }
        } catch (err) {
            setError('error al buscar ordenes');
            setSearchResults([]);
        } finally {
            setSearching(false);
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
        setSearchResults([]);
        setShowSearchResults(false);
    };

    const handleEditOrder = (order) => {
        setEditingOrder(order);
        setEditProducts(order.productos.map(p => ({ ...p })));
        setError('');
        setSuccess('');
    };

    const handleProductQuantityChange = (productId, cantidad) => {
        setEditProducts(
            editProducts.map(p =>
                p.id === productId ? { ...p, cantidad: parseInt(cantidad) || 1 } : p
            )
        );
    };

    const handleAddProductToOrder = (product) => {
        const exists = editProducts.find(p => p.id === product.id);
        if (!exists) {
            setEditProducts([...editProducts, { ...product, cantidad: 1 }]);
        }
    };

    const handleRemoveProductFromOrder = (productId) => {
        setEditProducts(editProducts.filter(p => p.id !== productId));
    };

    const calculateEditTotal = () => {
        return editProducts.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
    };

    const handleUpdateOrder = async () => {
        setError('');
        setSuccess('');

        if (editProducts.length === 0) {
            setError('la orden debe tener al menos un producto');
            return;
        }

        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
            const response = await fetch(`${API_URL}/orders/${editingOrder.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productos: editProducts.map(p => ({ id: p.id, cantidad: p.cantidad }))
                })
            });

            const data = await response.json();

            if (data.ok) {
                setSuccess('orden actualizada');
                setEditingOrder(null);
                // Refresh orders or search results
                if (showSearchResults) {
                    handleSearch();
                } else {
                    loadOrders();
                }
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('error al actualizar orden');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('es-ES');
    };

    if (loading) {
        return (
            <div className="bg-white rounded shadow p-6">
                <p className="text-center text-gray-500">cargando...</p>
            </div>
        );
    }

    const displayOrders = showSearchResults ? searchResults : orders;

    return (
        <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-bold mb-4">ordenes</h2>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="flex-1 px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                        placeholder="buscar por ID de orden o nombre de producto..."
                    />
                    <button
                        onClick={handleSearch}
                        disabled={searching}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {searching ? 'buscando...' : 'buscar'}
                    </button>
                    {showSearchResults && (
                        <button
                            onClick={clearSearch}
                            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                            ver todas
                        </button>
                    )}
                </div>
                {showSearchResults && (
                    <p className="mt-2 text-sm text-gray-600">
                        mostrando resultados de búsqueda ({searchResults.length})
                    </p>
                )}
            </div>

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

            {displayOrders.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                    {showSearchResults ? 'no se encontraron ordenes' : 'no hay ordenes'}
                </p>
            ) : (
                <div className="space-y-4">
                    {displayOrders.map(order => (
                        <div key={order.id} className="border rounded p-4">
                            <div className="flex justify-between mb-3">
                                <div>
                                    <h3 className="font-bold">orden #{order.id}</h3>
                                    <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">total</p>
                                    <p className="text-xl font-bold text-green-600">${order.total.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="border-t pt-3">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-sm font-medium">productos</p>
                                    <button
                                        onClick={() => handleEditOrder(order)}
                                        className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
                                    >
                                        editar
                                    </button>
                                </div>
                                <div className="space-y-1">
                                    {order.productos.map((producto, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span>{producto.nombre} x{producto.cantidad}</span>
                                            <span>${(producto.precio * producto.cantidad).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Order Modal */}
            {editingOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">editar orden #{editingOrder.id}</h2>

                        {/* Current Products */}
                        <div className="mb-6">
                            <h3 className="font-medium mb-2">productos en la orden</h3>
                            {editProducts.length === 0 ? (
                                <p className="text-gray-500 text-sm">no hay productos</p>
                            ) : (
                                <div className="space-y-2">
                                    {editProducts.map(product => (
                                        <div key={product.id} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                                            <span className="flex-1">{product.nombre}</span>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={product.cantidad}
                                                    onChange={(e) => handleProductQuantityChange(product.id, e.target.value)}
                                                    className="w-16 px-2 py-1 border rounded"
                                                />
                                                <span className="w-20 text-right">${(product.precio * product.cantidad).toFixed(2)}</span>
                                                <button
                                                    onClick={() => handleRemoveProductFromOrder(product.id)}
                                                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                                >
                                                    quitar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="mt-3 pt-3 border-t flex justify-between text-lg font-bold">
                                <span>total</span>
                                <span>${calculateEditTotal().toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Add Products */}
                        <div className="mb-6">
                            <h3 className="font-medium mb-2">agregar productos</h3>
                            <div className="max-h-40 overflow-y-auto space-y-1">
                                {allProducts.length === 0 ? (
                                    <p className="text-gray-500 text-sm p-2">cargando productos...</p>
                                ) : allProducts.filter(p => !editProducts.find(ep => ep.id === p.id)).length === 0 ? (
                                    <p className="text-gray-500 text-sm p-2">todos los productos ya están en la orden</p>
                                ) : (
                                    allProducts
                                        .filter(p => !editProducts.find(ep => ep.id === p.id))
                                        .map(product => (
                                            <div key={product.id} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                                                <span>{product.nombre}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-600">${product.precio.toFixed(2)}</span>
                                                    <button
                                                        onClick={() => handleAddProductToOrder(product)}
                                                        className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                                                    >
                                                        agregar
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                )}
                            </div>
                        </div>

                        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
                        {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}

                        <div className="flex gap-2">
                            <button
                                onClick={handleUpdateOrder}
                                disabled={loading}
                                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                            >
                                {loading ? 'guardando...' : 'guardar cambios'}
                            </button>
                            <button
                                onClick={() => setEditingOrder(null)}
                                disabled={loading}
                                className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 disabled:bg-gray-400"
                            >
                                cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
