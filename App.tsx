import React, { useState, useEffect, useRef } from 'react';
import { Book, Genre, ViewState, ChapterSummary, Quote, GlossaryEntry } from './types';
import { RetroPanel, RetroButton, RetroInput, RetroTextarea, RetroSelect, RetroProgressBar, RetroInset } from './components/RetroUI';
import StarRating from './components/StarRating';
import { Plus, BookOpen, Search, ArrowLeft, Trash2, Image as ImageIcon, Book as BookIcon, Minimize, Maximize, X, Moon, Sun, Calendar } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'diary_95_books';
const THEME_KEY = 'diary_95_theme';

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [view, setView] = useState<ViewState>('HOME');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [filterGenre, setFilterGenre] = useState<string>('ALL');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // --- Initial Load ---
  useEffect(() => {
    const storedBooks = localStorage.getItem(STORAGE_KEY);
    if (storedBooks) {
      try {
        setBooks(JSON.parse(storedBooks));
      } catch (e) {
        console.error("Failed to load books", e);
      }
    }

    const storedTheme = localStorage.getItem(THEME_KEY);
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }, [books]);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem(THEME_KEY, 'light');
    }
  };

  const handleAddBook = (book: Book) => {
    setBooks(prev => [book, ...prev]);
    setView('HOME');
  };

  const handleUpdateBook = (updatedBook: Book) => {
    setBooks(prev => prev.map(b => b.id === updatedBook.id ? updatedBook : b));
  };

  const handleDeleteBook = (id: string) => {
    if (confirm("Tem certeza que deseja deletar este livro? Esta ação é irreversível.")) {
      setBooks(prev => prev.filter(b => b.id !== id));
      setView('HOME');
      setSelectedBookId(null);
    }
  };

  const selectedBook = books.find(b => b.id === selectedBookId);

  return (
    <div className="h-screen w-full bg-[var(--bg-chrome)] text-[var(--text-chrome)] flex flex-col font-sans overflow-hidden border-t-2 border-l-2 border-[var(--border-light)] border-r-2 border-b-2 border-[var(--border-dark)]">
      
      {/* App Title Bar */}
      <div className="bg-[var(--highlight)] text-[var(--highlight-text)] px-2 py-1 font-bold text-sm flex justify-between items-center select-none shrink-0">
        <div className="flex items-center gap-2">
          <BookIcon size={16} className="text-white drop-shadow-sm" />
          <span className="tracking-wide">Meu Diário de Leitura 95</span>
        </div>
        
        {/* Decorative Window Controls */}
        <div className="flex gap-1">
          <button className="bg-[var(--bg-chrome)] text-[var(--text-chrome)] w-5 h-5 flex items-center justify-center border-t-[var(--border-light)] border-l-[var(--border-light)] border-b-[var(--border-dark)] border-r-[var(--border-dark)] border-2 active:border-t-[var(--border-dark)] active:border-l-[var(--border-dark)] active:border-b-[var(--border-light)] active:border-r-[var(--border-light)]">
            <Minimize size={10} strokeWidth={4} />
          </button>
          <button className="bg-[var(--bg-chrome)] text-[var(--text-chrome)] w-5 h-5 flex items-center justify-center border-t-[var(--border-light)] border-l-[var(--border-light)] border-b-[var(--border-dark)] border-r-[var(--border-dark)] border-2 active:border-t-[var(--border-dark)] active:border-l-[var(--border-dark)] active:border-b-[var(--border-light)] active:border-r-[var(--border-light)]">
            <Maximize size={10} strokeWidth={4} />
          </button>
          <button className="bg-[var(--bg-chrome)] text-[var(--text-chrome)] w-5 h-5 flex items-center justify-center border-t-[var(--border-light)] border-l-[var(--border-light)] border-b-[var(--border-dark)] border-r-[var(--border-dark)] border-2 active:border-t-[var(--border-dark)] active:border-l-[var(--border-dark)] active:border-b-[var(--border-light)] active:border-r-[var(--border-light)] ml-1">
            <X size={12} strokeWidth={4} />
          </button>
        </div>
      </div>

      {/* Menu Bar / Toolbar */}
      <div className="flex items-center justify-between p-1 border-b border-[var(--border-shadow)] shadow-sm shrink-0 bg-[var(--bg-chrome)]">
        <div className="flex gap-1">
          <span className="px-2 py-0.5 hover:bg-[var(--highlight)] hover:text-[var(--highlight-text)] cursor-default text-sm">Arquivo</span>
          <span className="px-2 py-0.5 hover:bg-[var(--highlight)] hover:text-[var(--highlight-text)] cursor-default text-sm">Editar</span>
          <span className="px-2 py-0.5 hover:bg-[var(--highlight)] hover:text-[var(--highlight-text)] cursor-default text-sm">Exibir</span>
          <span className="px-2 py-0.5 hover:bg-[var(--highlight)] hover:text-[var(--highlight-text)] cursor-default text-sm">Ajuda</span>
        </div>
        <button onClick={toggleTheme} className="px-2 py-0.5 text-xs border border-[var(--border-shadow)] hover:bg-[var(--border-shadow)] hover:text-[var(--highlight-text)] flex items-center gap-1 transition-colors">
          {isDarkMode ? <Sun size={12} /> : <Moon size={12} />}
          {isDarkMode ? "Modo Claro" : "Modo Escuro"}
        </button>
      </div>

      {/* Main Action Bar */}
      <div className="flex gap-2 p-2 border-b-[var(--border-light)] border-b-2 border-t-[var(--border-shadow)] border-t shrink-0">
        <RetroButton onClick={() => setView('HOME')} disabled={view === 'HOME' && !selectedBookId}>
          <div className="flex items-center gap-1">
            <BookOpen size={16} />
            Minha Estante
          </div>
        </RetroButton>
        <RetroButton onClick={() => { setSelectedBookId(null); setView('ADD_BOOK'); }}>
          <div className="flex items-center gap-1">
            <Plus size={16} />
            Novo Livro
          </div>
        </RetroButton>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden p-2 bg-[var(--bg-chrome)]">
        <div className="h-full w-full border-t-[var(--border-shadow)] border-l-[var(--border-shadow)] border-b-[var(--border-light)] border-r-[var(--border-light)] border-2 p-1">
          <div className="h-full w-full overflow-hidden">
            {view === 'HOME' && (
              <HomeView 
                books={books} 
                onSelect={(id) => { setSelectedBookId(id); setView('BOOK_DETAIL'); }}
                filterGenre={filterGenre}
                setFilterGenre={setFilterGenre}
              />
            )}
            {view === 'ADD_BOOK' && (
              <AddBookView 
                onSave={handleAddBook} 
                onCancel={() => setView('HOME')} 
              />
            )}
            {view === 'BOOK_DETAIL' && selectedBook && (
              <BookDetailView 
                book={selectedBook} 
                onUpdate={handleUpdateBook} 
                onBack={() => setView('HOME')}
                onDelete={() => handleDeleteBook(selectedBook.id)}
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="bg-[var(--bg-chrome)] border-t-[var(--border-shadow)] border-t p-1 flex gap-2 text-xs shrink-0 select-none">
        <div className="flex-1 border-t-[var(--border-shadow)] border-l-[var(--border-shadow)] border-b-[var(--border-light)] border-r-[var(--border-light)] border inset-shadow px-2 py-0.5">
          {view === 'HOME' ? 'Pronto.' : view === 'ADD_BOOK' ? 'Modo de Edição' : `Visualizando: ${selectedBook?.title}`}
        </div>
        <div className="w-32 border-t-[var(--border-shadow)] border-l-[var(--border-shadow)] border-b-[var(--border-light)] border-r-[var(--border-light)] border inset-shadow px-2 py-0.5">
          Livros: {books.length}
        </div>
      </div>
    </div>
  );
};

// --- Sub-Views ---

const HomeView: React.FC<{ 
  books: Book[]; 
  onSelect: (id: string) => void;
  filterGenre: string;
  setFilterGenre: (g: string) => void;
}> = ({ books, onSelect, filterGenre, setFilterGenre }) => {
  
  const filteredBooks = books.filter(b => filterGenre === 'ALL' || b.genre === filterGenre);

  return (
    <div className="flex flex-col h-full bg-[var(--bg-chrome)]">
      <div className="flex items-center justify-between mb-2 p-2">
        <div className="flex items-center gap-2">
          <Search size={16} />
          <span className="font-bold text-sm">Filtrar por Gênero:</span>
          <RetroSelect 
            value={filterGenre} 
            onChange={(e) => setFilterGenre(e.target.value)}
            className="w-48"
          >
            <option value="ALL">Todos os Gêneros</option>
            {Object.values(Genre).map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </RetroSelect>
        </div>
        <div className="text-sm text-[var(--dimmed)]">
          {filteredBooks.length} objeto(s)
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-[var(--bg-inset)] border-t-[var(--border-dark)] border-l-[var(--border-dark)] border-b-[var(--border-light)] border-r-[var(--border-light)] border-2 mx-1 mb-1">
        {filteredBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[var(--dimmed)]">
            <BookOpen size={48} className="mb-2 opacity-20" />
            <p>Nenhum livro encontrado nesta estante.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filteredBooks.map(book => (
              <div 
                key={book.id}
                onClick={() => onSelect(book.id)}
                className="group cursor-pointer flex flex-col gap-2 items-center p-2 hover:bg-[var(--highlight)] hover:text-[var(--highlight-text)] border border-transparent hover:border-dotted hover:border-[var(--border-light)]"
              >
                <div className="relative w-full aspect-[2/3] bg-[var(--border-shadow)] border-t-[var(--border-light)] border-l-[var(--border-light)] border-b-[var(--border-dark)] border-r-[var(--border-dark)] border-2 shadow-md">
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[var(--highlight)] text-[var(--highlight-text)] p-2 text-center">
                      <span className="font-serif italic text-sm">{book.title}</span>
                    </div>
                  )}
                  {/* Spine effect */}
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-white/30 to-black/10 pointer-events-none"></div>
                </div>
                <div className="text-center px-1 w-full">
                  <h3 className="text-xs leading-tight line-clamp-2 mb-1">{book.title}</h3>
                  <div className="flex justify-center scale-75 origin-top">
                    <StarRating rating={book.rating} readOnly />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AddBookView: React.FC<{ onSave: (b: Book) => void; onCancel: () => void }> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Book>>({
    genre: Genre.FICTION,
    coverImage: null
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, coverImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.totalPages) return;

    const newBook: Book = {
      id: uuidv4(),
      title: formData.title,
      author: formData.author,
      description: formData.description || '',
      coverImage: formData.coverImage || null,
      releaseDate: formData.releaseDate || new Date().toISOString().split('T')[0],
      genre: formData.genre as Genre,
      totalPages: Number(formData.totalPages),
      currentPage: 0,
      rating: 0,
      generalSummary: '',
      chapterSummaries: [],
      quotes: [],
      glossary: [],
      targetFinishDate: formData.targetFinishDate,
      createdAt: Date.now()
    };

    onSave(newBook);
  };

  return (
    <div className="flex justify-center items-start h-full overflow-y-auto p-4">
      <RetroPanel className="w-full max-w-3xl">
        <div className="mb-4 pb-2 border-b-2 border-[var(--border-shadow)] flex justify-between items-center">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Plus size={20} /> Propriedades do Livro
          </h2>
          <RetroButton onClick={onCancel} className="text-xs">✕</RetroButton>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tabs simulation for form */}
          <div className="flex gap-1 border-b border-[var(--border-shadow)] mb-4">
             <div className="px-3 py-1 bg-[var(--bg-chrome)] border-t-[var(--border-light)] border-l-[var(--border-light)] border-r-[var(--border-dark)] border-2 border-b-0 -mb-[2px] pb-2 z-10 font-bold text-sm">Geral</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm">Título:</label>
              <RetroInput 
                required 
                value={formData.title || ''} 
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="Ex: Dom Casmurro"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm">Autor:</label>
              <RetroInput 
                required 
                value={formData.author || ''} 
                onChange={e => setFormData({...formData, author: e.target.value})}
                placeholder="Ex: Machado de Assis"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1 col-span-1 md:col-span-1">
              <label className="text-sm">Gênero:</label>
              <RetroSelect 
                value={formData.genre} 
                onChange={e => setFormData({...formData, genre: e.target.value as Genre})}
              >
                {Object.values(Genre).map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </RetroSelect>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm">Lançamento:</label>
              <RetroInput 
                type="date"
                value={formData.releaseDate || ''} 
                onChange={e => setFormData({...formData, releaseDate: e.target.value})}
              />
            </div>
             <div className="flex flex-col gap-1">
              <label className="text-sm">Páginas:</label>
              <RetroInput 
                type="number" 
                min="1"
                required
                value={formData.totalPages || ''} 
                onChange={e => setFormData({...formData, totalPages: Number(e.target.value)})}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm">Meta de Término:</label>
              <RetroInput 
                type="date"
                value={formData.targetFinishDate || ''} 
                onChange={e => setFormData({...formData, targetFinishDate: e.target.value})}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm">Descrição:</label>
            <RetroTextarea 
              rows={3}
              value={formData.description || ''} 
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="flex flex-col gap-1">
             <label className="text-sm">Capa:</label>
             <div className="flex items-center gap-4 border p-2 border-[var(--border-shadow)] border-dotted">
                <div className="w-16 h-24 bg-[var(--border-shadow)] border-2 border-[var(--border-shadow)] flex items-center justify-center overflow-hidden shrink-0">
                  {formData.coverImage ? (
                    <img src={formData.coverImage} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="text-[var(--dimmed)] w-8 h-8" />
                  )}
                </div>
                <div className="flex-1">
                   <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm w-full" />
                </div>
             </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <RetroButton type="button" onClick={onCancel}>Cancelar</RetroButton>
            <RetroButton type="submit" variant="primary">OK</RetroButton>
          </div>
        </form>
      </RetroPanel>
    </div>
  );
};

const BookDetailView: React.FC<{ book: Book; onUpdate: (b: Book) => void; onBack: () => void; onDelete: () => void }> = ({ book, onUpdate, onBack, onDelete }) => {
  const [activeTab, setActiveTab] = useState<'INFO' | 'CHAPTERS' | 'QUOTES' | 'SUMMARY' | 'GLOSSARY'>('INFO');
  
  // Local state for edits to avoid updating parent on every keystroke
  const [editedBook, setEditedBook] = useState<Book>(book);

  // Sync prop changes to local state
  useEffect(() => {
    setEditedBook(book);
  }, [book]);

  const saveChanges = (partial: Partial<Book>) => {
    const updated = { ...editedBook, ...partial };
    setEditedBook(updated);
    onUpdate(updated);
  };

  const calculateDailyGoal = (): string | null => {
    if (!editedBook.targetFinishDate) return null;
    
    const today = new Date();
    today.setHours(0,0,0,0);
    const target = new Date(editedBook.targetFinishDate);
    target.setHours(0,0,0,0);
    
    // Difference in milliseconds
    const diffTime = target.getTime() - today.getTime();
    // Difference in days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const pagesRemaining = editedBook.totalPages - editedBook.currentPage;
    
    if (pagesRemaining <= 0) return "Livro Concluído!";
    if (diffDays <= 0) return "Data meta expirada!";
    
    const dailyPages = Math.ceil(pagesRemaining / diffDays);
    return `${dailyPages} pág.`;
  };

  const dailyGoal = calculateDailyGoal();

  const handleAddQuote = (text: string, page: number) => {
    const newQuote: Quote = { id: uuidv4(), text, page };
    saveChanges({ quotes: [...editedBook.quotes, newQuote] });
  };

  const handleUpdateQuote = (id: string, text: string, page: number) => {
    const updatedQuotes = editedBook.quotes.map(q => q.id === id ? { ...q, text, page } : q);
    saveChanges({ quotes: updatedQuotes });
  }

  const handleAddChapter = (title: string, content: string) => {
    const newChapter: ChapterSummary = { id: uuidv4(), chapterTitle: title, content };
    saveChanges({ chapterSummaries: [...editedBook.chapterSummaries, newChapter] });
  };

  const handleUpdateChapter = (id: string, chapterTitle: string, content: string) => {
    const updatedChapters = editedBook.chapterSummaries.map(c => c.id === id ? { ...c, chapterTitle, content } : c);
    saveChanges({ chapterSummaries: updatedChapters });
  }

  const handleAddGlossary = (word: string, definition: string) => {
    const newEntry: GlossaryEntry = { id: uuidv4(), word, definition };
    const currentGlossary = editedBook.glossary || [];
    saveChanges({ glossary: [...currentGlossary, newEntry] });
  };

  const handleUpdateGlossary = (id: string, word: string, definition: string) => {
    const currentGlossary = editedBook.glossary || [];
    const updatedGlossary = currentGlossary.map(g => g.id === id ? { ...g, word, definition } : g);
    saveChanges({ glossary: updatedGlossary });
  };

  const handleDeleteGlossary = (id: string) => {
    const currentGlossary = editedBook.glossary || [];
    saveChanges({ glossary: currentGlossary.filter(g => g.id !== id) });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        saveChanges({ coverImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-2 px-1">
        <RetroButton onClick={onBack}>
          <div className="flex items-center gap-1">
            <ArrowLeft size={16} /> Voltar
          </div>
        </RetroButton>
        <div className="flex gap-2">
           <RetroButton onClick={onDelete}>
             <div className="flex items-center gap-1 text-red-800">
               <Trash2 size={16} />
             </div>
           </RetroButton>
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden p-1">
        {/* Left Sidebar: Cover & Quick Stats */}
        <div className="w-1/3 max-w-[250px] flex flex-col gap-4 overflow-y-auto">
           <RetroPanel className="flex flex-col items-center">
              <div className="w-full aspect-[2/3] bg-[var(--border-shadow)] border-2 border-[var(--border-shadow)] shadow-md mb-2 overflow-hidden relative group">
                {editedBook.coverImage ? (
                  <img src={editedBook.coverImage} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[var(--highlight)] text-[var(--highlight-text)]">No Cover</div>
                )}
                {/* Upload overlay */}
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                  <span className="text-white text-xs font-bold border border-white px-2 py-1">Alterar Capa</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
              <RetroInput 
                value={editedBook.title}
                onChange={(e) => saveChanges({ title: e.target.value })}
                className="w-full mb-1 text-center font-bold"
                placeholder="Título"
              />
              <RetroInput 
                value={editedBook.author}
                onChange={(e) => saveChanges({ author: e.target.value })}
                className="w-full mb-2 text-center text-xs"
                placeholder="Autor"
              />
              
              <div className="w-full bg-[var(--bg-inset)] bg-opacity-20 p-2 border-t border-[var(--border-shadow)]">
                <label className="text-xs font-bold block mb-1">Avaliação:</label>
                <div className="flex justify-center">
                  <StarRating 
                    rating={editedBook.rating} 
                    onRatingChange={(r) => saveChanges({ rating: r })} 
                  />
                </div>
              </div>
           </RetroPanel>

           <RetroPanel>
             <label className="text-xs font-bold block mb-1">Progresso:</label>
             <RetroProgressBar value={editedBook.currentPage} max={editedBook.totalPages} />
             <div className="flex justify-between items-center mt-2 text-xs">
                <span>Pág:</span>
                <input 
                  type="number" 
                  className="w-16 p-1 bg-[var(--bg-inset)] text-[var(--text-main)] border-2 border-[var(--border-shadow)] text-right"
                  value={editedBook.currentPage}
                  min={0}
                  max={editedBook.totalPages}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => saveChanges({ currentPage: Math.min(Number(e.target.value), editedBook.totalPages) })}
                />
                <span>/</span>
                 <input 
                  type="number" 
                  className="w-16 p-1 bg-[var(--bg-inset)] text-[var(--text-main)] border-2 border-[var(--border-shadow)] text-right"
                  value={editedBook.totalPages}
                  min={1}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => saveChanges({ totalPages: Number(e.target.value) })}
                />
             </div>
             
             <div className="border-t border-[var(--border-shadow)] my-3"></div>
             
             <label className="text-xs font-bold block mb-1">Meta de Término:</label>
             <div className="flex flex-col gap-2">
               <RetroInput 
                  type="date"
                  value={editedBook.targetFinishDate || ''}
                  onChange={(e) => saveChanges({ targetFinishDate: e.target.value })}
                  className="w-full text-xs"
               />
               
               {editedBook.targetFinishDate && (
                 <RetroInset className="bg-[var(--bg-inset)] p-1 text-center">
                    <span className="text-[10px] uppercase text-[var(--dimmed)] block">Meta Diária</span>
                    <span className="font-bold text-sm text-[var(--highlight)]">{dailyGoal}</span>
                 </RetroInset>
               )}
             </div>
           </RetroPanel>
        </div>

        {/* Right Content: Tabs */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
           {/* Tab Headers */}
           <div className="flex items-end pl-2 gap-1 border-b-2 border-[var(--border-light)] relative z-10">
             {[
               {id: 'INFO', label: 'Detalhes'},
               {id: 'SUMMARY', label: 'Resumo'},
               {id: 'CHAPTERS', label: 'Capítulos'},
               {id: 'QUOTES', label: 'Citações'},
               {id: 'GLOSSARY', label: 'Glossário'},
             ].map(tab => (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`
                   px-4 py-1 text-sm font-bold rounded-t-sm
                   border-t-2 border-l-2 border-r-2 
                   ${activeTab === tab.id 
                     ? 'bg-[var(--bg-chrome)] border-t-[var(--border-light)] border-l-[var(--border-light)] border-r-[var(--border-dark)] border-b-[var(--bg-chrome)] -mb-[2px] pb-2 z-20' 
                     : 'bg-[var(--bg-chrome)] text-[var(--text-chrome)] border-t-[var(--border-light)] border-l-[var(--border-light)] border-r-[var(--border-shadow)] border-b-[var(--border-light)] mb-0 mt-2 pb-1 hover:mt-1 z-0'}
                 `}
               >
                 {tab.label}
               </button>
             ))}
           </div>

           {/* Tab Content Container */}
           <div className="flex-1 bg-[var(--bg-chrome)] border-l-[var(--border-light)] border-t-[var(--border-light)] border-r-[var(--border-dark)] border-b-[var(--border-dark)] border-2 p-4 overflow-y-auto">
              
              {activeTab === 'INFO' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs font-bold text-[var(--dimmed)] block mb-1">Gênero</span>
                      <RetroSelect 
                        value={editedBook.genre} 
                        onChange={(e) => saveChanges({ genre: e.target.value as Genre })}
                      >
                        {Object.values(Genre).map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </RetroSelect>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[var(--dimmed)] block mb-1">Lançamento</span>
                      <RetroInput 
                        type="date"
                        value={editedBook.releaseDate}
                        onChange={(e) => saveChanges({ releaseDate: e.target.value })}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-xs font-bold text-[var(--dimmed)] block mb-1">Descrição</span>
                    <RetroTextarea 
                      value={editedBook.description || ""} 
                      onChange={(e) => saveChanges({ description: e.target.value })}
                      className="w-full h-32"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'SUMMARY' && (
                 <div className="h-full flex flex-col">
                   <label className="text-sm font-bold mb-2">Análise / Resumo Final</label>
                   <RetroTextarea 
                     className="flex-1 font-serif text-base leading-relaxed p-4"
                     value={editedBook.generalSummary}
                     placeholder="Escreva aqui suas impressões gerais sobre a obra..."
                     onChange={(e) => saveChanges({ generalSummary: e.target.value })}
                   />
                 </div>
              )}

              {activeTab === 'CHAPTERS' && (
                <div className="h-full flex flex-col">
                   <div className="flex justify-between items-center mb-2">
                     <h3 className="font-bold">Resumos por Capítulo</h3>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                     {editedBook.chapterSummaries.map((chapter) => (
                       <RetroPanel key={chapter.id} className="relative group">
                         <div className="flex justify-between items-center mb-2 border-b border-[var(--border-shadow)] pb-1">
                           <RetroInput 
                              value={chapter.chapterTitle} 
                              onChange={(e) => handleUpdateChapter(chapter.id, e.target.value, chapter.content)}
                              className="font-bold text-sm flex-1 mr-2"
                              placeholder="Título do Capítulo"
                           />
                           <button 
                             onClick={() => saveChanges({ chapterSummaries: editedBook.chapterSummaries.filter(c => c.id !== chapter.id) })}
                             className="text-red-600 hover:text-red-800 font-bold px-2"
                           >
                             ×
                           </button>
                         </div>
                         <RetroTextarea 
                            value={chapter.content}
                            onChange={(e) => handleUpdateChapter(chapter.id, chapter.chapterTitle, e.target.value)}
                            className="w-full text-sm"
                            rows={3}
                            placeholder="Conteúdo do capítulo..."
                         />
                       </RetroPanel>
                     ))}

                     {/* New Chapter Form */}
                     <div className="border-t-2 border-[var(--border-shadow)] pt-4 mt-4">
                       <h4 className="text-sm font-bold mb-2">Adicionar Novo Resumo</h4>
                       <NewChapterForm onAdd={handleAddChapter} />
                     </div>
                   </div>
                </div>
              )}

              {activeTab === 'QUOTES' && (
                <div className="h-full flex flex-col">
                  <h3 className="font-bold mb-2">Trechos Favoritos</h3>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
                     {editedBook.quotes.map((quote) => (
                       <div key={quote.id} className="bg-[var(--bg-inset)] border border-[var(--border-shadow)] p-3 shadow-sm relative group">
                          <RetroTextarea 
                            value={quote.text}
                            onChange={(e) => handleUpdateQuote(quote.id, e.target.value, quote.page)}
                            className="font-serif italic text-[var(--text-main)] mb-2 w-full bg-transparent border-none focus:bg-[var(--bg-chrome)]"
                            rows={2}
                          />
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold text-[var(--dimmed)]">Pág.</span>
                              <RetroInput 
                                type="number" 
                                value={quote.page} 
                                onChange={(e) => handleUpdateQuote(quote.id, quote.text, Number(e.target.value))}
                                className="w-16 h-6 text-xs"
                              />
                            </div>
                            <button 
                             onClick={() => saveChanges({ quotes: editedBook.quotes.filter(q => q.id !== quote.id) })}
                             className="text-red-600 text-xs hover:underline opacity-0 group-hover:opacity-100"
                           >
                             Remover
                           </button>
                          </div>
                       </div>
                     ))}
                  </div>
                  
                  <div className="border-t-2 border-[var(--border-shadow)] pt-2">
                    <NewQuoteForm onAdd={handleAddQuote} />
                  </div>
                </div>
              )}

              {activeTab === 'GLOSSARY' && (
                <div className="h-full flex flex-col">
                  <h3 className="font-bold mb-2">Glossário de Termos</h3>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
                     {(editedBook.glossary || []).map((entry) => (
                       <RetroPanel key={entry.id} className="relative group">
                          <div className="flex justify-between items-start mb-2">
                            <RetroInput 
                              value={entry.word}
                              onChange={(e) => handleUpdateGlossary(entry.id, e.target.value, entry.definition)}
                              className="font-bold text-sm w-1/2 bg-transparent border-none focus:bg-[var(--bg-inset)] focus:border-b"
                              placeholder="Palavra"
                            />
                            <button 
                             onClick={() => handleDeleteGlossary(entry.id)}
                             className="text-red-600 text-xs hover:underline opacity-0 group-hover:opacity-100"
                           >
                             Remover
                           </button>
                          </div>
                          <RetroTextarea 
                            value={entry.definition}
                            onChange={(e) => handleUpdateGlossary(entry.id, entry.word, e.target.value)}
                            className="w-full text-sm"
                            rows={2}
                            placeholder="Definição ou significado..."
                          />
                       </RetroPanel>
                     ))}
                  </div>
                  
                  <div className="border-t-2 border-[var(--border-shadow)] pt-2">
                    <NewGlossaryForm onAdd={handleAddGlossary} />
                  </div>
                </div>
              )}

           </div>
        </div>
      </div>
    </div>
  );
};

// --- Helper Forms ---

const NewQuoteForm: React.FC<{ onAdd: (text: string, page: number) => void }> = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [page, setPage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text && page) {
      onAdd(text, Number(page));
      setText('');
      setPage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-start">
      <RetroInput 
        className="flex-1" 
        placeholder="Trecho ou frase..." 
        value={text} 
        onChange={e => setText(e.target.value)} 
      />
      <RetroInput 
        type="number" 
        className="w-20" 
        placeholder="Pág." 
        value={page} 
        onChange={e => setPage(e.target.value)} 
      />
      <RetroButton type="submit" disabled={!text || !page}>Adicionar</RetroButton>
    </form>
  );
};

const NewGlossaryForm: React.FC<{ onAdd: (word: string, definition: string) => void }> = ({ onAdd }) => {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (word && definition) {
      onAdd(word, definition);
      setWord('');
      setDefinition('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 bg-[var(--border-shadow)] p-2 border border-[var(--border-shadow)]">
      <RetroInput 
        placeholder="Palavra ou Termo" 
        value={word} 
        onChange={e => setWord(e.target.value)} 
        className="font-bold"
      />
      <RetroTextarea 
        placeholder="Significado..." 
        rows={2}
        value={definition} 
        onChange={e => setDefinition(e.target.value)} 
      />
      <div className="flex justify-end">
        <RetroButton type="submit" disabled={!word || !definition}>Adicionar Verbete</RetroButton>
      </div>
    </form>
  );
};

const NewChapterForm: React.FC<{ onAdd: (title: string, content: string) => void }> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && content) {
      onAdd(title, content);
      setTitle('');
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 bg-[var(--border-shadow)] p-2 border border-[var(--border-shadow)]">
      <RetroInput 
        placeholder="Título do Capítulo (ex: Cap. 1 - O Início)" 
        value={title} 
        onChange={e => setTitle(e.target.value)} 
      />
      <RetroTextarea 
        placeholder="Resumo dos acontecimentos..." 
        rows={3}
        value={content} 
        onChange={e => setContent(e.target.value)} 
      />
      <div className="flex justify-end">
        <RetroButton type="submit" disabled={!title || !content}>Salvar Resumo</RetroButton>
      </div>
    </form>
  );
};

export default App;