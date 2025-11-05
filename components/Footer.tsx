import React from 'react';

interface FooterProps {
    onOpenTerms: () => void;
    onOpenPrivacy: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenTerms, onOpenPrivacy }) => {
    return (
        <footer className="bg-gray-800 border-t border-gray-700 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-sm text-gray-400 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-center sm:text-left">© {new Date().getFullYear()} JaboWay. All rights reserved.</div>
                <div className="font-medium text-center order-first sm:order-none">Build with ❤️ for Perantau</div>
                <div className="flex gap-4 sm:gap-6">
                   <button onClick={onOpenTerms} className="hover:text-white hover:underline transition-colors">Terms & Conditions</button>
                   <button onClick={onOpenPrivacy} className="hover:text-white hover:underline transition-colors">Privacy Policy</button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;