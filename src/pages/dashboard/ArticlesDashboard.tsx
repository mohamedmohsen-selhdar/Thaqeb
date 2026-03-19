import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, LogOut, BookOpen, Briefcase, Rocket, X, Check } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

type Tab = "articles" | "services" | "case_studies";

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link', 'image'
];

export default function ArticlesDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("articles");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    fetchItems();

    // Force light mode explicitly for this dashboard
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
    return () => {
      // Clean up if needed
    };
  }, [activeTab]);

  const checkUser = () => {
    const authStatus = localStorage.getItem("thaqeb_admin_auth");
    if (!authStatus) {
      navigate("/admin");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("thaqeb_admin_auth");
    localStorage.removeItem("thaqeb_admin_email");
    navigate("/admin");
  };

  const fetchItems = async () => {
    setLoading(true);
    const tableName = activeTab;
    const { data, error } = await supabase
      .from(tableName as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setItems(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setStatusMessage("Saving...");
    const tableName = activeTab;
    const isNew = !items.find(i => i.id === editingItem.id) || !editingItem.id;

    // For articles we might not supply an ID in the editor initially, so let DB generate it via uuid defaults
    const payload = { ...editingItem };
    if (activeTab === 'articles' && (!payload.id || payload.id.startsWith('article-'))) {
        delete payload.id;
    }

    if (isNew) {
      const { error } = await supabase.from(tableName as any).insert([payload]);
      if (error) setStatusMessage(`Error: ${error.message}`);
      else {
        setStatusMessage(`${activeTab.slice(0, -1)} created!`);
        setEditingItem(null);
        fetchItems();
      }
    } else {
      const { error } = await supabase.from(tableName as any).update(payload).eq('id', payload.id);
      if (error) setStatusMessage(`Error: ${error.message}`);
      else {
        setStatusMessage(`${activeTab.slice(0, -1)} updated!`);
        setEditingItem(null);
        fetchItems();
      }
    }

    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) return;

    const tableName = activeTab;
    const { error } = await supabase.from(tableName as any).delete().eq('id', id);
    if (!error) {
      fetchItems();
    } else {
      alert(`Error deleting: ${error.message}`);
    }
  };

  const openEditor = (item?: any) => {
    if (item) {
      setEditingItem(item);
    } else {
      if (activeTab === "articles") {
        setEditingItem({ id: `article-${Date.now()}`, title: "", excerpt: "", content: "", cover_image: "", published: false });
      } else if (activeTab === "services") {
        setEditingItem({ id: `service-${Date.now()}`, title: "", what_i_do: "", deliverables: [], expected_impact: [], projects_delivered: "", project_names: [] });
      } else {
        setEditingItem({ id: `case-${Date.now()}`, title: "", company: "", context: "", core_problem: [], intervention: "", key_deliverables: [], measurable_impact: [] });
      }
    }
  };

  const ArrayInput = ({ label, value, onChange }: { label: string, value: string[], onChange: (val: string[]) => void }) => (
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>{label}</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {value.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const newVal = [...value];
                newVal[idx] = e.target.value;
                onChange(newVal);
              }}
              style={{ flex: 1, padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1' }}
            />
            <button type="button" onClick={() => onChange(value.filter((_, i) => i !== idx))} style={{ color: '#ef4444', padding: '0.5rem' }}><Trash2 size={16} /></button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...value, ""])}
          style={{ alignSelf: 'flex-start', fontSize: '0.75rem', color: '#2563eb', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
        >
          + Add Step/Item
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: 'Inter, system-ui, sans-serif' }} className="light">

      {/* Topbar */}
      <header style={{ padding: '1rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <h1 style={{ fontSize: '1.125rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            THAQEB CMS
          </h1>

          <nav style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '0.75rem' }}>
            {(['articles', 'services', 'case_studies'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setEditingItem(null); }}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: activeTab === tab ? '#ffffff' : 'transparent',
                  color: activeTab === tab ? '#0f172a' : '#64748b',
                  boxShadow: activeTab === tab ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' : 'none'
                }}
              >
                {tab === 'articles' && <BookOpen size={16} />}
                {tab === 'services' && <Briefcase size={16} />}
                {tab === 'case_studies' && <Rocket size={16} />}
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('_', ' ')}
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={() => navigate('/admin/dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid #cbd5e1', color: '#64748b', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
        >
           Back to Operations
        </button>
      </header>

      <main style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto', display: 'grid', gridTemplateColumns: editingItem ? '400px 1fr' : '1fr', gap: '2rem' }}>

        {/* List View */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
              {activeTab === 'case_studies' ? 'Case Studies' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <button
              onClick={() => openEditor()}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#0f172a', color: '#ffffff', padding: '0.625rem 1.25rem', borderRadius: '0.75rem', cursor: 'pointer', border: 'none', fontWeight: 600, fontSize: '0.875rem' }}
            >
              <Plus size={18} /> New Entry
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: editingItem ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1rem' }}>
            {loading && items.length === 0 && <p>Loading data...</p>}
            {!loading && items.length === 0 && <p style={{ color: '#64748b' }}>No entries found in this category.</p>}
            {items.map(item => (
              <div
                key={item.id}
                onClick={() => openEditor(item)}
                style={{
                  padding: '1.25rem',
                  background: '#ffffff',
                  border: '1px solid',
                  borderColor: editingItem?.id === item.id ? '#0f172a' : '#e2e8f0',
                  borderRadius: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: editingItem?.id === item.id ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, lineHeight: 1.2 }}>{item.title}</h3>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                {activeTab === 'case_studies' && item.company && (
                  <p style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>{item.company}</p>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {new Date(item.created_at || Date.now()).toLocaleDateString()}
                  </span>
                  {activeTab === 'articles' && (
                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '1rem', background: item.published ? '#dcfce7' : '#ffedd5', color: item.published ? '#166534' : '#9a3412', fontWeight: 600 }}>
                      {item.published ? 'Live' : 'Draft'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor Panel */}
        {editingItem && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1.25rem', padding: '2rem', height: 'fit-content', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', position: 'sticky', top: '5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {activeTab === 'articles' ? (items.find(i => i.id === editingItem.id) ? 'Edit Article' : 'New Article') :
                  activeTab === 'services' ? (items.find(i => i.id === editingItem.id) ? 'Edit Service' : 'New Service') :
                    (items.find(i => i.id === editingItem.id) ? 'Edit Case Study' : 'New Case Study')}
              </h2>
              <button onClick={() => setEditingItem(null)} style={{ background: '#f1f5f9', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.5rem' }}>
                <X size={20} />
              </button>
            </div>

            {statusMessage && (
              <div style={{ padding: '0.75rem 1rem', background: statusMessage.includes('Error') ? '#fef2f2' : '#f0fdf4', color: statusMessage.includes('Error') ? '#dc2626' : '#166534', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {statusMessage.includes('Error') ? <X size={16} /> : <Check size={16} />}
                {statusMessage}
              </div>
            )}

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Common Field: Title */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Title / Headline</label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: '#f8fafc' }}
                />
              </div>

              {/* ARTICLE SPECIFIC FIELDS */}
              {activeTab === 'articles' && (
                <>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Excerpt</label>
                    <textarea
                      rows={2}
                      value={editingItem.excerpt || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, excerpt: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: '#f8fafc', resize: 'vertical' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Cover Image URL</label>
                    <input
                      type="text"
                      value={editingItem.cover_image || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, cover_image: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: '#f8fafc' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Full Article Content</label>
                    <div style={{ background: '#ffffff', borderRadius: '0.5rem', overflow: 'hidden' }} className="quill-wrapper">
                      <ReactQuill
                        theme="snow"
                        value={editingItem.content || ""}
                        onChange={(val: any) => setEditingItem({ ...editingItem, content: val })}
                        modules={modules}
                        formats={formats}
                        style={{ height: '300px', paddingBottom: '40px' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="checkbox"
                      id="published"
                      checked={editingItem.published || false}
                      onChange={(e) => setEditingItem({ ...editingItem, published: e.target.checked })}
                      style={{ width: '1.25rem', height: '1.25rem', accentColor: '#0f172a' }}
                    />
                    <label htmlFor="published" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}>Live on Website</label>
                  </div>
                </>
              )}

              {/* SERVICE SPECIFIC FIELDS */}
              {activeTab === 'services' && (
                <>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>What I Do (Description)</label>
                    <div style={{ background: '#ffffff', borderRadius: '0.5rem', overflow: 'hidden' }} className="quill-wrapper">
                      <ReactQuill
                        theme="snow"
                        value={editingItem.what_i_do || ""}
                        onChange={(val: any) => setEditingItem({ ...editingItem, what_i_do: val })}
                        modules={modules}
                        formats={formats}
                        style={{ height: '200px', paddingBottom: '40px' }}
                      />
                    </div>
                  </div>
                  <ArrayInput label="Deliverables" value={editingItem.deliverables || []} onChange={(val) => setEditingItem({ ...editingItem, deliverables: val })} />
                  <ArrayInput label="Expected Impact" value={editingItem.expected_impact || []} onChange={(val) => setEditingItem({ ...editingItem, expected_impact: val })} />
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Projects Delivered (Summary Text)</label>
                    <input
                      type="text"
                      value={editingItem.projects_delivered || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, projects_delivered: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: '#f8fafc' }}
                    />
                  </div>
                  <ArrayInput label="Key Client Names" value={editingItem.project_names || []} onChange={(val) => setEditingItem({ ...editingItem, project_names: val })} />
                </>
              )}

              {/* CASE STUDY SPECIFIC FIELDS */}
              {activeTab === 'case_studies' && (
                <>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Company / Client Info</label>
                    <input
                      type="text"
                      value={editingItem.company || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: '#f8fafc' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>The Context (Story)</label>
                    <textarea
                      rows={2}
                      value={editingItem.context || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, context: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: '#f8fafc' }}
                    />
                  </div>
                  <ArrayInput label="Core Problems" value={editingItem.core_problem || []} onChange={(val) => setEditingItem({ ...editingItem, core_problem: val })} />
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Intervention (What I Did)</label>
                    <div style={{ background: '#ffffff', borderRadius: '0.5rem', overflow: 'hidden' }} className="quill-wrapper">
                      <ReactQuill
                        theme="snow"
                        value={editingItem.intervention || ""}
                        onChange={(val: any) => setEditingItem({ ...editingItem, intervention: val })}
                        modules={modules}
                        formats={formats}
                        style={{ height: '200px', paddingBottom: '40px' }}
                      />
                    </div>
                  </div>
                  <ArrayInput label="Key Deliverables" value={editingItem.key_deliverables || []} onChange={(val) => setEditingItem({ ...editingItem, key_deliverables: val })} />
                  <ArrayInput label="Measurable Impact" value={editingItem.measurable_impact || []} onChange={(val) => setEditingItem({ ...editingItem, measurable_impact: val })} />
                </>
              )}

              <button
                type="submit"
                style={{ marginTop: '1rem', padding: '1rem', borderRadius: '0.75rem', background: '#0f172a', color: '#ffffff', fontWeight: 700, cursor: 'pointer', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)', transition: 'transform 0.1s' }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                Update {activeTab.replace('_', ' ').slice(0, -1)}
              </button>
            </form>

            <style dangerouslySetInnerHTML={{
              __html: `
              .quill-wrapper .ql-toolbar {
                border-top-left-radius: 0.5rem;
                border-top-right-radius: 0.5rem;
                border-color: #cbd5e1;
                background-color: #f8fafc;
              }
              .quill-wrapper .ql-container {
                border-bottom-left-radius: 0.5rem;
                border-bottom-right-radius: 0.5rem;
                border-color: #cbd5e1;
                font-size: 1rem;
                font-family: inherit;
              }
              .quill-wrapper .ql-editor {
                min-height: 150px;
              }
            `}} />
          </div>
        )}
      </main>
    </div>
  );
}
