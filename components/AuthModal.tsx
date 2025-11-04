
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { GoogleIcon, EnvelopeIcon, LockClosedIcon, UserCircleIcon } from './icons';

type ViewType = 'login' | 'register' | 'forgot_password' | 'message';

interface AuthModalProps {
    onClose: () => void;
    onGoogleLogin: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onGoogleLogin }) => {
    const [view, setView] = useState<ViewType>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            if (view === 'login') {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                onClose();
            } else if (view === 'register') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { 
                        data: { full_name: displayName || email.split('@')[0] },
                        emailRedirectTo: window.location.origin
                    }
                });
                if (error) throw error;
                setMessage('Pendaftaran berhasil! Silakan cek email Anda untuk link konfirmasi sebelum masuk.');
                setView('message');
            } else if (view === 'forgot_password') {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.origin,
                });
                if (error) throw error;
                setMessage('Email reset password telah dikirim. Silakan cek inbox Anda.');
                setView('message');
            }
        } catch (err: any) {
            if (err.message === 'Invalid login credentials') {
                setError('Email atau password yang Anda masukkan salah.');
            } else if (err.message === 'User already registered') {
                setError('Email ini sudah terdaftar. Silakan coba masuk.');
            } else if (err.message === 'Email not confirmed') {
                 setError('Email belum dikonfirmasi. Silakan periksa kotak masuk Anda dan klik link verifikasi.');
            }
            else {
                setError(err.error_description || err.message);
            }
        } finally {
            setLoading(false);
        }
    };
    
    const resetForm = () => {
        setEmail('');
        setPassword('');
        setDisplayName('');
        setError('');
        setMessage('');
        setLoading(false);
    }

    const switchView = (newView: ViewType) => {
        resetForm();
        setView(newView);
    }

    const renderContent = () => {
        if (view === 'message') {
            return (
                 <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                         <h3 className="text-xl font-bold text-gray-100">Cek Email Anda</h3>
                         <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                    <div className="text-center py-4">
                        <p className="text-gray-200">{message}</p>
                        <button onClick={() => switchView('login')} className="mt-6 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
                            Kembali ke Login
                        </button>
                    </div>
                </div>
            )
        }
        
        const isLogin = view === 'login';
        const isRegister = view === 'register';
        const isForgotPassword = view === 'forgot_password';
        
        return (
             <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-100">
                        {isLogin && 'Masuk ke Akun Anda'}
                        {isRegister && 'Buat Akun Baru'}
                        {isForgotPassword && 'Lupa Password'}
                    </h3>
                     <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                    {isRegister && (
                        <div className="relative">
                            <UserCircleIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" placeholder="Nama Lengkap" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder:text-gray-400" />
                        </div>
                    )}
                    
                    <div className="relative">
                        <EnvelopeIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder:text-gray-400" />
                    </div>
                    
                    {!isForgotPassword && (
                        <div className="relative">
                             <LockClosedIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="password" placeholder={isRegister ? "Password (minimal 6 karakter)" : "Password"} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder:text-gray-400" />
                        </div>
                    )}

                    {error && <p className="text-sm text-red-400">{error}</p>}
                    {message && <p className="text-sm text-green-400">{message}</p>}

                    <button type="submit" disabled={loading} className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50">
                        {loading ? 'Memproses...' : (isLogin ? 'Masuk' : isRegister ? 'Daftar' : 'Kirim Instruksi')}
                    </button>
                    
                    <div className="text-sm text-center">
                        {isLogin && (
                             <button type="button" onClick={() => switchView('forgot_password')} className="text-blue-400 hover:underline">Lupa password?</button>
                        )}
                    </div>
                </form>

                 {!isForgotPassword && (
                    <>
                        <div className="relative flex py-4 items-center">
                            <div className="flex-grow border-t border-gray-600"></div>
                            <span className="flex-shrink mx-4 text-gray-400 text-sm">atau</span>
                            <div className="flex-grow border-t border-gray-600"></div>
                        </div>

                        <button onClick={onGoogleLogin} disabled={loading} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 text-white font-semibold rounded-md shadow-sm hover:bg-gray-600 transition-colors">
                            <GoogleIcon className="h-5 w-5" />
                            <span>Masuk dengan Google</span>
                        </button>
                    </>
                )}

                 <div className="mt-4 text-sm text-center text-gray-400">
                    {isLogin && (
                        <p>Belum punya akun? <button onClick={() => switchView('register')} className="font-medium text-blue-400 hover:underline">Daftar</button></p>
                    )}
                    {isRegister && (
                         <p>Sudah punya akun? <button onClick={() => switchView('login')} className="font-medium text-blue-400 hover:underline">Masuk</button></p>
                    )}
                    {isForgotPassword && (
                         <p>Ingat password? <button onClick={() => switchView('login')} className="font-medium text-blue-400 hover:underline">Kembali ke Login</button></p>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 w-full max-w-sm rounded-xl shadow-2xl border border-gray-700 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
               {renderContent()}
            </div>
        </div>
    );
};

export default AuthModal;
