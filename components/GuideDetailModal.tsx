
import React from 'react';
import type { Guide } from '../types';
import { LightBulbIcon, CheckCircleIcon, PencilIcon, TrashIcon, ShareIcon } from './icons';

interface GuideDetailModalProps {
    guide: Guide;
    currentUser: string;
    adminUser: string;
    onClose: () => void;
    onEdit: (guide: Guide) => void;
    onDelete: (id: string) => void;
    onShare: () => void;
}

const GuideDetailModal: React.FC<GuideDetailModalProps> = ({ guide, currentUser, adminUser, onClose, onEdit, onDelete, onShare }) => {
    const canModify = guide.user ? (guide.author === currentUser || currentUser === adminUser) : currentUser === adminUser;

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden transform transition-all border border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-100">{guide.title}</h2>
                            <div className="text-sm text-gray-400 mt-1">{(guide.cities || []).join(', ')} · {guide.category}</div>
                            <div className="text-xs text-gray-400 mt-1">
                                {guide.user ? 'Kontribusi oleh: ' : 'Oleh: '} 
                                <span className="font-medium text-gray-300">{guide.author}</span>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                </div>

                <div className="px-6 pb-6 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-200"><CheckCircleIcon className="h-5 w-5 text-blue-500" />Langkah-langkah</h3>
                            <ol className="list-decimal list-outside ml-5 mt-3 space-y-3 text-gray-300">
                                {(guide.steps || []).map((step, index) => <li key={index} className="pl-2">{step}</li>)}
                            </ol>
                        </div>

                        {guide.tips && guide.tips.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-200"><LightBulbIcon className="h-5 w-5 text-amber-400" />Tips Tambahan</h3>
                                <ul className="list-disc list-outside ml-5 mt-3 space-y-2 text-gray-300">
                                    {guide.tips.map((tip, index) => <li key={index} className="pl-2">{tip}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-900/50 border-t border-gray-700 flex flex-wrap items-center justify-between gap-4">
                    <div className="text-sm text-gray-400 space-x-4">
                        <span>Estimasi: <strong className="text-gray-200">{guide.duration}</strong></span>
                        <span>Biaya: <strong className="text-gray-200">{guide.cost}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                         <button 
                            onClick={onShare}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white text-sm font-medium rounded-md hover:bg-gray-600 transition-colors"
                        >
                            <ShareIcon className="h-4 w-4"/>
                            Bagikan
                        </button>
                         {canModify && (
                            <>
                                <button 
                                    onClick={() => onEdit(guide)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-500 transition-colors"
                                >
                                    <PencilIcon className="h-4 w-4"/>
                                    Edit
                                </button>
                                <button 
                                    onClick={() => onDelete(guide.id)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-800/80 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                                >
                                    <TrashIcon className="h-4 w-4"/>
                                    Hapus
                                </button>
                            </>
                         )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuideDetailModal;
