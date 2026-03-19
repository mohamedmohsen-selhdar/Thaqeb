import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";

type Article = {
  id: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  date: string;
};

const ArticlesSection = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = () => {
            try {
                const localData = localStorage.getItem('thaqeb_articles');
                if (localData) {
                    const parsed = JSON.parse(localData);
                    // Filter published and keep only first 3
                    const publishedOnly = parsed.filter((a: any) => a.published).slice(0, 3);
                    setArticles(publishedOnly);
                }
            } catch (error) {
                console.error("Error parsing local articles", error);
            }
            setLoading(false);
        };
        fetchArticles();
    }, []);

    if (loading) {
        return <div className="py-24 bg-zinc-950 flex justify-center items-center h-64"><div className="animate-pulse w-10 h-10 bg-zinc-800 rounded-full"></div></div>;
    }

    // Render empty state if there are no articles instead of hiding entirely
    if (articles.length === 0) {
        return (
            <section className="py-24 bg-zinc-950 border-t border-zinc-900">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
                                Industry Insights
                            </h2>
                            <p className="text-zinc-400 max-w-2xl text-lg">
                                Latest articles, guides, and trends from the manufacturing ecosystem.
                            </p>
                        </div>
                    </div>
                    <div className="text-center py-16 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 border-dashed">
                        <BookOpen className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No Articles Yet</h3>
                        <p className="text-zinc-400 max-w-md mx-auto">
                            We are currently cooking up some great insights. Check back soon for industry news and guides.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-zinc-950 border-t border-zinc-900">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
                            Industry Insights
                        </h2>
                        <p className="text-zinc-400 max-w-2xl text-lg">
                            Latest articles, guides, and trends from the manufacturing ecosystem.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <div key={article.id} className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors">
                            {article.coverImage && (
                                <div className="h-48 overflow-hidden">
                                    <img 
                                        src={article.coverImage} 
                                        alt={article.title} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                <span className="inline-flex items-center gap-1.5 text-xs text-primary mb-3 bg-primary/10 px-2.5 py-1 rounded-full font-medium">
                                    <BookOpen className="w-3.5 h-3.5" />
                                    Article
                                </span>
                                <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                                    {article.title}
                                </h3>
                                <p className="text-zinc-400 text-sm mb-6 line-clamp-3">
                                    {article.excerpt}
                                </p>
                                <div className="flex items-center gap-2 text-primary font-medium text-sm mt-auto hover:text-primary/80 transition-colors cursor-pointer">
                                    Read Article
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ArticlesSection;
