import type { City, Category, ThreadCategory } from './types';

export const CITIES: Array<City | "All"> = ["All", "Jakarta", "Bogor", "Depok", "Tangerang", "Bekasi"];
export const CATEGORIES: Array<Category | "All"> = ["All", "Transport", "Wisata", "Belanja", "Kuliner", "Umum"];
export const THREAD_CATEGORIES: Array<ThreadCategory | "All"> = ["All", "Umum", "Kuliner", "Transportasi", "Lowongan Kerja", "Hiburan"];

export const QUICK_SUGGESTIONS = [
  { text: 'Setuju banget! 😊' },
  { text: 'Kurang setuju... 😥' },
  { text: 'Wkwkwk 😂' },
  { text: 'Info mantap! 🔥' },
  { text: 'Hmm... 🗿' },
];