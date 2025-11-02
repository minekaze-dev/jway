import React from 'react';
import type { Thread, ThreadStatus, ThreadCategory } from '../types';
import { ChatAlt2Icon, PlusCircleIcon } from './icons';
import { THREAD_CATEGORIES } from '../constants';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Session } from '@supabase/supabase-js';


interface ForumTabProps {
    threads: Thread[];
    voterId: string;
    session: Session | null;
    isAdminMode: boolean;
    onOpenThreadModal: () => void;
    onOpenThreadDetail: (id: string) => void;
    onVote: (threadId: string, voteType: 'green' | 'yellow' | 'red') => void;
    onReport: (threadId: string) => void;
    threadCategoryFilter: ThreadCategory | 'All';
    setThreadCategoryFilter: (category: ThreadCategory | 'All') => void;
}

const getThreadStatus = (thread: Thread): ThreadStatus => {
    const votes = {
        trusted: thread.greenVotes.length,
        questionable: thread.yellowVotes.length,
        danger: thread.redVotes.length,
    };

    const maxVotes = Math.max(votes.trusted, votes.questionable, votes.danger);

    if (maxVotes === 0) return 'questionable';

    const topStatus = (Object.keys(votes) as ThreadStatus[]).filter(status => votes[status] === maxVotes);
    
    if (topStatus.length > 1) {
        return 'questionable';
    }
    
    return topStatus[0];
};

const statusColors: { [key in ThreadStatus]: string } = {
    trusted: 'bg-green-500',
    questionable: 'bg-yellow-500',
    danger: 'bg-red-500',
};
const statusText: { [key in ThreadStatus]: string } = {
    trusted: 'Diskusi Terpercaya',
    questionable: 'Diskusi Meragukan',
    danger: 'Diskusi Berisiko',
};

const threadCategoryColors: { [key in ThreadCategory]: string } = {
    "Umum": "bg-gray-700 text-gray-300 ring-1 ring-inset ring-gray-500/50",
    "Kuliner": "bg-pink-900/50 text-pink-300 ring-1 ring-inset ring-pink-500/20",
    "Transportasi": "bg-blue-900/50 text-blue-300 ring-1 ring-inset ring-blue-500/20",
    "Lowongan Kerja": "bg-indigo-900/50 text-indigo-300 ring-1 ring-inset ring-indigo-500/20",
    "Hiburan": "bg-purple-900/50 text-purple-300 ring-1 ring-inset ring-purple-500/20",
};


