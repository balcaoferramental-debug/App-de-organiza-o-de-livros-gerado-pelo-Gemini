<!-- Instruções concisas para agentes de código (Copilot/AI) trabalhando neste repositório -->
# Copilot / AI Instructions

Objetivo rápido
- Este repositório é uma SPA React (Vite + TypeScript) chamada "Meu Diário de Leitura 95" que mantém livros no `localStorage` do navegador.

Big picture (arquitetura)
- Aplicação cliente única: entrada em [index.tsx](index.tsx) que monta `App` em [App.tsx](App.tsx).
- `App.tsx` mantém todo o estado da aplicação (lista de `Book`, view atual, tema) e persiste usando `localStorage` (chaves: `diary_95_books`, `diary_95_theme`). Veja `STORAGE_KEY` e `THEME_KEY` em `App.tsx`.
- Tipos compartilhados em [types.ts](types.ts): `Book`, `Genre`, `Quote`, `ChapterSummary`, `GlossaryEntry`, `ViewState` — usar esses tipos ao tocar dados.

Componentes e convenções de UI
- Componentes visuais reutilizáveis estão em [components/RetroUI.tsx](components/RetroUI.tsx): `RetroPanel`, `RetroButton`, `RetroInput`, `RetroTextarea`, `RetroSelect`, `RetroProgressBar`, `RetroInset`. Use-os para manter a aparência retro consistente.
- `StarRating` em [components/StarRating.tsx](components/StarRating.tsx) é o controle de avaliação (0-5). Para editar rating use `onRatingChange`, para somente leitura passar `readOnly`.
- Evite substituir estilos globais — prefira usar os componentes `Retro*` e suas props/`className`.

Fluxo de dados e persistência
- Estado principal vive em `App.tsx` e é passado por props para sub-views (`HomeView`, `AddBookView`, `BookDetailView`).
- Persistência: `localStorage.setItem(STORAGE_KEY, JSON.stringify(books))` sempre que `books` mudar. Restaurar no `useEffect` inicial.
- `Book.coverImage` é armazenado como string Base64 (FileReader -> `readAsDataURL`).
- IDs são gerados com `uuidv4()` (pacote `uuid`).

Scripts / execução local (essencial)
- Instalar dependências: `npm install` (repositório usa Node + Vite). Veja [package.json](package.json).
- Rodar em desenvolvimento: `npm run dev` (Vite). Build: `npm run build`. Preview build: `npm run preview`.
- Variáveis de ambiente: README menciona `GEMINI_API_KEY` em `.env.local` — só necessária se integrar a APIs externas (não há código de servidor no repo).

Padrões de código e tipagem
- Projeto usa TS e `type: module`. Preservar `export`/`import` padrão ESModules.
- Enum `Genre` contém labels em PT-BR — quando filtrar ou comparar, trate os valores como strings descritivas (ex.: `Genre.FICTION === 'Ficção'`).

Pontos importantes a considerar ao editar
- Ao alterar a persistência, mantenha migração compatível com o formato existente (array de `Book` com `coverImage` base64 e `createdAt` timestamp).
- Ao modificar a estrutura de `Book`, atualize `types.ts` e revise o carregamento inicial em `App.tsx` para evitar crashes por JSON incompatível.
- UI: muitos controles dependem de `Retro*` para aparência e bordas detalhadas — mudanças visuais diretas devem usar `className` nos wrappers.

Exemplos rápidos (quando sugerir mudanças ou PRs)
- Para adicionar um novo campo persistente: 1) atualizar `types.ts`; 2) atualizar formulários em `AddBookView` e `BookDetailView`; 3) adaptar leitura inicial em `useEffect` de `App.tsx` se precisar migrar dados antigos.
- Para adicionar teste manual rápido: preencher a UI, checar `localStorage.getItem('diary_95_books')` no DevTools -> Application.

Onde procurar para entender mais
- Fluxo e lógica central: [App.tsx](App.tsx).
- Tipos e modelos de dados: [types.ts](types.ts).
- Componentes reutilizáveis: [components/RetroUI.tsx](components/RetroUI.tsx) e [components/StarRating.tsx](components/StarRating.tsx).
- Instruções de execução: [README.md](README.md).

Seções que requerem validação humana
- Uso de `GEMINI_API_KEY` no README — confirmar se é relevante para este app (nenhum código de chamadas externas visível no repo).

Perguntas que o agente pode colocar ao revisor humano
- Deseja que a persistência mude de `localStorage` para backend? Se sim, onde autenticar e como migrar dados?
- Confirma idiomas/labels (PT-BR) para o enum `Genre` ou prefere chaves internas em inglês?

Fim — por favor revise e indique se quer que eu ajuste o tom, exemplos ou adicione instruções de commit/PR.
