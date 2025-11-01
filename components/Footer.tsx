import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 border-t border-gray-700 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-sm text-gray-400 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-center sm:text-left">© {new Date().getFullYear()} Jabodetabek Way. All rights reserved.</div>
                <div className="font-medium text-center order-first sm:order-none">Build with ❤️ for Perantau</div>
                <div className="flex gap-4 sm:gap-6">
                   <a href="#" className="hover:text-white hover:underline transition-colors">Terms & Conditions</a>
                   <a href="#" className="hover:text-white hover:underline transition-colors">Privacy Policy</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;