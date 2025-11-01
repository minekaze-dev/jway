import React, { useState } from 'react';

interface AdminLoginModalProps {
    onClose: () => void;
    onLogin: (password: string) => boolean;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const success = onLogin(password);
        if (!success) {
            setError('Kode akses salah. Silakan coba lagi.');
            setPassword('');
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 w-full max-w-sm rounded-xl shadow-2xl border border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit} className="overflow-hidden rounded-xl">
                    <div className="p-6">
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold text-gray-100">Login Admin</h3>
                            <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                    </div>
                    <div className="px-6 pb-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Kode Akses</label>
                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                                autoFocus
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-100 placeholder-gray-400" 
                            />
                        </div>
                        {error && <p className="text-sm text-red-400">{error}</p>}
                    </div>
                    <div className="px-6 py-4 bg-gray-900/50 border-t border-gray-700 flex justify-end">
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Masuk
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginModal;