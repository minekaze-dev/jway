import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 border-t border-gray-700 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-sm text-gray-400 flex flex-col sm:flex-row justify-between items-center gap-2">
                <div>© {new Date().getFullYear()} Jabodetabek Way. All rights reserved.</div>
                <div className="font-medium">Build with ❤️ for Perantau</div>
            </div>
        </footer>
    );
};

export default Footer;