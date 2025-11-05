import React from 'react';

interface ModalProps {
    onClose: () => void;
}

const PrivacyModal: React.FC<ModalProps> = ({ onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 w-full max-w-3xl rounded-xl shadow-2xl flex flex-col transform transition-all border border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-100">Kebijakan Privasi</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div className="px-6 py-4 flex-grow max-h-[70vh] overflow-y-auto text-gray-300 space-y-4 text-sm">
                    <p>Privasi Anda penting bagi kami. Kebijakan Privasi ini menjelaskan bagaimana JaboWay mengumpulkan, menggunakan, dan melindungi informasi Anda saat Anda menggunakan platform kami.</p>
                    
                    <h3 className="text-lg font-semibold text-gray-100 pt-2">1. Informasi yang Kami Kumpulkan</h3>
                    <p>Kami mengumpulkan berbagai jenis informasi tergantung pada bagaimana Anda berinteraksi dengan layanan kami:</p>
                    <ul className="list-disc list-outside ml-6 space-y-2">
                        <li>
                            <strong>Informasi Akun:</strong> Saat Anda mendaftar melalui email atau Google, kami mengumpulkan informasi yang diperlukan untuk membuat akun Anda, seperti:
                            <ul className="list-circle list-outside ml-6 mt-1">
                                <li>Nama lengkap atau nama tampilan (display name).</li>
                                <li>Alamat email.</li>
                                <li>ID pengguna unik yang dibuat oleh sistem kami.</li>
                                <li>Password Anda disimpan dalam bentuk hash dan tidak dapat kami lihat.</li>
                            </ul>
                        </li>
                        <li><strong>Konten Buatan Pengguna:</strong> Kami mengumpulkan konten yang Anda kirimkan, seperti panduan atau postingan forum. Konten ini akan dikaitkan dengan akun Anda dan ditampilkan secara publik dengan nama tampilan Anda.</li>
                        <li><strong>Informasi Interaksi Tamu (Guest):</strong> Jika Anda tidak login, beberapa interaksi seperti voting atau pelaporan akan dikaitkan dengan ID anonim yang disimpan di perangkat Anda (local storage) untuk mencegah duplikasi. Kami tidak mengumpulkan informasi pribadi dari tamu.</li>
                        <li><strong>Data Penggunaan:</strong> Kami dapat mengumpulkan informasi non-pribadi tentang bagaimana Anda berinteraksi dengan layanan kami (misalnya, panduan yang paling banyak dilihat) untuk tujuan analisis dan peningkatan platform.</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-gray-100 pt-2">2. Penggunaan Informasi</h3>
                    <p>Informasi yang kami kumpulkan digunakan untuk:</p>
                    <ul className="list-disc list-outside ml-6 space-y-1">
                        <li>Menyediakan, mengoperasikan, dan memelihara layanan kami.</li>
                        <li>Mengautentikasi pengguna dan mengelola akun.</li>
                        <li>Menampilkan konten kontribusi Anda dan mengaitkannya dengan profil publik Anda (nama tampilan).</li>
                        <li>Mengirimkan komunikasi terkait akun, seperti verifikasi email atau reset password.</li>
                        <li>Memahami dan menganalisis penggunaan layanan untuk perbaikan.</li>
                        <li>Melakukan moderasi konten dan menegakkan Syarat & Ketentuan kami.</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-gray-100 pt-2">3. Pembagian Informasi</h3>
                    <p>Kami sangat menjaga privasi Anda. Alamat email Anda tidak akan pernah ditampilkan secara publik atau dibagikan kepada pihak ketiga untuk tujuan pemasaran.</p>
                     <ul className="list-disc list-outside ml-6 space-y-1">
                        <li>Kami menggunakan Supabase sebagai penyedia layanan backend dan otentikasi. Saat Anda mendaftar, informasi Anda dikelola sesuai dengan kebijakan privasi mereka.</li>
                        <li>Nama tampilan (display name) dan konten yang Anda buat bersifat publik dan dapat dilihat oleh pengguna lain.</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-gray-100 pt-2">4. Keamanan Data</h3>
                    <p>Kami mengambil langkah-langkah yang wajar untuk melindungi informasi Anda. Ini termasuk penggunaan hashing untuk password dan praktik keamanan standar lainnya. Namun, tidak ada sistem yang 100% aman, dan kami tidak dapat menjamin keamanan mutlak data Anda.</p>
                    
                    <h3 className="text-lg font-semibold text-gray-100 pt-2">5. Hak Anda</h3>
                    <p>Anda memiliki kendali atas informasi pribadi Anda. Anda dapat memperbarui nama tampilan Anda dan mengelola konten yang telah Anda buat. Jika Anda ingin menghapus akun Anda, silakan hubungi kami.</p>

                    <h3 className="text-lg font-semibold text-gray-100 pt-2">6. Perubahan Kebijakan</h3>
                    <p>Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Kami akan memberitahu Anda tentang perubahan apa pun dengan memposting kebijakan baru di halaman ini. Anda disarankan untuk meninjau Kebijakan Privasi ini secara berkala.</p>

                </div>
                 <div className="px-6 py-4 bg-gray-900/50 border-t border-gray-700 flex justify-end">
                     <button onClick={onClose} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrivacyModal;