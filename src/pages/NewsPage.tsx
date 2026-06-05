import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';

const TAGS = ['react', 'javascript', 'typescript', 'python', 'css', 'node', 'webdev', 'devops'];

interface HNArticle {
  objectID: string;
  title: string;
  url: string | null;
  author: string;
  points: number;
  num_comments: number;
  created_at: string;
  story_text?: string;
}

const CARD_GRADIENTS = [
  ['from-blue-500',    'to-indigo-700'],
  ['from-violet-500',  'to-purple-700'],
  ['from-emerald-500', 'to-teal-700'],
  ['from-rose-500',    'to-pink-700'],
  ['from-amber-500',   'to-orange-600'],
  ['from-cyan-500',    'to-blue-700'],
  ['from-fuchsia-500', 'to-violet-700'],
  ['from-teal-500',    'to-cyan-700'],
  ['from-indigo-500',  'to-blue-800'],
  ['from-green-500',   'to-emerald-700'],
  ['from-sky-500',     'to-indigo-700'],
  ['from-red-500',     'to-rose-700'],
];

function cardGradient(objectID: string): [string, string] {
  const hash = objectID.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return CARD_GRADIENTS[hash % CARD_GRADIENTS.length] as [string, string];
}

function ArticleCardCover({ objectID, url }: { objectID: string; url: string | null }) {
  const [from, to] = cardGradient(objectID);

  let domain: string | null = null;
  try { if (url) domain = new URL(url).hostname.replace(/^www\./, ''); } catch { /* ignore */ }

  return (
    <div className={`w-full h-40 bg-gradient-to-br ${from} ${to} relative overflow-hidden`}>

      {/* Unique photo per article — same seed = same photo every time */}
      <img
        src={`https://picsum.photos/seed/${objectID}/800/400`}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* subtle dark overlay for the badge */}
      <div className="absolute inset-0 bg-black/25" />

      {/* domain badge — top left */}
      {domain && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
          <img
            src={`https://www.google.com/s2/favicons?sz=16&domain=${domain}`}
            alt=""
            className="w-3.5 h-3.5 object-contain"
          />
          <span className="text-white text-xs font-medium">{domain}</span>
        </div>
      )}
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function NewsPage() {
  const [tag, setTag] = useState('react');
  const url = `https://hn.algolia.com/api/v1/search?tags=story&query=${encodeURIComponent(tag)}&hitsPerPage=12`;
  const { data, loading, error } = useFetch<{ hits: HNArticle[] }>(url);

  const articles = data?.hits ?? [];

  return (
    <div className="min-h-full bg-slate-50 dark:bg-zinc-900 px-4 md:px-8 py-6 md:py-8">
      <h1 className="text-slate-800 dark:text-white text-xl font-bold tracking-tight mb-1">Developer News</h1>
      <p className="text-slate-400 dark:text-zinc-500 text-sm mb-6">Top stories from the Hacker News community</p>

      <div className="flex gap-2 flex-wrap mb-6">
        {TAGS.map((t) => (
          <button
            key={t}
            onClick={() => setTag(t)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
              tag === t
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                : 'bg-white dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700/50 hover:border-blue-400 dark:hover:border-blue-500/40 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            #{t}
          </button>
        ))}
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/50 rounded-2xl overflow-hidden animate-pulse">
              <div className="w-full h-40 bg-slate-200 dark:bg-zinc-700" />
              <div className="p-5 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-zinc-700 rounded w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-zinc-700 rounded w-1/2" />
                <div className="h-3 bg-slate-200 dark:bg-zinc-700 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center mb-3">
            <svg width="20" height="20" fill="none" stroke="#f87171" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <p className="text-red-400 text-sm font-medium mb-1">{error}</p>
          <p className="text-slate-400 dark:text-zinc-500 text-xs">Check your internet connection and try again</p>
        </div>
      )}

      {!loading && !error && articles.length === 0 && (
        <p className="text-center text-slate-400 dark:text-zinc-500 py-16 text-sm">No stories found for #{tag}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((article) => {
          const href = article.url ?? `https://news.ycombinator.com/item?id=${article.objectID}`;
          return (
            <a
              key={article.objectID}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/50 rounded-2xl overflow-hidden hover:border-slate-300 dark:hover:border-zinc-600 hover:shadow-md dark:hover:bg-zinc-800 transition-all group"
            >
              <ArticleCardCover objectID={article.objectID} url={href} />

              <div className="p-5">
                <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
                  {article.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-slate-400 dark:text-zinc-500">
                  <span className="font-medium text-slate-500 dark:text-zinc-400 truncate max-w-[120px]">{article.author}</span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="flex items-center gap-1">
                      <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
                        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                      </svg>
                      {article.points ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      {article.num_comments ?? 0}
                    </span>
                    <span>{timeAgo(article.created_at)}</span>
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
