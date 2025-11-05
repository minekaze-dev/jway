import React from 'react';

interface ModalProps {
    onClose: () => void;
}

const TermsModal: React.FC<ModalProps> = ({ onClose }) => {
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
                    <h2 className="text-2xl font-bold text-gray-100">Syarat & Ketentuan</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div className="px-6 py-4 flex-grow max-h-[70vh] overflow-y-auto text-gray-300 space-y-4 text-sm">
                    <p>Selamat datang di JaboWay! Dengan mengakses, mendaftar, atau menggunakan platform kami, Anda setuju untuk terikat oleh Syarat dan Ketentuan ini. Harap baca dengan seksama.</p>

                    <h3 className="text-lg font-semibold text-gray-100 pt-2">1. Pendaftaran dan Keamanan Akun</h3>
                    <ul className="list-disc list-outside ml-6 space-y-1">
                        <li>Anda dapat mendaftar menggunakan email dan password, atau melalui penyedia pihak ketiga seperti Google.</li>
                        <li>Anda bertanggung jawab untuk menjaga kerahasiaan informasi akun Anda, termasuk password.</li>
                        <li>Anda setuju untuk segera memberitahu kami jika ada penggunaan akun Anda yang tidak sah.</li>
                        <li>Semua aktivitas yang terjadi di bawah akun Anda adalah tanggung jawab Anda.</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-gray-100 pt-2">2. Perilaku Pengguna</h3>
                    <p>Anda setuju untuk tidak menggunakan platform ini untuk tujuan yang melanggar hukum atau dilarang oleh ketentuan ini. Anda bertanggung jawab penuh atas semua konten yang Anda posting di bawah akun Anda. Perilaku yang dilarang meliputi, namun tidak terbatas pada:</p>
                    <ul className="list-disc list-outside ml-6 space-y-1">
                        <li>Mengunggah atau membagikan konten yang bersifat ilegal, cabul, memfitnah, mengancam, melecehkan, atau mengandung unsur kebencian (SARA).</li>
                        <li>Menyebarkan informasi yang salah atau menyesatkan (hoax).</li>
                        <li>Melanggar hak kekayaan intelektual orang lain.</li>
                        <li>Melakukan spamming atau mengunggah iklan yang tidak sah.</li>
                        <li>Meniru identitas orang atau entitas lain.</li>
                    </ul>
                    
                    <h3 className="text-lg font-semibold text-gray-100 pt-2">3. Konten Buatan Pengguna</h3>
                    <p>Anda mempertahankan kepemilikan atas konten yang Anda buat. Namun, dengan memposting konten di JaboWay, Anda memberikan kami lisensi non-eksklusif, bebas royalti, berlaku di seluruh dunia untuk menggunakan, mereproduksi, memodifikasi, dan menampilkan konten tersebut sehubungan dengan layanan kami. Konten Anda akan dikaitkan dengan nama tampilan (display name) akun Anda.</p>
                    
                    <h3 className="text-lg font-semibold text-gray-100 pt-2">4. Moderasi dan Pelaporan</h3>
                    <p>Kami berhak, tetapi tidak berkewajiban, untuk memantau, menyaring, atau menghapus konten yang kami anggap melanggar Syarat & Ketentuan ini atau merugikan komunitas. Kami mengandalkan laporan dari pengguna untuk membantu menjaga lingkungan yang aman dan positif. Konten yang menerima banyak laporan dapat dihapus secara otomatis atau ditinjau oleh admin.</p>
                    
                    <h3 className="text-lg font-semibold text-gray-100 pt-2">5. Sangkalan (Disclaimer)</h3>
                    <p>Konten di platform ini, terutama yang berasal dari kontribusi pengguna, disediakan "sebagaimana adanya". Kami tidak menjamin keakuratan, kelengkapan, atau kegunaan informasi apa pun. Anda setuju bahwa Anda harus mengevaluasi, dan menanggung semua risiko yang terkait dengan, penggunaan konten apa pun.</p>

                    <h3 className="text-lg font-semibold text-gray-100 pt-2">6. Perubahan Ketentuan</h3>
                    <p>Kami dapat merevisi Syarat & Ketentuan ini dari waktu ke waktu. Versi terbaru akan selalu tersedia di platform kami. Dengan terus menggunakan layanan setelah perubahan tersebut berlaku, Anda setuju untuk terikat oleh syarat yang direvisi.</p>
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

export default TermsModal;