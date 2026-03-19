import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, Calendar } from "lucide-react";

type Article = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  date: string;
};

export default function ArticleView() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);
    
    try {
      const localData = localStorage.getItem('thaqeb_articles');
      if (localData) {
        const parsed = JSON.parse(localData);
        const item = parsed.find((a: Article) => a.id === id);
        if (item) {
          setArticle(item);
        }
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-background pt-24 pb-12 flex justify-center"><div className="animate-pulse w-8 h-8 rounded-full bg-primary/20"></div></div>;
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center mt-20">
          <h1 className="text-4xl font-bold text-white mb-4">Article Not Found</h1>
          <p className="text-zinc-400 mb-8 max-w-md">The article you're looking for doesn't exist or has been removed by the author.</p>
          <Link to="/" className="inline-flex items-center gap-2 border border-zinc-800 bg-zinc-900 px-6 py-2.5 rounded-full hover:bg-zinc-800 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 mt-20">
        <article className="max-w-4xl mx-auto px-4 py-12 md:py-20 lg:px-8">
          
          <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 md:mb-12 font-medium text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Articles
          </Link>
          
          <header className="mb-10 md:mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex items-center gap-4 text-zinc-400 font-medium text-sm">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(article.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-800"></span>
              <span className="text-primary tracking-wide uppercase text-xs font-bold">Industry Insight</span>
            </div>
          </header>

          {article.coverImage && (
            <div className="rounded-2xl md:rounded-[2rem] overflow-hidden border border-zinc-800 mb-12 md:mb-20 shadow-2xl aspect-[21/9] bg-zinc-900">
              <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Render Rich Text Content securely */}
          <div 
            className="prose prose-invert prose-lg md:prose-xl max-w-none prose-p:leading-relaxed prose-headings:font-display prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

        </article>
      </main>

      <Footer />
    </div>
  );
}
