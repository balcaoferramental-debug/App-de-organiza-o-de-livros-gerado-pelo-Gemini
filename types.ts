export enum Genre {
  FICTION = 'Ficção',
  NON_FICTION = 'Não-Ficção',
  FANTASY = 'Fantasia',
  SCI_FI = 'Ficção Científica',
  MYSTERY = 'Mistério',
  ROMANCE = 'Romance',
  BIOGRAPHY = 'Biografia',
  SELF_HELP = 'Autoajuda',
  OTHER = 'Outro'
}

export interface ChapterSummary {
  id: string;
  chapterTitle: string;
  content: string;
}

export interface Quote {
  id: string;
  text: string;
  page: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string | null; // Base64 string
  releaseDate: string;
  genre: Genre;
  totalPages: number;
  currentPage: number;
  rating: number; // 0 to 5
  generalSummary: string;
  chapterSummaries: ChapterSummary[];
  quotes: Quote[];
  createdAt: number;
}

export type ViewState = 'HOME' | 'ADD_BOOK' | 'BOOK_DETAIL';