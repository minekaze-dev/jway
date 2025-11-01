import React from 'react';
import type { Guide, City, Category } from '../types';
import { CITIES, CATEGORIES } from '../constants';
import GuideCard from './GuideCard';

interface ExplorerTabProps {
    guides: Guide[];
    totalGuidesCount: number;
    onLoadMore: () => void;
    onOpenDetail: (id: string) => void;
    cityFilter: City | 'All';
    setCityFilter: (city: City | 'All') => void;
    categoryFilter: Category | 'All';
    setCategoryFilter: (category: Category | 'All') => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const ExplorerTab: React.FC<ExplorerTabProps> = ({ guides, totalGuidesCount, onLoadMore, onOpenDetail, cityFilter, setCityFilter, categoryFilter, setCategoryFilter, searchQuery, setSearchQuery }) => {
    return (
        <section>
            <div className="bg-gray-800 p-4 rounded-lg shadow-sm mb-6 border border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="md:col-span-2">
                         <input 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            placeholder="Cari panduan, misal 'Naik KRL' atau 'Monas'..." 
                            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <select className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition" value={cityFilter} onChange={(e) => setCityFilter(e.target.value as City | 'All')}>
                            {CITIES.map(c => <option key={c} value={c}>{c === 'All' ? 'Semua Kota' : c}</option>)}
                        </select>
                        <select className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as Category | 'All')}>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c === 'All' ? 'Semua Kategori' : c}</option>)}
                        </select>
                    </div>
                </div>
            </div>
            
            <div className="mb-4 text-sm text-gray-400">
                Menampilkan <strong>{guides.length}</strong> dari <strong>{totalGuidesCount}</strong> panduan.
            </div>

            {guides.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {guides.map(guide => (
                        <GuideCard key={guide.id} guide={guide} onOpenDetail={onOpenDetail} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 px-6 bg-gray-800 rounded-lg shadow-sm border border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-100">Panduan tidak ditemukan</h3>
                    <p className="text-gray-400 mt-2">Coba ubah kata kunci pencarian atau filter yang Anda gunakan.</p>
                </div>
            )}

            {guides.length < totalGuidesCount && (
                <div className="mt-8 text-center">
                    <button
                        onClick={onLoadMore}
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform hover:scale-105"
                    >
                        Muat Lebih Banyak
                    </button>
                </div>
            )}
        </section>
    );
};

export default ExplorerTab;