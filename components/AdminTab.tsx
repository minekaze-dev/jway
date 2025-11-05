
import React, { useState } from 'react';
import type { Guide, Thread, Profile } from '../types';
import { TrashIcon, CheckCircleIcon, LogoutIcon } from './icons';

interface AdminTabProps {
    guides: Guide[];
    threads: Thread[];
    users: Profile[];
    onApproveGuide: (id: string) => void;
    onDeleteGuide: (id: string) => void;
    onDeleteThread: (id: string) => void;
    onAdminLogout: () => void;
    onBlockUser: (userId: string, is_blocked: boolean) => void;
}

const AdminTab: React.FC<AdminTabProps> = ({ guides, threads, users, onApproveGuide, onDeleteGuide, onDeleteThread, onAdminLogout, onBlockUser }) => {
    const [activeSubTab, setActiveSubTab] = useState('review');
    
    const ADMIN_USER = 'Admin';

    const pendingGuides = guides.filter(g => g.status === 'pending');
    const reportedThreads = threads.filter(t => (t.reports || []).length >= 10);
    
    const approvedGuides = guides.filter(g => g.status === 'approved');
    const adminGuides = approvedGuides.filter(g => !g.user);
    const userGuides = approvedGuides.filter(g => g.user);

    const allThreads = threads;
    const adminThreads = allThreads.filter(t => (t.posts || [])[0]?.author.display_name === ADMIN_USER);
    const userThreads = allThreads.filter(t => (t.posts || [])[0]?.author.display_name !== ADMIN_USER);

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
                    <button
                        onClick={() => setActiveSubTab('users')}
                        className={`${
                            activeSubTab === 'users'
                                ? 'border-blue-500 text-blue-500'
                                : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Manajemen User
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
                                            <p className="text-xs text-red-400 font-bold">{(thread.reports || []).length} Laporan</p>
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
                <div className="space-y-8">
                    {/* Admin Guides Management */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-gray-100">Manajemen Panduan Admin ({adminGuides.length})</h3>
                        <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 max-h-[60vh] overflow-y-auto">
                            <div className="space-y-3">
                                {adminGuides.length > 0 ? adminGuides.map(guide => (
                                    <div key={guide.id} className="bg-gray-900 p-3 rounded-md flex justify-between items-center gap-4">
                                        <p className="font-semibold text-gray-200 flex-1 truncate">{guide.title}</p>
                                        <button onClick={() => onDeleteGuide(guide.id)} className="p-2 bg-red-900/50 text-red-300 rounded-md hover:bg-red-800 flex-shrink-0" title="Hapus Panduan"><TrashIcon className="h-5 w-5"/></button>
                                    </div>
                                )) : <p className="text-gray-500 text-center py-4">Tidak ada panduan buatan Admin.</p>}
                            </div>
                        </div>
                    </div>
                    {/* User Guides Management */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-gray-100">Manajemen Panduan Netizen ({userGuides.length})</h3>
                        <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 max-h-[60vh] overflow-y-auto">
                            <div className="space-y-3">
                                {userGuides.length > 0 ? userGuides.map(guide => (
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
                     {/* Admin Threads Management */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-gray-100">Diskusi Buatan Admin ({adminThreads.length})</h3>
                        <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 max-h-[60vh] overflow-y-auto">
                            <div className="space-y-3">
                                {adminThreads.length > 0 ? adminThreads.map(thread => (
                                    <div key={thread.id} className="bg-gray-900 p-3 rounded-md flex justify-between items-center gap-4">
                                        <p className="font-semibold text-gray-200 flex-1 truncate">{thread.title}</p>
                                        <button onClick={() => onDeleteThread(thread.id)} className="p-2 bg-red-900/50 text-red-300 rounded-md hover:bg-red-800 flex-shrink-0" title="Hapus Diskusi"><TrashIcon className="h-5 w-5"/></button>
                                    </div>
                                )) : <p className="text-gray-500 text-center py-4">Tidak ada diskusi buatan Admin.</p>}
                            </div>
                        </div>
                    </div>
                     {/* User Threads Management */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-gray-100">Diskusi Netizen ({userThreads.length})</h3>
                        <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 max-h-[60vh] overflow-y-auto">
                            <div className="space-y-3">
                                {userThreads.length > 0 ? userThreads.map(thread => (
                                    <div key={thread.id} className="bg-gray-900 p-3 rounded-md flex justify-between items-center gap-4">
                                        <div>
                                            <p className="font-semibold text-gray-200">{thread.title}</p>
                                            <p className="text-xs text-gray-400">oleh: {(thread.posts || [])[0]?.author.display_name}</p>
                                        </div>
                                        <button onClick={() => onDeleteThread(thread.id)} className="p-2 bg-red-900/50 text-red-300 rounded-md hover:bg-red-800 flex-shrink-0" title="Hapus Diskusi"><TrashIcon className="h-5 w-5"/></button>
                                    </div>
                                )) : <p className="text-gray-500 text-center py-4">Tidak ada diskusi dari netizen.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeSubTab === 'users' && (
                 <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-100">Manajemen Pengguna ({users.length})</h3>
                    <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 max-h-[70vh] overflow-y-auto">
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Nama</th>
                                    <th scope="col" className="px-6 py-3">ID Pengguna</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600/50">
                                        <td className="px-6 py-4 font-medium text-gray-100 whitespace-nowrap">{user.display_name}</td>
                                        <td className="px-6 py-4 font-mono text-xs">{user.id}</td>
                                        <td className="px-6 py-4">
                                            {user.is_blocked ? 
                                                <span className="bg-red-900 text-red-300 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">Diblokir</span> :
                                                <span className="bg-green-900 text-green-300 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">Aktif</span>
                                            }
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {user.is_blocked ? (
                                                <button onClick={() => onBlockUser(user.id, false)} className="font-medium text-green-400 hover:underline">Buka Blokir</button>
                                            ) : (
                                                <button onClick={() => onBlockUser(user.id, true)} className="font-medium text-red-400 hover:underline">Blokir</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </section>
    );
};

export default AdminTab;