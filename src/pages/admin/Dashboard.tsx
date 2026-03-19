import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Briefcase, FileText, LogOut, Plus, Trash2, Edit } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

type Article = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  published: boolean;
  date: string;
};

type Service = {
  id: string;
  title: string;
  description: string;
  icon?: string;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"articles" | "services">("articles");
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  
  const [editingItem, setEditingItem] = useState<any>(null);
  
  useEffect(() => {
    // Check if authenticated
    if (!localStorage.getItem("thaqeb_admin_auth")) {
      navigate("/admin");
      return;
    }
    
    // Load data from localstorage
    const localArticles = localStorage.getItem("thaqeb_articles");
    if (localArticles) setArticles(JSON.parse(localArticles));
    
    const localServices = localStorage.getItem("thaqeb_services");
    if (localServices) setServices(JSON.parse(localServices));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("thaqeb_admin_auth");
    navigate("/admin");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (activeTab === "articles") {
      let updatedArticles = [...articles];
      if (editingItem.id && updatedArticles.find(a => a.id === editingItem.id)) {
        updatedArticles = updatedArticles.map(a => a.id === editingItem.id ? editingItem : a);
      } else {
        updatedArticles.unshift({ ...editingItem, id: Date.now().toString(), date: new Date().toISOString() });
      }
      setArticles(updatedArticles);
      localStorage.setItem("thaqeb_articles", JSON.stringify(updatedArticles));
    } else {
      let updatedServices = [...services];
      if (editingItem.id && updatedServices.find(s => s.id === editingItem.id)) {
        updatedServices = updatedServices.map(s => s.id === editingItem.id ? editingItem : s);
      } else {
        updatedServices.unshift({ ...editingItem, id: Date.now().toString() });
      }
      setServices(updatedServices);
      localStorage.setItem("thaqeb_services", JSON.stringify(updatedServices));
    }
    
    setEditingItem(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    if (activeTab === "articles") {
      const filtered = articles.filter(a => a.id !== id);
      setArticles(filtered);
      localStorage.setItem("thaqeb_articles", JSON.stringify(filtered));
    } else {
      const filtered = services.filter(s => s.id !== id);
      setServices(filtered);
      localStorage.setItem("thaqeb_services", JSON.stringify(filtered));
    }
  };

  const openEditor = (item?: any) => {
    if (item) setEditingItem({ ...item });
    else {
      if (activeTab === "articles") {
        setEditingItem({ title: "", excerpt: "", content: "", coverImage: "", published: true });
      } else {
        setEditingItem({ title: "", description: "" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span className="text-primary italic">Thaqeb</span> Command Center
          </h1>
          <nav className="hidden md:flex items-center gap-1 rounded-full bg-slate-100 p-1">
            <button
              onClick={() => { setActiveTab("articles"); setEditingItem(null); }}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${activeTab === "articles" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              <FileText className="h-4 w-4" /> Articles
            </button>
            <button
              onClick={() => { setActiveTab("services"); setEditingItem(null); }}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${activeTab === "services" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              <Briefcase className="h-4 w-4" /> Services
            </button>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </header>

      <main className="mx-auto max-w-7xl p-6 lg:p-8">
        <div className="grid gap-8" style={{ gridTemplateColumns: editingItem ? "minmax(0, 1fr) 500px" : "1fr" }}>
          
          {/* List Section */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">
                {activeTab === "articles" ? "Manage Articles" : "Manage Services"}
              </h2>
              <button
                onClick={() => openEditor()}
                className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-slate-800 transition-all active:scale-95"
              >
                <Plus className="h-4 w-4" /> Add New
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(activeTab === "articles" ? articles : services).length === 0 && (
                <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
                  No {activeTab} found. Click "Add New" to get started.
                </div>
              )}
              
              {(activeTab === "articles" ? articles : services).map((item) => (
                <div
                  key={item.id}
                  onClick={() => openEditor(item)}
                  className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold leading-snug">{item.title}</h3>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="rounded-md p-1.5 text-slate-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {activeTab === "articles" && (
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                      <span>{new Date((item as Article).date).toLocaleDateString()}</span>
                      <span className={`rounded-full px-2 py-0.5 font-medium ${(item as Article).published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                        {(item as Article).published ? "Live" : "Draft"}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Editor Sidebar */}
          {editingItem && (
            <div className="flex h-[calc(100vh-8rem)] flex-col rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden sticky top-24">
              <div className="flex items-center justify-between border-b border-slate-100 p-5 bg-slate-50">
                <h3 className="font-bold text-lg">
                  {editingItem.id ? 'Edit' : 'New'} {activeTab === "articles" ? "Article" : "Service"}
                </h3>
                <button
                  onClick={() => setEditingItem(null)}
                  className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
                >
                  &times;
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                <form id="editor-form" onSubmit={handleSave} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Title</label>
                    <input
                      type="text"
                      required
                      value={editingItem.title}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                    />
                  </div>

                  {activeTab === "articles" ? (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Cover Image URL</label>
                        <input
                          type="url"
                          value={editingItem.coverImage || ""}
                          placeholder="https://images.unsplash.com/..."
                          onChange={(e) => setEditingItem({ ...editingItem, coverImage: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Short Excerpt</label>
                        <textarea
                          rows={2}
                          required
                          value={editingItem.excerpt}
                          onChange={(e) => setEditingItem({ ...editingItem, excerpt: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Full Content</label>
                        <div className="rounded-lg border border-slate-300 overflow-hidden bg-white [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200 [&_.ql-container]:border-0 [&_.ql-editor]:min-h-[200px]">
                          <ReactQuill
                            theme="snow"
                            value={editingItem.content}
                            onChange={(val) => setEditingItem({ ...editingItem, content: val })}
                          />
                        </div>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer mt-4">
                        <input
                          type="checkbox"
                          checked={editingItem.published}
                          onChange={(e) => setEditingItem({ ...editingItem, published: e.target.checked })}
                          className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                        />
                        <span className="text-sm font-medium text-slate-700">Published (Visible on site)</span>
                      </label>
                    </>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Service Description</label>
                      <textarea
                        rows={6}
                        required
                        value={editingItem.description}
                        onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                      />
                    </div>
                  )}
                </form>
              </div>

              <div className="border-t border-slate-100 bg-slate-50 p-5">
                <button
                  type="submit"
                  form="editor-form"
                  className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-[0.98]"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
