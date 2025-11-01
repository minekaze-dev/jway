import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { CITIES, CATEGORIES } from './constants';
import type { Guide, Thread, ContributionForm, ThreadForm, City, Category, Post } from './types';
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
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);

  const [contribution, setContribution] = useState<ContributionForm>({ title: "", author: "", city: "Jakarta", category: "Transport", stepsText: "", tipsText: "", cost: "" });
  const [editingGuide, setEditingGuide] = useState<Guide | null>(null);
  const [threadForm, setThreadForm] = useState<ThreadForm>({ title: "", text: ""});

  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [isThreadModalOpen, setIsThreadModalOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(GUEST_USER);
  
  const [visibleGuidesCount, setVisibleGuidesCount] = useState(GUIDES_PER_PAGE);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: guidesData, error: guidesError } = await supabase.from('guides').select('*').order('created_at', { ascending: false });
        if (guidesError) throw guidesError;
        setGuides(guidesData.map((g: any) => ({ ...g, map: g.map_url, user: g.is_user_contribution })));

        const { data: threadsData, error: threadsError } = await supabase.from('threads').select('*, posts(*, author:author)').order('created_at', { ascending: false });
        if (threadsError) throw threadsError;
        
        setThreads(threadsData.map((t: any) => ({
            ...t,
            greenVotes: t.green_votes || [],
            yellowVotes: t.yellow_votes || [],
            redVotes: t.red_votes || [],
            reports: t.reports || [],
            posts: t.posts.map((p: any) => ({...p, text: p.content})).sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
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
        setCurrentUser(GUEST_USER);
        setActiveTab('Explorer');
        alert('Mode Admin dinonaktifkan.');
    }
  }, []);

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

  const handleSubmitContribution = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
        const { data, error } = await supabase.from('guides').update(guideData).eq('id', editingGuide.id).select().single();
        if (error) alert(`Error: ${error.message}`);
        else {
            const updatedGuide = { ...data, map: data.map_url, user: data.is_user_contribution };
            setGuides(guides.map(g => g.id === editingGuide.id ? updatedGuide : g));
            alert("Panduan berhasil diperbarui!");
        }
    } else {
        const newGuidePayload = {
            ...guideData,
            id: `user-${Date.now()}`,
            difficulty: "Pemula",
            duration: "—",
            map_url: "https://www.google.com/maps",
            is_user_contribution: true,
            views: 0,
            status: 'pending',
        };
        const { data, error } = await supabase.from('guides').insert(newGuidePayload).select().single();
        if (error) alert(`Error: ${error.message}`);
        else {
            const newGuide = { ...data, map: data.map_url, user: data.is_user_contribution };
            setGuides([newGuide, ...guides]);
            setActiveTab("Dari Netizen");
            alert("Kontribusi berhasil dikirim dan sedang menunggu tinjauan admin.");
        }
    }
    handleCloseContributionModal();
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
          const { error } = await supabase.from('guides').delete().eq('id', guideId);
          if (error) alert(`Error: ${error.message}`);
          else {
              setGuides(guides.filter(g => g.id !== guideId));
              setSelectedGuide(null);
              alert('Panduan telah dihapus.');
          }
      }
  };

  const handleCreateThread = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!threadForm.title.trim() || !threadForm.text.trim()) return;

    const threadId = `th-${Date.now()}`;
    const { data: threadData, error: threadError } = await supabase.from('threads').insert({
        id: threadId, title: threadForm.title, green_votes: [], yellow_votes: [], red_votes: [], reports: []
    }).select().single();

    if (threadError) { alert(`Error: ${threadError.message}`); return; }

    const { data: postData, error: postError } = await supabase.from('posts').insert({
        id: `p-${Date.now()}`, thread_id: threadId, author: currentUser, content: threadForm.text
    }).select().single();

    if (postError) { alert(`Error: ${postError.message}`); return; }

    const newThread = { ...threadData, greenVotes: [], yellowVotes: [], redVotes: [], reports: [], posts: [{...postData, text: postData.content}] };
    setThreads([newThread, ...threads]);
    setThreadForm({ title: "", text: "" });
    setIsThreadModalOpen(false);
    alert("Thread baru berhasil dibuat!");
  };

  const handleDeleteThread = async (threadId: string) => {
    if (window.confirm('ADMIN: Anda yakin ingin menghapus thread ini secara permanen?')) {
      const { error } = await supabase.from('threads').delete().eq('id', threadId);
      if (error) alert(`Error: ${error.message}`);
      else {
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
    if (!text.trim()) return;
    const { data, error } = await supabase.from('posts').insert({
        id: `p-${Date.now()}`, thread_id: threadId, author: currentUser, content: text
    }).select().single();

    if(error) { alert(`Error: ${error.message}`); return; }
    
    const newPost: Post = { ...data, text: data.content };
    setThreads(threads.map(t => t.id === threadId ? { ...t, posts: [...t.posts, newPost] } : t));
    if(selectedThread?.id === threadId) setSelectedThread(t => t ? ({...t, posts: [...t.posts, newPost]}): null);
  };

  const handleEditPost = async (threadId: string, postId: string, newText: string) => {
    if (!newText.trim()) return;
    const { error } = await supabase.from('posts').update({ content: newText }).eq('id', postId);
    if(error) { alert(`Error: ${error.message}`); return; }

    setThreads(threads.map(t => t.id === threadId ? { ...t, posts: t.posts.map(p => p.id === postId ? { ...p, text: newText } : p) } : t));
    if(selectedThread?.id === threadId) setSelectedThread(t => t ? ({...t, posts: t.posts.map(p => p.id === postId ? { ...p, text: newText } : p) }) : null);
  };

  const handleDeletePost = async (threadId: string, postId: string) => {
    const thread = threads.find(t => t.id === threadId);
    if(thread && thread.posts.length <= 1) { alert("Tidak bisa menghapus satu-satunya post."); return; }
    if (!window.confirm('Anda yakin ingin menghapus post ini?')) return;
     
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if(error) { alert(`Error: ${error.message}`); return; }

    setThreads(threads.map(t => t.id === threadId ? { ...t, posts: t.posts.filter(p => p.id !== postId) } : t));
    if(selectedThread?.id === threadId) setSelectedThread(t => t ? ({...t, posts: t.posts.filter(p => p.id !== postId) }) : null);
  };

  const handleVote = async (threadId: string, voteType: 'green' | 'yellow' | 'red') => {
    const thread = threads.find(t => t.id === threadId);
    if (!thread) return;

    let green = [...thread.greenVotes];
    let yellow = [...thread.yellowVotes];
    let red = [...thread.redVotes];
    const voteArrays = { green, yellow, red };
    
    const otherVoteTypes = (['green', 'yellow', 'red'] as const).filter(v => v !== voteType);
    otherVoteTypes.forEach(type => {
        const index = voteArrays[type].indexOf(currentUser);
        if (index > -1) voteArrays[type].splice(index, 1);
    });

    const currentVoteArray = voteArrays[voteType];
    const userIndex = currentVoteArray.indexOf(currentUser);
    if (userIndex > -1) currentVoteArray.splice(userIndex, 1);
    else currentVoteArray.push(currentUser);

    const { data, error } = await supabase.from('threads').update({
        green_votes: voteArrays.green, yellow_votes: voteArrays.yellow, red_votes: voteArrays.red
    }).eq('id', threadId).select().single();

    if(error) { alert(`Error: ${error.message}`); return; }

    const updatedThread = { ...data, greenVotes: data.green_votes, yellowVotes: data.yellow_votes, redVotes: data.red_votes, posts: thread.posts, reports: thread.reports };
    const updatedThreads = threads.map(t => t.id === threadId ? updatedThread : t);
    setThreads(updatedThreads);
    if (selectedThread?.id === threadId) setSelectedThread(updatedThread);
  };
  
   const handleReportThread = async (threadId: string) => {
    const thread = threads.find(t => t.id === threadId);
    if (!thread || thread.reports.includes(currentUser)) return;

    const newReports = [...thread.reports, currentUser];
    const { error } = await supabase.from('threads').update({ reports: newReports }).eq('id', threadId);

    if (error) { alert(`Error: ${error.message}`); return; }
    setThreads(threads.map(t => t.id === threadId ? { ...t, reports: newReports } : t));
    alert('Terima kasih atas laporan Anda. Admin akan meninjaunya.');
  };

  const TABS = useMemo(() => {
    const baseTabs = ['Explorer', 'Dari Netizen', 'Forum', 'About'];
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
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow pb-20 md:pb-8">
        {/* Render tab content based on activeTab */}
        {activeTab === 'Explorer' && <ExplorerTab guides={guidesToShow} totalGuidesCount={filteredGuides.length} onLoadMore={handleLoadMoreGuides} onOpenDetail={handleOpenDetail} cityFilter={cityFilter} setCityFilter={setCityFilter} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>}
        {activeTab === 'Dari Netizen' && <ContributionTab guides={guides} currentUser={currentUser} adminUser={ADMIN_USER} onOpenContributionModal={() => handleOpenContributionModal()} onOpenDetail={handleOpenDetail} onEdit={handleOpenContributionModal} onDelete={handleDeleteGuide} />}
        {activeTab === 'Forum' && <ForumTab threads={threads} currentUser={currentUser} isAdminMode={isAdminMode} onOpenThreadModal={() => setIsThreadModalOpen(true)} onOpenThreadDetail={handleOpenThreadDetail} onVote={handleVote} onReport={handleReportThread}/>}
        {activeTab === 'About' && <AboutTab />}
        {activeTab === 'Admin' && isAdminMode && <AdminTab guides={guides.filter(g => g.user)} threads={threads} onApproveGuide={handleApproveGuide} onDeleteGuide={handleDeleteGuide} onDeleteThread={handleDeleteThread} onAdminLogout={handleAdminLogout}/>}
      </main>
      <Footer />
      {selectedGuide && <GuideDetailModal guide={selectedGuide} onClose={handleCloseDetail} currentUser={currentUser} adminUser={ADMIN_USER} onEdit={handleOpenContributionModal} onDelete={handleDeleteGuide}/>}
      {selectedThread && <ForumThreadModal thread={selectedThread} onClose={handleCloseThreadDetail} onAddPost={handleAddPost} onEditPost={handleEditPost} onDeletePost={handleDeletePost} onVote={handleVote} onReport={handleReportThread} currentUser={currentUser} adminUser={ADMIN_USER}/>}
      {isContributionModalOpen && (
         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={handleCloseContributionModal}>
            <div className="bg-gray-800 w-full max-w-2xl rounded-xl shadow-2xl border border-gray-700" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmitContribution} className="overflow-hidden rounded-xl">
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-100">{editingGuide ? "Edit Panduan Anda" : "Formulir Kontribusi Panduan"}</h3>
                    </div>
                    <div className="px-6 pb-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <input required value={contribution.title} onChange={(e) => setContribution({...contribution, title: e.target.value})} placeholder="Judul Panduan" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md" />
                        <input required value={contribution.author} onChange={(e) => setContribution({...contribution, author: e.target.value})} placeholder="Nama Anda" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md" />
                        <select value={contribution.city} onChange={(e) => setContribution({...contribution, city: e.target.value as ContributionForm['city']})} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md">
                            {CITIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select value={contribution.category} onChange={(e) => setContribution({...contribution, category: e.target.value as ContributionForm['category']})} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md">
                            {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input value={contribution.cost} onChange={(e) => setContribution({...contribution, cost: e.target.value})} placeholder="Estimasi Biaya" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md" />
                        <textarea required value={contribution.stepsText} onChange={(e) => setContribution({...contribution, stepsText: e.target.value})} placeholder="Langkah-langkah (satu per baris)" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md h-32" />
                        <textarea value={contribution.tipsText} onChange={(e) => setContribution({...contribution, tipsText: e.target.value})} placeholder="Tips (opsional, satu per baris)" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md h-24" />
                    </div>
                     <div className="px-6 py-4 bg-gray-900/50 border-t border-gray-700 flex gap-4">
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">{editingGuide ? 'Simpan' : 'Kirim'}</button>
                        <button type="button" onClick={handleCloseContributionModal} className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700">Batal</button>
                    </div>
                </form>
            </div>
        </div>
      )}
      {isThreadModalOpen && (
         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setIsThreadModalOpen(false)}>
            <div className="bg-gray-800 w-full max-w-lg rounded-xl shadow-2xl border border-gray-700" onClick={(e) => e.stopPropagation()}>
               <form onSubmit={handleCreateThread} className="overflow-hidden rounded-xl">
                    <div className="p-6">
                         <h3 className="text-xl font-bold text-gray-100">Buat Thread Baru</h3>
                    </div>
                    <div className="px-6 pb-6 space-y-4">
                         <input required value={threadForm.title} onChange={(e) => setThreadForm({...threadForm, title: e.target.value})} placeholder="Judul Diskusi" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md" />
                         <textarea required value={threadForm.text} onChange={(e) => setThreadForm({...threadForm, text: e.target.value})} placeholder="Pesan Pertama" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md h-28" />
                    </div>
                    <div className="px-6 py-4 bg-gray-900/50 border-t border-gray-700 flex gap-4">
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">Post</button>
                         <button type="button" onClick={() => setIsThreadModalOpen(false)} className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700">Batal</button>
                    </div>
                </form>
            </div>
        </div>
      )}
      {isAdminLoginModalOpen && <AdminLoginModal onClose={() => setIsAdminLoginModalOpen(false)} onLogin={handleAdminLoginSubmit}/>}
    </div>
  );
}