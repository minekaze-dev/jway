import React from 'react';
import type { Guide, City, Category } from '../types';
import { UserIcon, LocationMarkerIcon, EyeIcon } from './icons';

interface GuideCardProps {
    guide: Guide;
    onOpenDetail: (id: string) => void;
}

const categoryColors: { [key in Category]: string } = {
    Transport: "bg-blue-900/50 text-blue-300 ring-1 ring-inset ring-blue-500/20",
    Wisata: "bg-emerald-900/50 text-emerald-300 ring-1 ring-inset ring-emerald-500/20",
    Belanja: "bg-amber-900/50 text-amber-300 ring-1 ring-inset ring-amber-500/20",
    Kuliner: "bg-pink-900/50 text-pink-300 ring-1 ring-inset ring-pink-500/20",
    Umum: "bg-cyan-900/50 text-cyan-300 ring-1 ring-inset ring-cyan-500/20",
};

const cityBorderColors: { [key in City]: string } = {
    Jakarta: "border-t-orange-500",
    Bogor: "border-t-green-500",
    Depok: "border-t-yellow-400",
    Tangerang: "border-t-purple-500",
    Bekasi: "border-t-sky-500",
};


const GuideCard: React.FC<GuideCardProps> = ({ guide, onOpenDetail }) => {
    return (
        <article className={`bg-gray-800 rounded-lg shadow-md hover:shadow-xl hover:shadow-black/20 transition-shadow duration-300 flex flex-col overflow-hidden border border-gray-700 border-t-4 ${cityBorderColors[guide.city]}`}>
            <div className="p-5 flex-grow">
                <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                        <h3 className="font-bold text-lg text-gray-100 leading-tight">{guide.title}</h3>
                        <div className="mt-1 flex items-center text-xs text-gray-400 gap-1">
                            <LocationMarkerIcon className="h-3 w-3" />
                            <span>{guide.city}</span>
                        </div>
                    </div>
                    <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[guide.category]}`}>
                        {guide.category}
                    </div>
                </div>
                <p className="text-sm text-gray-300 mt-3 line-clamp-2">
                    {guide.steps.slice(0, 2).join(' ')}
                </p>
            </div>
            <div className="px-5 py-3 bg-gray-800/50 border-t border-gray-700 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <EyeIcon className="h-4 w-4" />
                        <span className="font-medium">{guide.views.toLocaleString('id-ID')}</span>
                    </div>
                    {guide.user && (
                        <span className="flex items-center gap-1 text-xs bg-yellow-900/50 text-yellow-300 px-2 py-0.5 rounded-full ring-1 ring-inset ring-yellow-500/20">
                            <UserIcon className="h-3 w-3" />
                            Kontribusi
                        </span>
                    )}
                 </div>
                <button 
                    onClick={() => onOpenDetail(guide.id)} 
                    className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                    Lihat Detail
                </button>
            </div>
        </article>
    );
};

export default GuideCard;