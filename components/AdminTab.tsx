import React, { useState } from 'react';
import type { Guide, Thread } from '../types';
import { TrashIcon, CheckCircleIcon, LogoutIcon } from './icons';

interface AdminTabProps {
    guides: Guide[];
    threads: Thread[];
    onApproveGuide: (id: string) => void;
    onDeleteGuide: (id: string) => void;
    onDeleteThread: (id: string) => void;
    onAdminLogout: () => void;
}

const AdminTab: React.FC<AdminTabProps> = ({ guides, threads, onApproveGuide, onDeleteGuide, onDeleteThread, onAdminLogout }) => {
    const [activeSubTab, setActiveSubTab] = useState('review');

    const pendingGuides = guides.filter(g => g.status === 'pending');
    const approvedGuides = guides.filter(g => g.status === 'approved');
    const reportedThreads = threads.filter(t => t.reports && t.reports.length >= 10);
    const regularThreads = threads.filter(t => !t.reports || t.reports.length < 10);

    return (
        <section>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                <div className="text-center sm:text-left">
                    <h2 className="text-3xl font-bold text-red-400">Dasbor Admin</h2>
                    <p className="mt-1 text-md text-gray-400">Kelola konten dan moderasi komunitas.</p>
                </div>
                <button
                    onClick={onAdminLogout}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-700 text-white font-semibold rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors flex-shrink-0"
                >
                    <LogoutIcon className="h-5 w-5" />
                    Keluar dari Mode Admin
                </button>
            </div>

            <div className="border-b border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button
                        onClick={() => setActiveSubTab('review')}
                        className={`${
                            activeSubTab === 'review'
                                ? 'border-blue-500 text-blue-500'
                                : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Tinjauan
                        {(pendingGuides.length + reportedThreads.length > 0) && (
                           <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-600 text-white">
                               {pendingGuides.length + reportedThreads.length}
                           </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveSubTab('manage')}
                        className={`${
                            activeSubTab === 'manage'
                                ? 'border-blue-500 text-blue-500'
                                : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Manajemen Konten
                    </button>
                </nav>
            </div>

            {activeSubTab === 'review' && (
                <div className="space-y-8">
                    {/* Pending Guides Review */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-gray-100">Tinjauan Panduan ({pendingGuides.length})</h3>
                        <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 max-h-[60vh] overflow-y-auto">
                            <div className="space-y-3">
                                {pendingGuides.length > 0 ? pendingGuides.map(guide => (
                                    <div key={guide.id} className="bg-gray-900 p-3 rounded-md flex justify-between items-center gap-4">
                                        <div>
                                            <p className="font-semibold text-gray-200">{guide.title}</p>
                                            <p className="text-xs text-gray-400">oleh: {guide.author}</p>
                                        </div>
                                        <div className="flex gap-2 flex-shrink-0">
                                            <button onClick={() => onApproveGuide(guide.id)} className="p-2 bg-green-900/50 text-green-300 rounded-md hover:bg-green-800" title="Setujui Panduan"><CheckCircleIcon className="h-5 w-5"/></button>
                                            <button onClick={() => onDeleteGuide(guide.id)} className="p-2 bg-red-900/50 text-red-300 rounded-md hover:bg-red-800" title="Tolak Panduan"><TrashIcon className="h-5 w-5"/></button>
                                        </div>
                                    </div>
                                )) : <p className="text-gray-500 text-center py-4">Tidak ada panduan yang menunggu tinjauan.</p>}
                            </div>
                        </div>
                    </div>
                    {/* Reported Threads Review */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-gray-100">Diskusi Dilaporkan ({reportedThreads.length})</h3>
                         <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 max-h-[60vh] overflow-y-auto">
                            <div className="space-y-3">
                                {reportedThreads.length > 0 ? reportedThreads.map(thread => (
                                    <div key={thread.id} className="bg-gray-900 p-3 rounded-md flex justify-between items-center gap-4">
                                        <div>
                                            <p className="font-semibold text-gray-200">{thread.title}</p>
                                            <p className="text-xs text-red-400 font-bold">{thread.reports.length} Laporan</p>
                                        </div>
                                        <button onClick={() => onDeleteThread(thread.id)} className="p-2 bg-red-900/50 text-red-300 rounded-md hover:bg-red-800" title="Hapus Diskusi"><TrashIcon className="h-5 w-5"/></button>
                                    </div>
                                )) : <p className="text-gray-500 text-center py-4">Tidak ada diskusi yang dilaporkan.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeSubTab === 'manage' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Approved Guides Management */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-gray-100">Manajemen Panduan ({approvedGuides.length})</h3>
                        <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 max-h-[60vh] overflow-y-auto">
                            <div className="space-y-3">
                                {approvedGuides.length > 0 ? approvedGuides.map(guide => (
                                    <div key={guide.id} className="bg-gray-900 p-3 rounded-md flex justify-between items-center gap-4">
                                        <div>
                                            <p className="font-semibold text-gray-200">{guide.title}</p>
                                            <p className="text-xs text-gray-400">oleh: {guide.author}</p>
                                        </div>
                                        <button onClick={() => onDeleteGuide(guide.id)} className="p-2 bg-red-900/50 text-red-300 rounded-md hover:bg-red-800 flex-shrink-0" title="Hapus Panduan"><TrashIcon className="h-5 w-5"/></button>
                                    </div>
                                )) : <p className="text-gray-500 text-center py-4">Tidak ada panduan dari kontributor.</p>}
                            </div>
                        </div>
                    </div>
                    {/* Regular Threads Management */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-gray-100">Manajemen Diskusi ({regularThreads.length})</h3>
                        <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 max-h-[60vh] overflow-y-auto">
                            <div className="space-y-3">
                                {regularThreads.length > 0 ? regularThreads.map(thread => (
                                    <div key={thread.id} className="bg-gray-900 p-3 rounded-md flex justify-between items-center gap-4">
                                        <div>
                                            <p className="font-semibold text-gray-200">{thread.title}</p>
                                            <p className="text-xs text-gray-400">oleh: {thread.posts[0]?.author}</p>
                                        </div>
                                        <button onClick={() => onDeleteThread(thread.id)} className="p-2 bg-red-900/50 text-red-300 rounded-md hover:bg-red-800 flex-shrink-0" title="Hapus Diskusi"><TrashIcon className="h-5 w-5"/></button>
                                    </div>
                                )) : <p className="text-gray-500 text-center py-4">Tidak ada diskusi.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default AdminTab;