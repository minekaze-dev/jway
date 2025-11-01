export type City = "Jakarta" | "Bogor" | "Depok" | "Tangerang" | "Bekasi";
export type Category = "Transport" | "Wisata" | "Belanja" | "Kuliner" | "Umum";
export type ThreadStatus = 'trusted' | 'questionable' | 'danger';
export type GuideStatus = 'pending' | 'approved';

export interface Guide {
  id: string;
  title: string;
  author?: string;
  city: City;
  category: Category;
  difficulty: "Pemula" | "Menengah" | "Ahli";
  duration: string;
  cost: string;
  steps: string[];
  tips: string[];
  map: string;
  user?: boolean;
  views: number;
  status: GuideStatus;
}

export interface Post {
  id: string;
  author: string;
  text: string;
}

export interface Thread {
  id: string;
  title: string;
  posts: Post[];
  views: number;
  greenVotes: string[]; // Array of usernames for 'Trusted'
  yellowVotes: string[]; // Array of usernames for 'Questionable'
  redVotes: string[]; // Array of usernames for 'Danger'
  reports: string[]; // Array of usernames who reported
}

export interface ContributionForm {
    title: string;
    author: string;
    city: City;
    category: Category;
    stepsText: string;
    tipsText: string;
    cost: string;
}

export interface ThreadForm {
    title: string;
    text: string;
}