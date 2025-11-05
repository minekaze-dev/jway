
export type City = "Jakarta" | "Bogor" | "Depok" | "Tangerang" | "Bekasi";
export type Category = "Transport" | "Wisata" | "Belanja" | "Kuliner" | "Umum";
export type ThreadCategory = "Umum" | "Kuliner" | "Transportasi" | "Lowongan Kerja" | "Hiburan";
export type ThreadStatus = 'trusted' | 'questionable' | 'danger';
export type GuideStatus = 'pending' | 'approved';

export interface Guide {
  id: string;
  title: string;
  author?: string;
  cities: City[];
  category: Category;
  difficulty: "Pemula" | "Menengah" | "Ahli";
  duration: string;
  cost: string;
  steps: string[];
  tips: string[];
  user?: boolean;
  views: number;
  status: GuideStatus;
  profile_id?: string;
  profile?: Profile;
}

export interface Post {
  id: string;
  author: { id: string | null; display_name: string; is_blocked?: boolean };
  text: string;
  reports: string[];
  profile_id?: string;
}

export interface Thread {
  id: string;
  title: string;
  category: ThreadCategory;
  posts: Post[];
  views: number;
  greenVotes: string[]; // Array of voter IDs for 'Trusted'
  yellowVotes: string[]; // Array of voter IDs for 'Questionable'
  redVotes: string[]; // Array of voter IDs for 'Danger'
  reports: string[]; // Array of voter IDs who reported
}

export interface ContributionForm {
    title: string;
    author: string;
    cities: City[];
    category: Category;
    stepsText: string;
    tipsText: string;
    cost: string;
}

export interface ThreadForm {
    title: string;
    text: string;
    category: ThreadCategory;
}

export interface Profile {
  id: string;
  display_name: string;
  is_blocked?: boolean;
}