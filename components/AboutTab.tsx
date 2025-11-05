import React from 'react';

const AboutTab: React.FC = () => {
    return (
        <section className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg border border-gray-700 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-100 text-center">Tentang JABOWAY</h2>
            <p className="mt-4 text-center text-gray-400">
                JABOWAY adalah sebuah inisiatif berbasis komunitas yang bertujuan untuk membantu para perantau baru (dan juga penduduk lama) dalam menavigasi kompleksitas kehidupan di area metropolitan Jakarta, Bogor, Depok, Tangerang, dan Bekasi.
            </p>
            
            <div className="mt-8 border-t border-gray-700 pt-8">
                <h3 className="text-2xl font-bold text-gray-100 text-center">Dukung Kami</h3>
                <p className="mt-3 text-center text-gray-400">
                    Platform ini dikelola dan dikembangkan secara sukarela. Jika Anda merasa terbantu dan ingin mendukung keberlangsungan JABOWAY, Anda bisa memberikan donasi melalui tautan di bawah ini. Setiap dukungan Anda sangat berarti!
                </p>
                <div className="mt-6 text-center">
                    <a 
                        href="https://saweria.co/minekaze" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-block px-8 py-3 bg-emerald-600 text-white font-semibold rounded-md shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-transform hover:scale-105"
                    >
                        Donasi via Saweria
                    </a>
                </div>
            </div>
        </section>
    );
};

export default AboutTab;