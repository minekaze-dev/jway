import React, { useState } from 'react';
import type { Thread, Post, ThreadStatus } from '../types';
import { PencilIcon, TrashIcon, EyeIcon, FlagIcon } from './icons';

interface ForumThreadModalProps {
    thread: Thread;
    onClose: () => void;
    onAddPost: (threadId: string, text: string) => void;
    onEditPost: (threadId: string, postId: string, newText: string) => void;
    onDeletePost: (threadId: string, postId: string) => void;
    onVote: (threadId: string, voteType: 'green' | 'yellow' | 'red') => void;
    onReport: (threadId: string) => void;
    currentUser: string;
    adminUser: string;
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
    trusted: 'Terpercaya',
    questionable: 'Meragukan',
    danger: 'Berisiko',
};

const ForumThreadModal: React.FC<ForumThreadModalProps> = ({ thread, onClose, onAddPost, onEditPost, onDeletePost, onVote, onReport, currentUser, adminUser }) => {
    const [newPostText, setNewPostText] = useState('');
    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState('');

    const handleAddPostSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddPost(thread.id, newPostText);
        setNewPostText('');
    };

    const handleEditClick = (post: Post) => {
        setEditingPostId(post.id);
        setEditingText(post.text);
    };

    const handleCancelEdit = () => {
        setEditingPostId(null);
        setEditingText('');
    };

    const handleSaveEdit = (postId: string) => {
        onEditPost(thread.id, postId, editingText);
        handleCancelEdit();
    };
    
    const handleDeleteClick = (postId: string) => {
        if (window.confirm('Anda yakin ingin menghapus post ini?')) {
            onDeletePost(thread.id, postId);
        }
    }

    const status = getThreadStatus(thread);
    const userVote = thread.greenVotes.includes(currentUser) ? 'green' : 
                     thread.yellowVotes.includes(currentUser) ? 'yellow' :
                     thread.redVotes.includes(currentUser) ? 'red' : null;
    const hasReported = thread.reports.includes(currentUser);

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 w-full max-w-2xl rounded-xl shadow-2xl flex flex-col transform transition-all border border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-gray-700">
                    <div className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                             <h2 className="text-2xl font-bold text-gray-100">{thread.title}</h2>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                     <div className="mt-2 flex items-center justify-between gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${statusColors[status]}`}></div>
                                <span title={`Status: ${statusText[status]}`}>Status Komunitas</span>
                            </div>
                            <div className="flex items-center gap-1.5 font-medium" title="Dilihat">
                                <EyeIcon className="h-5 w-5" />
                                <span>{thread.views}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onReport(thread.id)}
                                disabled={hasReported}
                                className={`p-2 rounded-md transition-colors ${
                                    hasReported ? 'text-red-400 cursor-not-allowed' : 'text-gray-400 hover:bg-red-900/50 hover:text-red-300'
                                }`}
                                title={hasReported ? 'Anda sudah melaporkan ini' : 'Lapor Diskusi'}
                            >
                                <FlagIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                     <div className="mt-3 flex items-center justify-center gap-2">
                         <button onClick={() => onVote(thread.id, 'green')} className={`flex-1 justify-center py-2 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${userVote === 'green' ? 'bg-green-500 text-white ring-2 ring-green-300' : 'bg-green-500/20 text-green-300 hover:bg-green-500/40'}`}>
                            <span>{thread.greenVotes.length}</span>
                            <span>Terpercaya</span>
                        </button>
                        <button onClick={() => onVote(thread.id, 'yellow')} className={`flex-1 justify-center py-2 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${userVote === 'yellow' ? 'bg-yellow-500 text-white ring-2 ring-yellow-300' : 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/40'}`}>
                            <span>{thread.yellowVotes.length}</span>
                            <span>Meragukan</span>
                        </button>
                        <button onClick={() => onVote(thread.id, 'red')} className={`flex-1 justify-center py-2 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${userVote === 'red' ? 'bg-red-500 text-white ring-2 ring-red-300' : 'bg-red-500/20 text-red-300 hover:bg-red-500/40'}`}>
                            <span>{thread.redVotes.length}</span>
                            <span>Berisiko</span>
                        </button>
                    </div>
                </div>

                <div className="px-6 py-4 flex-grow max-h-[60vh] overflow-y-auto">
                    <div className="space-y-4">
                        {thread.posts.map((post, index) => {
                            const isOriginalPost = index === 0;
                            const canModify = post.author === currentUser || currentUser === adminUser;
                            const isCurrentUserPost = post.author === currentUser;

                            return (
                                <div 
                                    key={post.id} 
                                    className={`
                                        p-4 rounded-lg 
                                        ${isOriginalPost 
                                            ? 'bg-gray-700/40 border border-gray-600' 
                                            : 'bg-gray-900/50 ml-4 md:ml-8'
                                        }
                                    `}
                                >
                                    {editingPostId === post.id ? (
                                        <div className="space-y-2">
                                            <textarea 
                                                value={editingText}
                                                onChange={(e) => setEditingText(e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-100 placeholder-gray-400"
                                                rows={3}
                                            />
                                            <div className="flex gap-2">
                                                <button onClick={() => handleSaveEdit(post.id)} className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700">Simpan</button>
                                                <button onClick={handleCancelEdit} className="px-3 py-1 border border-gray-600 text-gray-300 text-sm font-medium rounded-md hover:bg-gray-700">Batal</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <p className="text-gray-300 whitespace-pre-wrap flex-grow">
                                                    <strong className="text-gray-100 block">
                                                        {post.author}
                                                        {isCurrentUserPost && <span className="text-xs font-normal text-blue-400 ml-2">(Anda)</span>}
                                                        {isOriginalPost && <span className="text-xs font-normal text-amber-400 ml-2">(Pembuat Thread)</span>}
                                                    </strong>
                                                    {post.text}
                                                </p>
                                                {canModify && (
                                                    <div className="flex gap-2 flex-shrink-0 ml-4">
                                                        <button onClick={() => handleEditClick(post)} title="Edit Post" className="text-gray-400 hover:text-blue-400">
                                                            <PencilIcon className="h-4 w-4" />
                                                        </button>
                                                        <button onClick={() => handleDeleteClick(post.id)} title="Hapus Post" className="text-gray-400 hover:text-red-400">
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-900/50 border-t border-gray-700">
                    <form onSubmit={handleAddPostSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={newPostText}
                            onChange={(e) => setNewPostText(e.target.value)}
                            placeholder="Tulis balasan..."
                            className="flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-100 placeholder-gray-400"
                        />
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 disabled:bg-gray-500" disabled={!newPostText.trim()}>
                            Kirim
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForumThreadModal;