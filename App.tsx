import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { CITIES, CATEGORIES, THREAD_CATEGORIES, QUICK_SUGGESTIONS } from './constants';
import type { Guide, Thread, ContributionForm, ThreadForm, City, Category, Post, ThreadCategory, Profile } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import ExplorerTab from './components/ExplorerTab';
import ContributionTab from './components/ContributionTab';
import ForumTab from './components/ForumTab';
import AboutTab from './components/AboutTab';
import AdminTab from './components/AdminTab';
import GuideDetailModal from './components/GuideDetailModal';
import ForumThreadModal from './components/ForumThreadModal';
import AdminLoginModal from './components/AdminLoginModal';
import TermsModal from './components/TermsModal';
import PrivacyModal from './components/PrivacyModal';
import GuidePreview from './components/GuidePreview';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Session } from '@supabase/supabase-js';


const REPORT_REASONS = ["Spam", "Konten Tidak Pantas", "Informasi Salah", "Lainnya"];

interface ReportModalProps {
    onClose: () => void;
    onSubmit: (reason: string) => void;
    type: 'thread' | 'post';
}

const ReportModal: React.FC<ReportModalProps> = ({ onClose, onSubmit, type }) => {
    const [selectedReason, setSelectedReason] = useState('');
    const [otherReason, setOtherReason] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const reason = selectedReason === 'Lainnya' ? otherReason.trim() : selectedReason;
        if (reason) {
            onSubmit(reason);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 w-full max-w-md rounded-xl shadow-2xl border border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit} className="overflow-hidden rounded-xl">
                    <div className="p-6 border-b border-gray-700">
                        <h3 className="text-xl font-bold text-gray-100">Laporkan {type === 'thread' ? 'Diskusi' : 'Komentar'}</h3>
                        <p className="text-sm text-gray-400 mt-1">Pilih alasan mengapa Anda melaporkan konten ini.</p>
                    </div>
                    <div className="p-6 space-y-4">
                        {REPORT_REASONS.map(reason => (
                            <div key={reason} className="flex items-center">
                                <input
                                    type="radio"
                                    id={`reason-${reason}`}
                                    name="report-reason"
                                    value={reason}
                                    checked={selectedReason === reason}
                                    onChange={() => setSelectedReason(reason)}
                                    className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                                />
                                <label htmlFor={`reason-${reason}`} className="ml-3 block text-sm font-medium text-gray-300">
                                    {reason}
                                 </label>
                            </div>
                        ))}
                        {selectedReason === 'Lainnya' && (
                            <textarea
                                value={otherReason}
                                onChange={(e) => setOtherReason(e.target.value)}
                                placeholder="Jelaskan alasan Anda..."
                                className="w-full mt-2 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400"
                                rows={3}
                                required
                            />
                        )}
                    </div>
                    <div className="px-6 py-4 bg-gray-900/50 border-t border-gray-700 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700">
                            Batal
                        </button>
                        <button 
                            type="submit" 
                            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!selectedReason || (selectedReason === 'Lainnya' && !otherReason.trim())}
                        >
                            Kirim Laporan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const GUEST_USER = 'Guest';
const ADMIN_USER = 'Admin';
const GUIDES_PER_PAGE = 9;

export default function App() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('Explorer');
  const [cityFilter, setCityFilter] = useState<City | 'All'>("All");
  const [categoryFilter, setCategoryFilter] = useState<Category | 'All'>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [threadCategoryFilter, setThreadCategoryFilter] = useState<ThreadCategory | 'All'>("All");
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);

  const [contribution, setContribution] = useState<ContributionForm>({ title: "", author: "", city: "Jakarta", category: "Transport", stepsText: "", tipsText: "", cost: "" });
  const [editingGuide, setEditingGuide] = useState<Guide | null>(null);
  const [threadForm, setThreadForm] = useState<ThreadForm>({ title: "", text: "", category: "Umum" });

  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [isThreadModalOpen, setIsThreadModalOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{type: 'thread' | 'post', threadId: string, postId?: string} | null>(null);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(GUEST_USER);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  
  const [visibleGuidesCount, setVisibleGuidesCount] = useState(GUIDES_PER_PAGE);
  const [voterId] = useLocalStorage('jabo-way-guest-id', () => `guest_${Date.now()}_${Math.random()}`);
  
  const handleLogout = useCallback(async () => {
      await supabase.auth.signOut();
      setSession(null);
      setProfile(null);
      setCurrentUser(GUEST_USER);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const manageProfile = async () => {
        if (session?.user) {
            try {
                // 1. Try to fetch the profile
                let { data: profileData, error: fetchError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                // 2. If profile doesn't exist (e.g., first login), create it
                if (fetchError && fetchError.code === 'PGRST116') { // PGRST116 = "The result contains 0 rows"
                    console.log('Profil tidak ditemukan, membuat profil baru...');
                    const { data: newProfile, error: insertError } = await supabase
                        .from('profiles')
                        .insert({
                            id: session.user.id,
                            display_name: session.user.user_metadata?.full_name || session.user.email || 'Pengguna Baru'
                        })
                        .select()
                        .single();
                    
                    if (insertError) {
                        throw insertError; // Throw error to be caught by the catch block
                    }
                    
                    profileData = newProfile; // Use the newly created profile data
                } else if (fetchError) {
                    throw fetchError; // Throw other types of fetch errors
                }

                // 3. Set the profile and current user state
                if (profileData) {
                    setProfile(profileData);
                    setCurrentUser(profileData.display_name || 'User');
                } else {
                    // This case is unlikely but serves as a fallback
                    const fallbackName = session.user.user_metadata?.full_name || session.user.email || 'User';
                    setCurrentUser(fallbackName);
                    setProfile(null);
                }

            } catch (error) {
                console.error("Terjadi kesalahan saat mengelola profil:", error);
                alert("Gagal memuat atau membuat profil Anda. Anda tetap login, namun beberapa fitur mungkin tidak bekerja dengan benar.");
                
                // Fallback to session data for display name, but keep user logged in.
                const fallbackName = session.user.user_metadata?.full_name || session.user.email || 'User';
                setCurrentUser(fallbackName);
                setProfile(null);
            }
        } else {
            // No session, user is a guest.
            setProfile(null);
            setCurrentUser(GUEST_USER);
        }
    };

    manageProfile();
  }, [session]);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: guidesData, error: guidesError } = await supabase.from('guides').select('*').order('created_at', { ascending: false });
        if (guidesError) throw guidesError;
        setGuides(guidesData.map((g: any) => ({ 
            ...g, 
            map: g.map_url, 
            user: g.is_user_contribution,
            author: g.is_user_contribution ? g.author : ADMIN_USER
        })));

        const { data: threadsData, error: threadsError } = await supabase.from('threads').select('*, posts(*, author:author)').order('created_at', { ascending: false });
        if (threadsError) throw threadsError;
        
        setThreads(threadsData.map((t: any) => ({
            ...t,
            category: t.category || 'Umum',
            greenVotes: t.green_votes || [],
            yellowVotes: t.yellow_votes || [],
            redVotes: t.red_votes || [],
            reports: t.reports || [],
            posts: t.posts.map((p: any) => ({...p, text: p.content, reports: p.reports || []})).sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        })));
        
      } catch (error) {
        console.error("Error fetching data:", error);
        alert('Gagal memuat data dari server.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredGuides = useMemo(() => {
    return guides
      .filter(g => g.status === 'approved')
      .filter((g) => (cityFilter === "All" ? true : g.city === cityFilter))
      .filter((g) => (categoryFilter === "All" ? true : g.category === categoryFilter))
      .filter((g) =>
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.steps.join(" ").toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [guides, cityFilter, categoryFilter, searchQuery]);

  const filteredThreads = useMemo(() => {
      return threads.filter(t => (threadCategoryFilter === "All" ? true : t.category === threadCategoryFilter));
  }, [threads, threadCategoryFilter]);

  useEffect(() => {
    setVisibleGuidesCount(GUIDES_PER_PAGE);
  }, [cityFilter, categoryFilter, searchQuery]);

  const guidesToShow = useMemo(() => filteredGuides.slice(0, visibleGuidesCount), [filteredGuides, visibleGuidesCount]);

  const handleLoadMoreGuides = () => setVisibleGuidesCount(prev => prev + GUIDES_PER_PAGE);

  const handleOpenDetail = useCallback(async (id: string) => {
    const guide = guides.find((g) => g.id === id);
    if (guide) {
      const newViews = (guide.views || 0) + 1;
      const { error } = await supabase.from('guides').update({ views: newViews }).eq('id', id);
      if (error) console.error("Error updating views:", error);
      else setGuides(prev => prev.map(g => g.id === id ? { ...g, views: newViews } : g));
      setSelectedGuide({ ...guide, views: newViews });
    }
  }, [guides]);

  const handleCloseDetail = () => setSelectedGuide(null);
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedGuide(null); 
    setSelectedThread(null);
  };

  const handleEnterAdminMode = () => {
    setIsAdminMode(true);
    setCurrentUser(ADMIN_USER);
    alert('Mode Admin diaktifkan!');
  };
  
  const handleAdminLogout = useCallback(() => {
    if (window.confirm('Anda yakin ingin keluar dari Mode Admin?')) {
        setIsAdminMode(false);
        setCurrentUser(session && profile ? profile.display_name : GUEST_USER);
        setActiveTab('Explorer');
        alert('Mode Admin dinonaktifkan.');
    }
  }, [session, profile]);

  const handleAdminLoginSubmit = (password: string): boolean => {
      if (password === 'adminjabo1') {
          handleEnterAdminMode();
          setIsAdminLoginModalOpen(false);
          return true;
      }
      return false;
  };

  const handleOpenContributionModal = (guideToEdit: Guide | null = null) => {
      if (guideToEdit) {
          setEditingGuide(guideToEdit);
          setContribution({
              title: guideToEdit.title, author: guideToEdit.author || '', city: guideToEdit.city,
              category: guideToEdit.category, stepsText: guideToEdit.steps.join('\n'),
              tipsText: guideToEdit.tips.join('\n'), cost: guideToEdit.cost,
          });
      } else {
          setEditingGuide(null);
          setContribution({ title: "", author: currentUser, city: "Jakarta", category: "Transport", stepsText: "", tipsText: "", cost: "" });
      }
      setSelectedGuide(null);
      setIsContributionModalOpen(true);
  };

  const handleCloseContributionModal = () => {
      setIsContributionModalOpen(false);
      setEditingGuide(null);
      setContribution({ title: "", author: "", city: "Jakarta", category: "Transport", stepsText: "", tipsText: "", cost: "" });
  };
  
  const handleResetContributionForm = () => {
    const defaultAuthor = editingGuide ? contribution.author : currentUser;
    setContribution({
      title: "",
      author: defaultAuthor,
      city: "Jakarta",
      category: "Transport",
      stepsText: "",
      tipsText: "",
      cost: "",
    });
  };

  const handleSubmitContribution = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!contribution.title.trim() || !contribution.stepsText.trim() || !contribution.author.trim()) {
        alert('Mohon isi semua kolom yang wajib diisi (Judul, Nama, dan Langkah-langkah).');
        return;
    }

    const guideData = {
        title: contribution.title || "Panduan dari Netizen",
        author: contribution.author.trim() || "Anonim",
        city: contribution.city || "Jakarta",
        category: contribution.category || "Transport",
        cost: contribution.cost || "—",
        steps: contribution.stepsText ? contribution.stepsText.split("\n").map((s) => s.trim()).filter(Boolean) : [],
        tips: contribution.tipsText ? contribution.tipsText.split("\n").map((s) => s.trim()).filter(Boolean) : [],
    };

    if (editingGuide) {
        const originalGuides = guides;
        const optimisticUpdate = { ...editingGuide, ...guideData };
        setGuides(guides.map(g => g.id === editingGuide.id ? optimisticUpdate : g));
        handleCloseContributionModal();
        
        const { error } = await supabase.rpc('handle_edit_guide', {
            guide_id_in: editingGuide.id,
            update_data: guideData
        });

        if (error) {
            alert(`Error: ${error.message}\nPerubahan gagal disimpan. Mengembalikan data...`);
            setGuides(originalGuides);
        } else {
            alert("Panduan berhasil diperbarui!");
        }
    } else {
        const isAdmin = currentUser === ADMIN_USER;
        const newGuidePayload = {
            ...guideData,
            id: `user-${Date.now()}`,
            difficulty: "Pemula",
            duration: "—",
            map_url: "https://www.google.com/maps",
            is_user_contribution: !isAdmin,
            views: 0,
            status: isAdmin ? 'approved' : 'pending',
        };
        const { data, error } = await supabase.from('guides').insert(newGuidePayload).select().single();
        if (error) {
            alert(`Error: ${error.message}`);
            handleCloseContributionModal();
        } else {
            const newGuide = { ...data, map: data.map_url, user: data.is_user_contribution, author: data.is_user_contribution ? data.author : ADMIN_USER };
            setGuides([newGuide, ...guides]);
            if (isAdmin) {
                setActiveTab("Explorer");
                alert("Panduan berhasil dibuat dan langsung dipublikasikan.");
            } else {
                setActiveTab("Panduan Netizen");
                alert("Kontribusi berhasil dikirim dan sedang menunggu tinjauan admin.");
            }
            handleCloseContributionModal();
        }
    }
  };
  
  const handleApproveGuide = async (guideId: string) => {
    const { error } = await supabase.from('guides').update({ status: 'approved' }).eq('id', guideId);
    if (error) alert(`Error: ${error.message}`);
    else {
        setGuides(guides.map(g => g.id === guideId ? { ...g, status: 'approved' } : g));
        alert('Panduan telah disetujui dan dipublikasikan.');
    }
  };

  const handleDeleteGuide = async (guideId: string) => {
      if (window.confirm('Anda yakin ingin menghapus panduan ini?')) {
          const { error } = await supabase.rpc('handle_delete_guide', { guide_id_in: guideId });
          if (error) {
              alert(`Error: ${error.message}`);
          } else {
              setGuides(guides.filter(g => g.id !== guideId));
              setSelectedGuide(null);
              alert('Panduan telah dihapus.');
          }
      }
  };

  const handleCreateThread = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!threadForm.title.trim() || !threadForm.text.trim()) {
        alert('Judul diskusi dan pesan pertama tidak boleh kosong.');
        return;
    }
    if (!session && !isAdminMode) {
        alert('Anda harus login untuk membuat diskusi.');
        return;
    }

    const threadId = `th-${Date.now()}`;
    const { data: threadData, error: threadError } = await supabase.from('threads').insert({
        id: threadId, 
        title: threadForm.title, 
        category: threadForm.category,
        green_votes: [], 
        yellow_votes: [], 
        red_votes: [], 
        reports: []
    }).select().single();

    if (threadError) { alert(`Error: ${threadError.message}`); return; }

    const { data: postData, error: postError } = await supabase.from('posts').insert({
        id: `p-${Date.now()}`, 
        thread_id: threadId, 
        author: currentUser, 
        content: threadForm.text, 
        reports: []
    }).select().single();

    if (postError) { alert(`Error: ${postError.message}`); return; }

    const newThread = { 
        ...threadData, 
        category: threadData.category,
        greenVotes: [], 
        yellowVotes: [], 
        redVotes: [], 
        reports: [], 
        posts: [{...postData, text: postData.content, reports: []}] 
    };
    setThreads([newThread, ...threads]);
    setThreadForm({ title: "", text: "", category: "Umum" });
    setIsThreadModalOpen(false);
    alert("Thread baru berhasil dibuat!");
  };

  const handleDeleteThread = async (threadId: string) => {
    if (window.confirm('ADMIN: Anda yakin ingin menghapus thread ini secara permanen?')) {
      const { error } = await supabase.rpc('handle_delete_thread', { thread_id_in: threadId });
      if (error) {
          alert(`Error: ${error.message}`);
      } else {
          setThreads(threads.filter(t => t.id !== threadId));
          setSelectedThread(null);
          alert('Thread telah dihapus.');
      }
    }
  };
  
  const handleOpenThreadDetail = async (threadId: string) => {
    const thread = threads.find(t => t.id === threadId);
    if(thread) {
        const newViews = thread.views + 1;
        await supabase.from('threads').update({ views: newViews }).eq('id', threadId);
        setThreads(prev => prev.map(t => t.id === threadId ? { ...t, views: newViews } : t));
        setSelectedThread({ ...thread, views: newViews });
    }
  };

  const handleCloseThreadDetail = () => setSelectedThread(null);
  
  const handleAddPost = async (threadId: string, text: string) => {
    if (!text.trim()) {
        alert('Komentar tidak boleh kosong.');
        return;
    }
    if (!session && !isAdminMode) {
        alert('Anda harus login untuk berkomentar.');
        return;
    }
    
    const { data, error } = await supabase.from('posts').insert({
        id: `p-${Date.now()}`, thread_id: threadId, author: currentUser, content: text, reports: []
    }).select().single();

    if(error) { alert(`Error: ${error.message}`); return; }
    
    const newPost: Post = { ...data, text: data.content, reports: data.reports || [] };
    setThreads(threads.map(t => t.id === threadId ? { ...t, posts: [...t.posts, newPost] } : t));
    if(selectedThread?.id === threadId) setSelectedThread(t => t ? ({...t, posts: [...t.posts, newPost]}): null);
  };

  const handleEditPost = async (threadId: string, postId: string, newText: string) => {
    if (!newText.trim()) {
        alert('Komentar tidak boleh kosong.');
        return;
    }
    
    const originalThreads = [...threads];
    const updatedThreads = threads.map(t => 
        t.id === threadId 
        ? { ...t, posts: t.posts.map(p => p.id === postId ? { ...p, text: newText } : p) } 
        : t
    );
    setThreads(updatedThreads);
    if(selectedThread?.id === threadId) {
        setSelectedThread(t => t ? ({...t, posts: t.posts.map(p => p.id === postId ? { ...p, text: newText } : p) }) : null);
    }

    const { error } = await supabase.rpc('handle_edit_post', {
        post_id_in: postId,
        new_content_in: newText
    });

    if(error) { 
        alert(`Error: ${error.message}\nPerubahan gagal disimpan.`);
        setThreads(originalThreads); // Revert on failure
    }
  };

  const handleDeletePost = async (threadId: string, postId: string, skipConfirm = false) => {
    const thread = threads.find(t => t.id === threadId);
    if(thread && thread.posts.length <= 1) { alert("Tidak bisa menghapus satu-satunya post."); return; }
    if (!skipConfirm && !window.confirm('Anda yakin ingin menghapus post ini?')) return;
     
    const { error } = await supabase.rpc('handle_delete_post', { post_id_in: postId });
    if(error) { 
        alert(`Error: ${error.message}`); 
        return; 
    }

    setThreads(threads.map(t => t.id === threadId ? { ...t, posts: t.posts.filter(p => p.id !== postId) } : t));
    if(selectedThread?.id === threadId) setSelectedThread(t => t ? ({...t, posts: t.posts.filter(p => p.id !== postId) }) : null);
    if(skipConfirm) alert('Komentar telah dihapus secara otomatis karena melebihi batas laporan.');
  };

  const handleVote = async (threadId: string, voteType: 'green' | 'yellow' | 'red') => {
    const thread = threads.find(t => t.id === threadId);
    if (!thread) return;

    const originalThreads = threads;
    const originalSelectedThread = selectedThread;
    const currentVoterId = session?.user?.id || voterId;

    const voteArrays = {
        green: [...(thread.greenVotes || [])],
        yellow: [...(thread.yellowVotes || [])],
        red: [...(thread.redVotes || [])],
    };
    
    const userVotedThisType = voteArrays[voteType].includes(currentVoterId);

    (['green', 'yellow', 'red'] as const).forEach(type => {
        const index = voteArrays[type].indexOf(currentVoterId);
        if (index > -1) {
            voteArrays[type].splice(index, 1);
        }
    });

    if (!userVotedThisType) {
        voteArrays[voteType].push(currentVoterId);
    }
    
    const updatedThread = { 
        ...thread,
        greenVotes: voteArrays.green,
        yellowVotes: voteArrays.yellow,
        redVotes: voteArrays.red,
    };
    
    setThreads(threads.map(t => t.id === threadId ? updatedThread : t));
    if (selectedThread?.id === threadId) {
        setSelectedThread(updatedThread);
    }

    // Persist change to database using an RPC function for security and reliability
    const { error } = await supabase.rpc('handle_thread_vote', {
        thread_id_in: threadId,
        vote_type_in: voteType,
        voter_id_in: currentVoterId
    });

    if (error) {
        console.error("Error voting via RPC:", error);
        alert(`Gagal menyimpan suara Anda. Perubahan akan dibatalkan.`);
        setThreads(originalThreads);
        if (originalSelectedThread && originalSelectedThread.id === threadId) {
            setSelectedThread(originalSelectedThread);
        }
    }
  };
  
  const handleOpenReportModal = (type: 'thread' | 'post', threadId: string, postId?: string) => {
    setReportTarget({ type, threadId, postId });
    setIsReportModalOpen(true);
  };
  
  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
    setReportTarget(null);
  };
  
  const handleSubmitReport = async (reason: string) => {
    if (!reportTarget) return;
    const { type, threadId, postId } = reportTarget;
    const currentVoterId = session?.user?.id || voterId;

    if (type === 'thread') {
        const thread = threads.find(t => t.id === threadId);
        if (!thread || thread.reports.includes(currentVoterId)) return;

        const newReports = [...thread.reports, currentVoterId];
        const { error } = await supabase.from('threads').update({ reports: newReports }).eq('id', threadId);

        if (error) { alert(`Error: ${error.message}`); }
        else {
            setThreads(threads.map(t => t.id === threadId ? { ...t, reports: newReports } : t));
            alert('Terima kasih atas laporan Anda. Admin akan meninjaunya.');
        }

    } else if (type === 'post' && postId) {
        const thread = threads.find(t => t.id === threadId);
        const post = thread?.posts.find(p => p.id === postId);
        if (!thread || !post || post.reports.includes(currentVoterId)) return;

        const newReports = [...post.reports, currentVoterId];
        
        if (newReports.length >= 10) {
            await handleDeletePost(threadId, postId, true); // skip confirmation
        } else {
            const { error } = await supabase.from('posts').update({ reports: newReports }).eq('id', postId);
            if (error) { alert(`Error: ${error.message}`); return; }

            const updatedPosts = thread.posts.map(p => p.id === postId ? { ...p, reports: newReports } : p);
            const updatedThreads = threads.map(t => t.id === threadId ? { ...t, posts: updatedPosts } : t);
            setThreads(updatedThreads);
            if (selectedThread?.id === threadId) {
                setSelectedThread(st => st ? { ...st, posts: updatedPosts } : null);
            }
            alert('Terima kasih atas laporan Anda.');
        }
    }
    handleCloseReportModal();
  };
   
  const handleReportThread = (threadId: string) => {
    const thread = threads.find(t => t.id === threadId);
    if (!thread) return;
    const currentVoterId = session?.user?.id || voterId;
    if (thread.reports.includes(currentVoterId)) {
        alert('Anda sudah melaporkan diskusi ini.');
        return;
    }
    handleOpenReportModal('thread', threadId);
  };

  const handleReportPost = (threadId: string, postId: string) => {
    const thread = threads.find(t => t.id === threadId);
    const post = thread?.posts.find(p => p.id === postId);
    if (!thread || !post) return;
    const currentVoterId = session?.user?.id || voterId;
    if (post.reports.includes(currentVoterId)) {
        alert('Anda sudah melaporkan komentar ini.');
        return;
    }
    handleOpenReportModal('post', threadId, postId);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) console.error("Error logging in:", error);
  };

  const TABS = useMemo(() => {
    const baseTabs = ['Explorer', 'Panduan Netizen', 'Forum', 'About'];
    if (isAdminMode) return [...baseTabs, 'Admin'];
    return baseTabs;
  }, [isAdminMode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200">
        <div className="text-center">
            <h1 className="text-2xl font-bold">Memuat Jabodetabek Way...</h1>
            <p className="text-gray-400">Menyambungkan ke server...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col">
      <Header 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        tabs={TABS} 
        onOpenAdminLoginModal={() => setIsAdminLoginModalOpen(true)}
        session={session}
        onLogin={handleGoogleLogin}
        onLogout={handleLogout}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow pt-24 pb-20 md:py-8">
        {/* Render tab content based on activeTab */}
        {activeTab === 'Explorer' && <ExplorerTab guides={guidesToShow} totalGuidesCount={filteredGuides.length} onLoadMore={handleLoadMoreGuides} onOpenDetail={handleOpenDetail} cityFilter={cityFilter} setCityFilter={setCityFilter} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>}
        {activeTab === 'Panduan Netizen' && <ContributionTab guides={guides} currentUser={currentUser} adminUser={ADMIN_USER} onOpenContributionModal={() => handleOpenContributionModal()} onOpenDetail={handleOpenDetail} onEdit={handleOpenContributionModal} onDelete={handleDeleteGuide} session={session} isAdminMode={isAdminMode} />}
        {activeTab === 'Forum' && <ForumTab threads={filteredThreads} voterId={session?.user?.id || voterId} session={session} isAdminMode={isAdminMode} onOpenThreadModal={() => setIsThreadModalOpen(true)} onOpenThreadDetail={handleOpenThreadDetail} onVote={handleVote} onReport={handleReportThread} threadCategoryFilter={threadCategoryFilter} setThreadCategoryFilter={setThreadCategoryFilter} />}
        {activeTab === 'About' && <AboutTab />}
        {activeTab === 'Admin' && isAdminMode && <AdminTab guides={guides} threads={threads} onApproveGuide={handleApproveGuide} onDeleteGuide={handleDeleteGuide} onDeleteThread={handleDeleteThread} onAdminLogout={handleAdminLogout}/>}
      </main>
      <Footer onOpenTerms={() => setIsTermsModalOpen(true)} onOpenPrivacy={() => setIsPrivacyModalOpen(true)} />
      {selectedGuide && <GuideDetailModal guide={selectedGuide} onClose={handleCloseDetail} currentUser={currentUser} adminUser={ADMIN_USER} onEdit={handleOpenContributionModal} onDelete={handleDeleteGuide}/>}
      {selectedThread && <ForumThreadModal thread={selectedThread} onClose={handleCloseThreadDetail} onAddPost={handleAddPost} onEditPost={handleEditPost} onDeletePost={handleDeletePost} onVote={handleVote} onReport={handleReportThread} onReportPost={handleReportPost} currentUser={currentUser} voterId={session?.user?.id || voterId} adminUser={ADMIN_USER} session={session} isAdminMode={isAdminMode}/>}
      {isContributionModalOpen && (() => {
        const previewGuide: Guide = {
            id: editingGuide?.id || 'preview-id',
            title: contribution.title || 'Judul Panduan Anda',
            author: contribution.author,
            city: contribution.city,
            category: contribution.category,
            difficulty: "Pemula",
            duration: "—",
            cost: contribution.cost || "—",
            steps: contribution.stepsText.split("\n").map(s => s.trim()).filter(Boolean),
            tips: contribution.tipsText.split("\n").map(s => s.trim()).filter(Boolean),
            map: "https://www.google.com/maps",
            user: true,
            views: editingGuide?.views || 0,
            status: editingGuide?.status || 'pending',
        };

        return (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={handleCloseContributionModal}>
                <div className="bg-gray-800 text-gray-200 w-full max-w-6xl rounded-lg shadow-2xl border border-gray-700 h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                    <div className="p-6 border-b border-gray-700 flex-shrink-0">
                        <h3 className="text-xl font-bold text-gray-100">{editingGuide ? "Edit Panduan Anda" : "Formulir Kontribusi Panduan"}</h3>
                    </div>
                    <div className="flex-grow min-h-0 grid md:grid-cols-2 gap-x-6 p-6 overflow-hidden">
                        <form onSubmit={handleSubmitContribution} className="flex flex-col h-full overflow-hidden">
                            <div className="space-y-4 overflow-y-auto pr-4 flex-grow">
                                <input 
                                    required 
                                    value={contribution.author} 
                                    onChange={(e) => setContribution({...contribution, author: e.target.value})} 
                                    placeholder="Nama Kontributor" 
                                    disabled={!!session || currentUser === ADMIN_USER}
                                    className="w-full px-3 py-2 text-gray-100 bg-gray-700 border border-gray-600 rounded-md disabled:opacity-70 disabled:cursor-not-allowed placeholder:text-gray-400" 
                                />
                                <input 
                                    required 
                                    value={contribution.title} 
                                    onChange={(e) => setContribution({...contribution, title: e.target.value})} 
                                    placeholder="Judul panduan" 
                                    className="w-full px-3 py-2 text-gray-100 bg-gray-700 border border-gray-600 rounded-md placeholder:text-gray-400" 
                                />
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <select value={contribution.city} onChange={(e) => setContribution({...contribution, city: e.target.value as ContributionForm['city']})} className="w-full px-3 py-2 text-gray-100 bg-gray-700 border border-gray-600 rounded-md">
                                        {CITIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <select value={contribution.category} onChange={(e) => setContribution({...contribution, category: e.target.value as ContributionForm['category']})} className="w-full px-3 py-2 text-gray-100 bg-gray-700 border border-gray-600 rounded-md">
                                        {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <input value={contribution.cost} onChange={(e) => setContribution({...contribution, cost: e.target.value})} placeholder="Estimasi biaya" className="w-full px-3 py-2 text-gray-100 bg-gray-700 border border-gray-600 rounded-md placeholder:text-gray-400" />
                                </div>
                                <textarea 
                                    required 
                                    value={contribution.stepsText} 
                                    onChange={(e) => setContribution({...contribution, stepsText: e.target.value})} 
                                    placeholder="Langkah per baris (pisah enter)" 
                                    className="w-full px-3 py-2 text-gray-100 bg-gray-700 border border-gray-600 rounded-md h-32 placeholder:text-gray-400" 
                                />
                                <textarea 
                                    value={contribution.tipsText} 
                                    onChange={(e) => setContribution({...contribution, tipsText: e.target.value})} 
                                    placeholder="Tips (opsional, per baris)" 
                                    className="w-full px-3 py-2 text-gray-100 bg-gray-700 border border-gray-600 rounded-md h-24 placeholder:text-gray-400" 
                                />
                            </div>
                            <div className="pt-6 flex-shrink-0">
                                <p className="text-xs text-gray-500 mb-3">
                                    Dengan mengirimkan, Anda setuju pada <button type="button" onClick={() => { setIsContributionModalOpen(false); setIsTermsModalOpen(true); }} className="underline hover:text-gray-300">Syarat & Ketentuan</button> kami dan menjamin konten tidak mengandung unsur SARA atau melanggar hukum.
                                </p>
                                <div className="flex gap-3">
                                    <button type="submit" className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition">{editingGuide ? 'Simpan Perubahan' : 'Kirim'}</button>
                                    <button type="button" onClick={handleResetContributionForm} className="px-4 py-2 border border-gray-600 text-gray-300 font-semibold rounded-md hover:bg-gray-700 transition">Reset</button>
                                    <button type="button" onClick={handleCloseContributionModal} className="ml-auto px-4 py-2 text-gray-400 hover:text-white rounded-md">Batal</button>
                                </div>
                            </div>
                        </form>
                        <div className="hidden md:block h-full overflow-y-auto">
                           <GuidePreview guide={previewGuide} />
                        </div>
                    </div>
                </div>
            </div>
        )
    })()}
      {isThreadModalOpen && (
         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setIsThreadModalOpen(false)}>
            <div className="bg-gray-800 w-full max-w-lg rounded-xl shadow-2xl border border-gray-700" onClick={(e) => e.stopPropagation()}>
               <form onSubmit={handleCreateThread} className="overflow-hidden rounded-xl">
                    <div className="p-6">
                         <h3 className="text-xl font-bold text-gray-100">Buat Thread Baru</h3>
                    </div>
                    <div className="px-6 pb-6 space-y-4">
                         <input required value={threadForm.title} onChange={(e) => setThreadForm({...threadForm, title: e.target.value})} placeholder="Judul Diskusi" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md" />
                         <select value={threadForm.category} onChange={(e) => setThreadForm({...threadForm, category: e.target.value as ThreadForm['category']})} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md">
                            {THREAD_CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                         <textarea required value={threadForm.text} onChange={(e) => setThreadForm({...threadForm, text: e.target.value})} placeholder="Pesan Pertama" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md h-28" />
                         <div className="flex flex-wrap gap-2">
                            {QUICK_SUGGESTIONS.map((suggestion) => (
                                <button
                                key={suggestion.text}
                                type="button"
                                onClick={() => setThreadForm(prev => ({ ...prev, text: (prev.text ? prev.text + ' ' : '') + suggestion.text }))}
                                className="px-3 py-1.5 text-xs bg-gray-600 text-gray-200 rounded-full hover:bg-gray-500 transition-colors"
                                >
                                {suggestion.text}
                                </button>
                            ))}
                        </div>
                    </div>
                     <div className="px-6 pb-2 text-xs text-gray-500">
                        <p>Dengan memposting, Anda setuju untuk mematuhi aturan komunitas, tidak menyebarkan informasi palsu, dan menghindari konten SARA.</p>
                    </div>
                    <div className="px-6 py-4 bg-gray-900/50 border-t border-gray-700 flex gap-4">
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">Post</button>
                         <button type="button" onClick={() => setIsThreadModalOpen(false)} className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700">Batal</button>
                    </div>
                </form>
            </div>
        </div>
      )}
      {isReportModalOpen && reportTarget && (
        <ReportModal
          onClose={handleCloseReportModal}
          onSubmit={handleSubmitReport}
          type={reportTarget.type}
        />
      )}
      {isAdminLoginModalOpen && <AdminLoginModal onClose={() => setIsAdminLoginModalOpen(false)} onLogin={handleAdminLoginSubmit}/>}
      {isTermsModalOpen && <TermsModal onClose={() => setIsTermsModalOpen(false)} />}
      {isPrivacyModalOpen && <PrivacyModal onClose={() => setIsPrivacyModalOpen(false)} />}
    </div>
  );
}