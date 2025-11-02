import React, { useState, useRef, useEffect } from 'react';

interface HeaderProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    onOpenAdminLoginModal: () => void;
    tabs: string[];
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, onOpenAdminLoginModal, tabs }) => {
    const [logoClickCount, setLogoClickCount] = useState(0);
    const clickTimeoutRef = useRef<number | null>(null);

    // Cleanup timer on component unmount
    useEffect(() => {
        return () => {
            if (clickTimeoutRef.current) {
                clearTimeout(clickTimeoutRef.current);
            }
        };
    }, []);

    const handleLogoClick = () => {
        const newCount = logoClickCount + 1;
        setLogoClickCount(newCount);

        // Clear any pending single-click action
        if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
        }

        if (newCount === 5) {
            // Immediately act on the 5th click
            setLogoClickCount(0);
            onOpenAdminLoginModal();
        } else {
            // Set a timeout to determine if it's a single click
            clickTimeoutRef.current = window.setTimeout(() => {
                if (newCount === 1) {
                    // If after the timeout, the count is still 1, it was a single click
                    onTabChange('Explorer');
                }
                // Reset for the next sequence
                setLogoClickCount(0);
            }, 300); // 300ms window to distinguish single from multi-click
        }
    };

    return (
        <>
            {/* Universal Top Bar */}
            <header className="bg-gray-900/80 backdrop-blur-lg fixed md:sticky top-0 w-full z-40 shadow-sm shadow-black/20 border-b border-gray-700/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo and Title - Always visible */}
                        <div 
                            className="flex items-center gap-3 cursor-pointer" 
                            onClick={handleLogoClick} 
                            title="Klik 1x ke Home, Klik 5x untuk akses admin"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                JW
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-gray-100">JABODETABEK WAY</h1>
                                <p className="text-xs text-gray-400 hidden sm:block">Panduan Hidup Perantau di Kota Metropolitan</p>
                            </div>
                        </div>
                        {/* Desktop Navigation - Hidden on mobile */}
                        <nav className="hidden md:flex items-center gap-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => onTabChange(tab)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                        activeTab === tab
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : `text-gray-300 hover:bg-gray-700 hover:text-white ${tab === 'Admin' ? 'text-red-400' : ''}`
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Mobile Bottom Navigation - Only on mobile */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-lg border-t border-gray-700 z-50">
                <div className="flex justify-around">
                    {tabs.map((tab) => {
                        const mobileTabText = tab === 'Panduan Netizen' ? 'Panduan' : tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => onTabChange(tab)}
                                className={`flex-1 py-4 text-sm font-medium transition-colors duration-200 ${
                                    activeTab === tab
                                        ? 'bg-blue-600 text-white'
                                        : `text-gray-300 hover:bg-gray-700 ${tab === 'Admin' ? 'text-red-400' : ''}`
                                }`}
                            >
                                {mobileTabText}
                            </button>
                        );
                    })}
                </div>
            </nav>
        </>
    );
};

export default Header;