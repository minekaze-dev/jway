import React from 'react';
import type { Guide } from '../types';
import { PlusCircleIcon, PencilIcon, TrashIcon } from './icons';

interface ContributionTabProps {
    guides: Guide[];
    currentUser: string;
    adminUser: string;
    onOpenDetail: (id: string) => void;
    onOpenContributionModal: () => void;
    onEdit: (guide: Guide) => void;
    onDelete: (id: string) => void;
}

const ContributionTab: React.FC<ContributionTabProps> = ({ guides, currentUser, adminUser, onOpenDetail, onOpenContributionModal, onEdit, onDelete }) => {
    const userGuides = guides.filter(g => g.user);
    const myApprovedGuides = userGuides.filter(g => g.author === currentUser && g.status === 'approved');
    const myPendingGuides = userGuides.filter(g => g.author === currentUser && g.status === 'pending');
    const otherApprovedGuides = userGuides.filter(g => g.author !== currentUser && g.status === 'approved');

    return (
        <section>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-100">Panduan Netizen</h2>
                <p className="mt-2 text-md text-gray-400 max-w-2xl mx-auto">
                    Lihat semua panduan yang telah dibagikan oleh komunitas. Terima kasih untuk semua kontributor!
                </p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-100">Bagikan Pengetahuanmu!</h3>
                    <p className="text-gray-400 mt-1">Panduanmu akan ditinjau oleh admin sebelum dipublikasikan.</p>
                </div>
                 <button 
                    onClick={onOpenContributionModal}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform hover:scale-105 flex-shrink-0"
                >
                    <PlusCircleIcon className="h-5 w-5" />
                    Buat Panduan Baru
                </button>
            </div>

            {/* My Pending Guides */}
            {myPendingGuides.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-yellow-400 mb-3">Panduan Anda Menunggu Tinjauan</h3>
                     <div className="space-y-3">
                        {myPendingGuides.map(guide => (
                             <div key={guide.id} className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                                <div>
                                     <h4 className="font-semibold text-gray-100">{guide.title}</h4>
                                     <p className="text-sm text-yellow-300">Status: Menunggu Tinjauan</p>
                                </div>
                                <div className="flex items-center gap-2 self-start sm:self-center">
                                    <button onClick={() => onEdit(guide)} className="p-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 hover:text-white" title="Edit Panduan"><PencilIcon className="h-4 w-4" /></button>
                                    <button onClick={() => onDelete(guide.id)} className="p-2 bg-red-900/50 text-red-300 rounded-md hover:bg-red-900" title="Hapus Panduan"><TrashIcon className="h-4 w-4" /></button>
                                </div>
                             </div>
                        ))}
                     </div>
                </div>
            )}

            {/* Contribution Board */}
            <h3 className="text-xl font-bold text-gray-100 mb-4">Panduan Netizen Terpublikasi</h3>
            <div className="space-y-3">
                {[...myApprovedGuides, ...otherApprovedGuides].length > 0 ? (
                    [...myApprovedGuides, ...otherApprovedGuides].map(guide => {
                        const canModify = guide.author === currentUser || currentUser === adminUser;
                        return (
                            <div key={guide.id} className="bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-700 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                               <div>
                                    <h4 className="font-semibold text-gray-100">{guide.title}</h4>
                                    <p className="text-sm text-gray-400">
                                        oleh <span className="font-medium text-gray-300">{guide.author || 'Anonim'}</span>
                                        {guide.author === currentUser && <span className="text-xs text-blue-400 ml-2">(Anda)</span>}
                                    </p>
                               </div>
                               <div className="flex items-center gap-2 self-start sm:self-center">
                                    {canModify && (
                                        <>
                                            <button onClick={() => onEdit(guide)} className="p-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 hover:text-white" title="Edit Panduan"><PencilIcon className="h-4 w-4" /></button>
                                            <button onClick={() => onDelete(guide.id)} className="p-2 bg-red-900/50 text-red-300 rounded-md hover:bg-red-900" title="Hapus Panduan"><TrashIcon className="h-4 w-4" /></button>
                                        </>
                                    )}
                                   <button onClick={() => onOpenDetail(guide.id)} className="px-4 py-1.5 bg-gray-700 text-white rounded-md text-sm font-semibold hover:bg-gray-600">Lihat</button>
                               </div>
                            </div>
                        )
                    })
                ) : (
                     <div className="text-center py-10 px-6 bg-gray-800 rounded-lg shadow-sm border border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-200">Belum Ada Kontribusi Terpublikasi</h3>
                        <p className="text-gray-400 mt-1 text-sm">Jadilah yang pertama berkontribusi!</p>
                    </div>
                )}
            </div>

        </section>
    );
};

export default ContributionTab;