const ForumTab: React.FC<ForumTabProps> = ({ threads, voterId, session, isAdminMode, onOpenThreadModal, onOpenThreadDetail, onVote, onReport, threadCategoryFilter, setThreadCategoryFilter }) => {
    const [isInfoVisible, setIsInfoVisible] = useLocalStorage('jabo-way-forum-info-seen', true);
    
    const visibleThreads = threads.filter(t => isAdminMode || t.reports.length < 10);
    const isLoggedIn = !!session;
    
    return (
        <section>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-100">Forum Terbuka</h2>
                <p className="mt-2 text-md text-gray-400 max-w-2xl mx-auto">
                    Punya pertanyaan atau ingin diskusi? Mulai percakapan di sini.
                </p>
            </div>

            {isInfoVisible && (
                <div className="bg-gray-800 border border-blue-500/30 rounded-lg p-4 mb-8 relative">
                    <button 
                        onClick={() => setIsInfoVisible(false)} 
                        className="absolute top-3 right-3 text-gray-500 hover:text-gray-200 transition-colors"
                        aria-label="Tutup notifikasi"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    <h4 className="font-semibold text-gray-100 pr-6">Memahami Indikator Kepercayaan</h4>
                    <p className="text-sm text-gray-400 mt-1">
                        Status diskusi ditentukan oleh suara mayoritas dari komunitas. Berikan suaramu untuk membantu pengguna lain!
                    </p>
                    <ul className="list-none mt-2 space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></div>
                            <span className="text-gray-300"><strong className="text-green-400 font-semibold">Terpercaya</strong></span>
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500 flex-shrink-0"></div>
                            <span className="text-gray-300"><strong className="text-yellow-400 font-semibold">Belum Pasti</strong></span>
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0"></div>
                             <span className="text-gray-300"><strong className="text-red-400 font-semibold">Hoax</strong></span>
                        </li>
                    </ul>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                        <h3 className="text-xl font-bold text-gray-100">Diskusi Terbaru</h3>
                        <select 
                            value={threadCategoryFilter} 
                            onChange={(e) => setThreadCategoryFilter(e.target.value as ThreadCategory | 'All')}
                            className="w-full sm:w-auto px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition"
                        >
                            {THREAD_CATEGORIES.map(c => <option key={c} value={c}>{c === 'All' ? 'Semua Kategori' : c}</option>)}
                        </select>
                    </div>
                    <div className="space-y-4">
                        {visibleThreads.map(thread => {
                            const status = getThreadStatus(thread);
                            const userVote = thread.greenVotes.includes(voterId) ? 'green' : 
                                             thread.yellowVotes.includes(voterId) ? 'yellow' :
                                             thread.redVotes.includes(voterId) ? 'red' : null;
                            const hasReported = thread.reports.includes(voterId);

                            return (
                                <div key={thread.id} className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 hover:border-blue-500 transition-colors flex flex-col">
                                    <div className='p-4 flex-grow'>
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3 flex-1">
                                                <div className={`mt-1.5 w-3 h-3 rounded-full flex-shrink-0 ${statusColors[status]}`} title={statusText[status]}></div>
                                                <h4 className="font-semibold text-gray-100">{thread.title}</h4>
                                            </div>
                                            <div className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${threadCategoryColors[thread.category]}`}>
                                                {thread.category}
                                            </div>
                                        </div>
                                        <div className="mt-3 border-t border-gray-700 pt-3 space-y-3">
                                            {thread.posts[0] && (
                                                <p key={thread.posts[0].id} className="text-sm text-gray-300 line-clamp-2">
                                                    <strong className="text-gray-100">{thread.posts[0].author}:</strong> "{thread.posts[0].text}"
                                                </p>
                                            )}
                                            
                                            {thread.posts.length > 2 && (
                                                <div className="relative text-center">
                                                    <hr className="border-gray-700"/>
                                                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-gray-500 bg-gray-800 px-2">...</span>
                                                </div>
                                            )}

                                            {thread.posts.length > 1 && (
                                                <p key={thread.posts[thread.posts.length - 1].id} className="text-sm text-gray-400 line-clamp-2 bg-gray-700/50 p-2 rounded-md">
                                                    <strong className="text-gray-200">{thread.posts[thread.posts.length - 1].author}:</strong> "{thread.posts[thread.posts.length - 1].text}"
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="px-4 py-3 bg-gray-900/50 border-t border-gray-700 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-gray-400 font-medium">
                                            <div className="flex items-center gap-1.5" title={`${thread.posts.length} Balasan`}>
                                                <ChatAlt2Icon className="h-5 w-5" />
                                                <span className="text-sm">{thread.posts.length}</span>
                                            </div>
                                             <button onClick={() => onVote(thread.id, 'green')} className={`px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${userVote === 'green' ? 'bg-green-500 text-white ring-2 ring-green-300' : 'bg-green-500/20 text-green-300 hover:bg-green-500/40'}`}>
                                                <span>{thread.greenVotes.length}</span>
                                            </button>
                                            <button onClick={() => onVote(thread.id, 'yellow')} className={`px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${userVote === 'yellow' ? 'bg-yellow-500 text-white ring-2 ring-yellow-300' : 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/40'}`}>
                                                <span>{thread.yellowVotes.length}</span>
                                            </button>
                                            <button onClick={() => onVote(thread.id, 'red')} className={`px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${userVote === 'red' ? 'bg-red-500 text-white ring-2 ring-red-300' : 'bg-red-500/20 text-red-300 hover:bg-red-500/40'}`}>
                                                <span>{thread.redVotes.length}</span>
                                            </button>
                                        </div>
                                         <div className="flex items-center gap-2">
                                             <button
                                                onClick={() => onReport(thread.id)}
                                                disabled={hasReported}
                                                className={`p-2 rounded-md transition-colors text-xl ${
                                                    hasReported ? 'opacity-50 cursor-not-allowed' : 'opacity-70 hover:opacity-100'
                                                }`}
                                                title={hasReported ? 'Anda sudah melaporkan ini' : 'Lapor Diskusi'}
                                            >
                                                🚩
                                            </button>
                                             <button 
                                                onClick={() => onOpenThreadDetail(thread.id)}
                                                className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                            >
                                                Lihat Diskusi
                                            </button>
                                         </div>
                                    </div>
                                </div>
                            )
                        })}
                         {visibleThreads.length === 0 && (
                            <div className="text-center py-10 px-6 bg-gray-800 rounded-lg shadow-sm border border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-200">Tidak Ada Diskusi</h3>
                                <p className="text-gray-400 mt-1 text-sm">Belum ada diskusi yang tersedia untuk ditampilkan.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-100">Mulai Diskusi Baru</h3>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 space-y-4 flex flex-col justify-center">
                        <p className="text-gray-400">Punya pertanyaan atau ingin berbagi informasi? Buat thread baru agar komunitas bisa ikut berdiskusi.</p>
                         <button
                            onClick={onOpenThreadModal}
                            disabled={!isLoggedIn}
                            title={isLoggedIn ? 'Buat thread diskusi baru' : 'Anda harus login untuk membuat thread'}
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <PlusCircleIcon className="h-5 w-5" />
                            Buat Thread Baru
                        </button>
                        {!isLoggedIn && (
                            <p className="text-xs text-center text-gray-400">Silakan login untuk memulai diskusi.</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ForumTab;