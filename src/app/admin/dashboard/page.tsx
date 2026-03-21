"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, Briefcase, Star, Users, Settings,
  Map, Image as ImageIcon, LogOut, Plus, Pencil, Trash2, X, Save,
  ChevronDown, ChevronUp, Search, CheckCircle, AlertCircle, Eye,
  Palette, Type, Link2, Megaphone, Shield, Phone
} from "lucide-react";

// ---------- types ----------
type Tab = "overview" | "hero" | "navigation" | "categories" | "homepage" | "products" | "projects" | "testimonials" | "users" | "settings" | "ticker" | "pages";

interface StatsData { userCount: number; productCount: number; projectCount: number; testimonialCount: number }
interface HeroItem { id: string; page: string; title: string; subtitle?: string; imageUrl?: string; ctaText?: string; ctaLink?: string; textColor: string; overlayOpacity: number }
interface NavItem { id: string; label: string; href: string; order: number }
interface ProductItem { 
  id: string; 
  slug: string; 
  name: string; 
  category: string; 
  shortSpec?: string; 
  description: string; 
  isNew: boolean; 
  isFeatured: boolean; 
  imageUrl?: string; 
  imagesJson?: string; 
  specs?: string; 
  heightClass?: string;
  whyInvestJson?: string;
  premiumBenefitsJson?: string;
  servicesTitle?: string;
  servicesSubtitle?: string;
  servicesJson?: string;
  subCategoryId?: string;
  subCategory?: { id: string; name: string };
}
interface SubCategoryItem { id: string; name: string; categoryId: string; order: number; category?: { label: string } }
interface ProjectItem { id: string; name: string; city: string; state: string; surface: string; area: string; year: string; imageUrl?: string }
interface TestimonialItem { id: string; name: string; institution: string; quote: string; avatar?: string }
interface UserItem { id: string; name?: string; email?: string; role: string; emailVerified?: string }
interface SiteSettings { 
  siteName: string; 
  primaryColor: string; 
  secondaryColor: string; 
  fontHeading: string; 
  fontBody: string; 
  contactEmail?: string; 
  contactPhone?: string; 
  address?: string; 
  logoUrl?: string; 
  showCategoryBar?: boolean; 
  showTicker?: boolean; 
  statsJson?: string; 
  certsJson?: string; 
  ctaTitle?: string; 
  ctaSubtitle?: string; 
  ctaButton?: string; 
  ctaLink?: string;
  // New Page Content Fields
  aboutText?: string;
  aboutOriginTitle?: string;
  aboutOriginText?: string;
  valuesJson?: string;
  timelineJson?: string;
  officeHours?: string;
  whatsappNumber?: string;
  serviceArea?: string;
}

// ---------- helpers ----------
function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-white text-sm font-medium ${type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
      {type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {msg}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition"><X size={18} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text", required = false, textarea = false }: {
  label: string; name: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string; required?: boolean; textarea?: boolean;
}) {
  const cls = "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent";
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">{label}{required && " *"}</label>
      {textarea
        ? <textarea name={name} value={value as string} onChange={onChange} className={`${cls} h-24 resize-none`} required={required} />
        : <input type={type} name={name} value={value} onChange={onChange} className={cls} required={required} />
      }
    </div>
  );
}

// ---------- main component ----------
export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Data
  const [stats, setStats] = useState<StatsData>({ userCount: 0, productCount: 0, projectCount: 0, testimonialCount: 0 });
  const [heroes, setHeroes] = useState<HeroItem[]>([]);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; label: string; order: number; imageUrl?: string; iconSvg?: string; navbarIconUrl?: string; description?: string }[]>([]);
  const [homepageGridItems, setHomepageGridItems] = useState<{ id: string; label: string; description?: string; imageUrl?: string; href?: string; order: number }[]>([]);
  const [tickerItems, setTickerItems] = useState<{ id: string; text: string; order: number }[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategoryItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({ siteName: "SPORTSURF", primaryColor: "#f59e0b", secondaryColor: "#1e293b", fontHeading: "Inter", fontBody: "Inter" });
  const [userSearch, setUserSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");

  // Modal state
  const [modal, setModal] = useState<{ type: string; data?: any } | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [confirmModal, setConfirmModal] = useState<{ title: string; onConfirm: () => void } | null>(null);

  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchData = useCallback(async (endpoint: string) => {
    const res = await fetch(endpoint);
    if (res.ok) return res.json();
    return null;
  }, []);

  useEffect(() => {
    async function load() {
      const s = await fetchData("/api/admin/overview");
      if (s) setStats(s);
      const h = await fetchData("/api/admin/hero");
      if (h) setHeroes(h);
      const n = await fetchData("/api/admin/navigation");
      if (n) setNavItems(n);
      const c = await fetchData("/api/admin/categories");
      if (c) setCategories(c);
      const hg = await fetchData("/api/admin/homepage-grid");
      if (hg) setHomepageGridItems(hg);
      const tk = await fetchData("/api/admin/ticker");
      if (tk) setTickerItems(tk);
      const p = await fetchData("/api/admin/products");
      if (p) setProducts(p);
      const sc = await fetchData("/api/admin/subcategories");
      if (sc) setSubCategories(sc);
      const pr = await fetchData("/api/admin/projects");
      if (pr) setProjects(pr);
      const t = await fetchData("/api/admin/testimonials");
      if (t) setTestimonials(t);
      const u = await fetchData("/api/admin/users");
      if (u) setUsers(u.users || []);
      const st = await fetchData("/api/admin/settings");
      if (st && st.id) setSettings(st);
    }
    load();
  }, [fetchData]);

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin");
  }

  function openModal(type: string, data?: any) {
    setFormData(data ? { ...data } : {});
    setModal({ type, data });
  }

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  // CRUD helpers
  async function saveHero() {
    const isEdit = !!formData.id;
    const url = isEdit ? `/api/admin/hero/${formData.id}` : "/api/admin/hero";
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
    if (res.ok) {
      const h = await fetchData("/api/admin/hero");
      if (h) setHeroes(h);
      setModal(null);
      showToast(isEdit ? "Hero section updated!" : "Hero section created!");
    } else showToast("Failed to save", "error");
  }

  async function deleteHero(id: string) {
    setConfirmModal({
      title: "Delete this hero section?",
      onConfirm: async () => {
        const res = await fetch(`/api/admin/hero/${id}`, { method: "DELETE" });
        if (res.ok) { setHeroes(h => h.filter(x => x.id !== id)); showToast("Hero section deleted!"); }
        setConfirmModal(null);
      }
    });
  }

  async function saveNav() {
    const isEdit = !!formData.id;
    const url = isEdit ? `/api/admin/navigation/${formData.id}` : "/api/admin/navigation";
    const method = isEdit ? "PUT" : "POST";
    const body = { label: formData.label, href: formData.href, order: parseInt(formData.order) || 0 };
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) {
      const n = await fetchData("/api/admin/navigation");
      if (n) setNavItems(n);
      setModal(null);
      showToast(isEdit ? "Menu item updated!" : "Menu item added!");
    } else showToast("Failed to save", "error");
  }

  async function deleteNav(id: string) {
    setConfirmModal({
      title: "Delete this menu item?",
      onConfirm: async () => {
        const res = await fetch(`/api/admin/navigation/${id}`, { method: "DELETE" });
        if (res.ok) { setNavItems(n => n.filter(x => x.id !== id)); showToast("Menu item deleted!"); }
        setConfirmModal(null);
      }
    });
  }

  async function saveHomepageGridItem() {
    const isEdit = !!formData.id;
    const url = isEdit ? `/api/admin/homepage-grid/${formData.id}` : "/api/admin/homepage-grid";
    const method = isEdit ? "PUT" : "POST";
    const body = { label: formData.label, description: formData.description, imageUrl: formData.imageUrl, href: formData.href, order: parseInt(formData.order) || 0 };
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) {
      const hg = await fetchData("/api/admin/homepage-grid");
      if (hg) setHomepageGridItems(hg);
      setModal(null);
      showToast(isEdit ? "Grid item updated!" : "Grid item added!");
    } else showToast("Failed to save", "error");
  }

  async function deleteHomepageGridItem(id: string) {
    setConfirmModal({
      title: "Delete this grid item?",
      onConfirm: async () => {
        const res = await fetch(`/api/admin/homepage-grid/${id}`, { method: "DELETE" });
        if (res.ok) { setHomepageGridItems(prev => prev.filter(x => x.id !== id)); showToast("Grid item deleted!"); }
        setConfirmModal(null);
      }
    });
  }

  async function saveCategory() {
    const isEdit = !!formData.id;
    const url = isEdit ? `/api/admin/categories/${formData.id}` : "/api/admin/categories";
    const method = isEdit ? "PUT" : "POST";
    const body = { 
      label: formData.label, 
      navbarIconUrl: formData.navbarIconUrl, 
      imageUrl: formData.imageUrl,
      description: formData.description,
      href: formData.href, 
      order: parseInt(formData.order) || 0 
    };
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) {
      const c = await fetchData("/api/admin/categories");
      if (c) setCategories(c);
      setModal(null);
      showToast(isEdit ? "Category updated!" : "Category added!");
    } else {
      const txt = await res.text();
      showToast(`Failed to save: ${txt.substring(0, 300)}`, "error");
    }
  }

  async function deleteCategory(id: string) {
    setConfirmModal({
      title: "Delete this category? All products in this category will display 'Uncategorized'.",
      onConfirm: async () => {
        const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
        if (res.ok) { 
          setCategories(c => c.filter(x => x.id !== id)); 
          showToast("Category deleted!"); 
        } else {
          showToast("Failed to delete category. Check if it has products.", "error");
        }
        setConfirmModal(null);
      }
    });
  }

  async function saveTicker() {
    const isEdit = !!formData.id;
    const url = isEdit ? `/api/admin/ticker/${formData.id}` : "/api/admin/ticker";
    const method = isEdit ? "PUT" : "POST";
    const body = { text: formData.text, order: parseInt(formData.order) || 0 };
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) {
      const tk = await fetchData("/api/admin/ticker");
      if (tk) setTickerItems(tk);
      setModal(null);
      showToast(isEdit ? "Ticker updated!" : "Ticker added!");
    } else showToast("Failed to save ticker", "error");
  }

  async function deleteTicker(id: string) {
    setConfirmModal({
      title: "Delete this ticker item?",
      onConfirm: async () => {
        const res = await fetch(`/api/admin/ticker/${id}`, { method: "DELETE" });
        if (res.ok) { setTickerItems(tk => tk.filter(x => x.id !== id)); showToast("Ticker deleted!"); }
        setConfirmModal(null);
      }
    });
  }
   async function saveSubCategory() {
      const isEdit = !!formData.id;
      const url = isEdit ? `/api/admin/subcategories/${formData.id}` : "/api/admin/subcategories";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (res.ok) {
         const sc = await fetchData("/api/admin/subcategories");
         if (sc) setSubCategories(sc);
         setModal(null);
         showToast(isEdit ? "SubCategory updated!" : "SubCategory added!");
      } else showToast("Failed to save", "error");
   }

   async function deleteSubCategory(id: string) {
     setConfirmModal({
       title: "Delete this sub-category?",
       onConfirm: async () => {
         const res = await fetch(`/api/admin/subcategories/${id}`, { method: "DELETE" });
         if (res.ok) { setSubCategories(sc => sc.filter(x => x.id !== id)); showToast("SubCategory deleted!"); }
         setConfirmModal(null);
       }
     });
   }

   async function saveProduct() {
      // Basic JSON validation before saving
      try {
         if (formData.imagesJson) JSON.parse(formData.imagesJson);
         if (formData.specs) JSON.parse(formData.specs);
         if (formData.whyInvestJson) JSON.parse(formData.whyInvestJson);
         if (formData.premiumBenefitsJson) JSON.parse(formData.premiumBenefitsJson);
         if (formData.servicesJson) JSON.parse(formData.servicesJson);
      } catch (e) {
         showToast("Invalid JSON in one of the fields. Please check your formatting.", "error");
         return;
      }

      const isEdit = !!formData.id;
      const url = isEdit ? `/api/admin/products/${formData.id}` : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";
      
      // Sanitize body: remove id, createdAt, updatedAt for Prisma
      const { id, createdAt, updatedAt, ...rest } = formData;
      const body = { 
        ...rest, 
        isNew: !!formData.isNew, 
        isFeatured: !!formData.isFeatured 
      };

      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) {
         const p = await fetchData("/api/admin/products");
         if (p) setProducts(p);
         setModal(null);
         showToast(isEdit ? "Product updated!" : "Product added!");
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to save", "error");
      }
   }

  async function deleteProduct(id: string) {
    setConfirmModal({
      title: "Delete this product?",
      onConfirm: async () => {
        const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
        if (res.ok) { setProducts(p => p.filter(x => x.id !== id)); showToast("Product deleted!"); }
        setConfirmModal(null);
      }
    });
  }

  async function saveProject() {
    const isEdit = !!formData.id;
    const url = isEdit ? `/api/admin/projects/${formData.id}` : "/api/admin/projects";
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
    if (res.ok) {
      const p = await fetchData("/api/admin/projects");
      if (p) setProjects(p);
      setModal(null);
      showToast(isEdit ? "Project updated!" : "Project added!");
    } else showToast("Failed to save", "error");
  }

  async function deleteProject(id: string) {
    setConfirmModal({
      title: "Delete this project?",
      onConfirm: async () => {
        const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
        if (res.ok) { setProjects(p => p.filter(x => x.id !== id)); showToast("Project deleted!"); }
        setConfirmModal(null);
      }
    });
  }

  async function saveTestimonial() {
    const isEdit = !!formData.id;
    const url = isEdit ? `/api/admin/testimonials/${formData.id}` : "/api/admin/testimonials";
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
    if (res.ok) {
      const t = await fetchData("/api/admin/testimonials");
      if (t) setTestimonials(t);
      setModal(null);
      showToast(isEdit ? "Testimonial updated!" : "Testimonial added!");
    } else showToast("Failed to save", "error");
  }

  async function deleteTestimonial(id: string) {
    setConfirmModal({
      title: "Delete this testimonial?",
      onConfirm: async () => {
        const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
        if (res.ok) { setTestimonials(t => t.filter(x => x.id !== id)); showToast("Deleted!"); }
        setConfirmModal(null);
      }
    });
  }

  async function deleteUser(id: string) {
    setConfirmModal({
      title: "Permanently delete this user?",
      onConfirm: async () => {
        const res = await fetch("/api/admin/users", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
        if (res.ok) { setUsers(u => u.filter(x => x.id !== id)); showToast("User deleted!"); }
        setConfirmModal(null);
      }
    });
  }

  async function saveSettings() {
    const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
    if (res.ok) showToast("Settings saved!"); else showToast("Failed to save", "error");
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "Overview", icon: <LayoutDashboard size={16} /> },
    { key: "hero", label: "Hero Sections", icon: <ImageIcon size={16} /> },
    { key: "navigation", label: "Navigation", icon: <Map size={16} /> },
    { key: "categories", label: "Navbar Categories", icon: <Palette size={16} /> },
    { key: "homepage", label: "Homepage Grid", icon: <LayoutDashboard size={16} /> },
    { key: "products", label: "Products", icon: <Package size={16} /> },
    { key: "projects", label: "Projects", icon: <Briefcase size={16} /> },
    { key: "testimonials", label: "Testimonials", icon: <Star size={16} /> },
    { key: "users", label: "Users", icon: <Users size={16} /> },
    { key: "ticker", label: "Announcement Ticker", icon: <Megaphone size={16} /> },
    { key: "pages", label: "Page Content", icon: <Pencil size={16} /> },
    { key: "settings", label: "Site Settings", icon: <Settings size={16} /> },
  ];

  const filteredUsers = users.filter(u =>
    !userSearch || u.name?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );
  const filteredProducts = products.filter(p =>
    !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-6 py-3 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-black text-slate-800 text-base leading-none">SPORTSURF</h1>
              <p className="text-[11px] text-slate-500 leading-none mt-0.5">Admin Dashboard</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-red-600 transition px-3 py-1.5 rounded-lg hover:bg-red-50">
            <LogOut size={15} /> Logout
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 px-6 overflow-x-auto pb-px max-w-[1600px] mx-auto">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${tab === t.key ? "border-amber-500 text-amber-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[1600px] mx-auto p-6">

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div>
            <h2 className="text-2xl font-black text-slate-800 mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Users", value: stats.userCount, icon: <Users size={24} />, color: "bg-blue-500" },
                { label: "Products", value: stats.productCount, icon: <Package size={24} />, color: "bg-amber-500" },
                { label: "Projects", value: stats.projectCount, icon: <Briefcase size={24} />, color: "bg-emerald-500" },
                { label: "Testimonials", value: stats.testimonialCount, icon: <Star size={24} />, color: "bg-purple-500" },
              ].map(stat => (
                <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
                  <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0`}>{stat.icon}</div>
                  <div>
                    <div className="text-2xl font-black text-slate-800">{stat.value}</div>
                    <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-700 mb-3">Quick Links</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {tabs.filter(t => t.key !== "overview").map(t => (
                  <button key={t.key} onClick={() => setTab(t.key)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 hover:bg-amber-50 hover:border-amber-200 transition text-left">
                    <span className="text-amber-500">{t.icon}</span> {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* HERO SECTIONS */}
        {tab === "hero" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-800">Hero Sections</h2>
              <button onClick={() => openModal("hero")} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-4 py-2 rounded-xl text-sm font-semibold transition">
                <Plus size={16} /> Add Hero
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {heroes.map(hero => (
                <div key={hero.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  {hero.imageUrl && <img src={hero.imageUrl} alt={hero.title} className="w-full h-36 object-cover" onError={e => (e.currentTarget.style.display = "none")} />}
                  <div className="p-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg">{hero.page}</span>
                    <h3 className="font-bold text-slate-800 mt-2 leading-snug">{hero.title}</h3>
                    {hero.subtitle && <p className="text-sm text-slate-500 mt-1">{hero.subtitle}</p>}
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => openModal("hero", hero)} className="flex items-center gap-1.5 text-xs border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition"><Pencil size={12} /> Edit</button>
                      <button onClick={() => deleteHero(hero.id)} className="flex items-center gap-1.5 text-xs border border-red-200 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"><Trash2 size={12} /> Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {heroes.length === 0 && <div className="col-span-2 text-center py-16 text-slate-400">No hero sections yet. Click "Add Hero" to create one.</div>}
            </div>
          </div>
        )}

        {/* NAVIGATION */}
        {tab === "navigation" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-800">Navigation Menu</h2>
              <button onClick={() => openModal("nav")} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-4 py-2 rounded-xl text-sm font-semibold transition">
                <Plus size={16} /> Add Menu Item
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 px-5 py-3">Order</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 px-5 py-3">Label</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 px-5 py-3">Link</th>
                    <th className="text-right text-xs font-semibold uppercase tracking-wider text-slate-500 px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {navItems.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-5 py-3 text-sm text-slate-500 font-mono">{item.order}</td>
                      <td className="px-5 py-3 text-sm font-semibold text-slate-800">{item.label}</td>
                      <td className="px-5 py-3 text-sm text-blue-600 font-mono">{item.href}</td>
                      <td className="px-5 py-3 flex justify-end gap-2">
                        <button onClick={() => openModal("nav", item)} className="p-1.5 rounded-lg hover:bg-slate-100 transition text-slate-500"><Pencil size={14} /></button>
                        <button onClick={() => deleteNav(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition text-red-500"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                  {navItems.length === 0 && <tr><td colSpan={4} className="text-center py-12 text-slate-400 text-sm">No navigation items yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {tab === "products" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Product Catalog</h2>
                <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                  <Package size={14} className="text-amber-500" /> Managing {products.length} high-performance sports surfaces
                </p>
              </div>
              <button
                onClick={() => openModal("product")}
                className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl text-sm font-bold transition shadow-xl shadow-slate-900/10 active:scale-95"
              >
                <Plus size={18} /> New Product
              </button>
            </div>

            <div className="relative mb-8 group">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
              <input
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                placeholder="Search by name, category, or subcategory..."
                className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-base shadow-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400 transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products
                .filter(p => !productSearch || [p.name, p.category, p.subCategory?.name].some(v => v?.toLowerCase().includes(productSearch.toLowerCase())))
                .map(p => (
                <div key={p.id} className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden flex flex-col">
                  {/* Image/Header area */}
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={p.name} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Package size={48} strokeWidth={1} />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {p.isFeatured && <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-amber-400/20">Featured</span>}
                      {p.isNew && <span className="bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/20">New</span>}
                    </div>
                  </div>

                  {/* Body area */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md uppercase tracking-wider">{p.category}</span>
                      {p.subCategory?.name && (
                        <>
                          <ChevronDown size={10} className="text-slate-300 -rotate-90" />
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md uppercase tracking-wider">{p.subCategory.name}</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 line-clamp-1 mb-2 group-hover:text-amber-600 transition-colors uppercase">{p.name}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-4">{p.description}</p>

                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <ImageIcon size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          {p.imagesJson ? JSON.parse(p.imagesJson).length : 1} Images
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Settings size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          {p.specs ? JSON.parse(p.specs).length : 0} Specs
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions area */}
                  <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex gap-3">
                    <button
                      onClick={() => openModal("product", p)}
                      className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors active:scale-95"
                    >
                      <Pencil size={14} className="text-slate-400" /> Edit Details
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="p-2.5 text-red-500 border border-transparent hover:border-red-100 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                      title="Delete Product"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <div className="bg-white rounded-[2rem] border-2 border-dashed border-slate-100 p-20 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <Package size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No products in catalog</h3>
                <p className="text-slate-500 mb-8 max-w-xs mx-auto">Start by adding your first sports surface solution to showcase to your clients.</p>
                <button onClick={() => openModal("product")} className="bg-amber-500 hover:bg-amber-400 text-white px-8 py-3 rounded-2xl font-bold transition">Add Now</button>
              </div>
            )}
          </div>
        )}

        {/* CATEGORIES */}
        {tab === "categories" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-800">Categories ({categories.length})</h2>
              <button onClick={() => openModal("category")} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-4 py-2 rounded-xl text-sm font-semibold transition">
                <Plus size={16} /> Add Category
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {categories.map(c => (
                <div key={c.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
                  {/* ... (category content) ... */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden">
                      {c.imageUrl ? <img src={c.imageUrl} alt="" className="w-full h-full object-cover" /> : <Palette size={18} />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{c.label}</p>
                      <p className="text-xs text-slate-400">Order: {c.order}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openModal("category", c)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><Pencil size={14} /></button>
                    <button onClick={() => deleteCategory(c.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-600"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-800">Sub Categories ({subCategories.length})</h2>
              <button onClick={() => openModal("subcategory")} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-4 py-2 rounded-xl text-sm font-semibold transition">
                <Plus size={16} /> Add SubCategory
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
              {subCategories.map(sc => (
                <div key={sc.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-slate-800 text-sm">{sc.name}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-wider">{sc.category?.label || "No Category"}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openModal("subcategory", sc)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><Pencil size={14} /></button>
                    <button onClick={() => deleteSubCategory(sc.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-600"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
              {subCategories.length === 0 && <div className="p-10 text-center text-slate-400 text-sm">No subcategories found.</div>}
            </div>
          </div>
        )}

        {/* HOMEPAGE GRID */}
        {tab === "homepage" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-800">Homepage Grid Items ({homepageGridItems.length})</h2>
              <button onClick={() => openModal("homepage")} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-4 py-2 rounded-xl text-sm font-semibold transition">
                <Plus size={16} /> Add Grid Card
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {homepageGridItems.map(c => (
                <div key={c.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden">
                      {c.imageUrl ? <img src={c.imageUrl} alt="" className="w-full h-full object-cover" /> : <Palette size={18} />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{c.label}</p>
                      <p className="text-xs text-slate-400">Order: {c.order}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openModal("homepage", c)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><Pencil size={14} /></button>
                    <button onClick={() => deleteHomepageGridItem(c.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-600"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TICKER UPDATES */}
        {tab === "ticker" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-800">Announcement Ticker ({tickerItems.length})</h2>
              <button onClick={() => openModal("ticker")} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-4 py-2 rounded-xl text-sm font-semibold transition">
                <Plus size={16} /> Add Update
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col divide-y divide-slate-50">
              {tickerItems.map(tk => (
                <div key={tk.id} className="p-4 hover:bg-slate-50/50 transition flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{tk.text}</p>
                    <p className="text-xs text-slate-400">Order: {tk.order}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openModal("ticker", tk)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><Pencil size={14} /></button>
                    <button onClick={() => deleteTicker(tk.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-600"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
              {tickerItems.length === 0 && <div className="p-12 text-center text-slate-400 text-sm">No ticker items found.</div>}
            </div>
          </div>
        )}

        {/* PROJECTS */}
        {tab === "projects" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-800">Projects ({projects.length})</h2>
              <button onClick={() => openModal("project")} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-4 py-2 rounded-xl text-sm font-semibold transition">
                <Plus size={16} /> Add Project
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map(p => (
                <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group">
                  {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-full h-36 object-cover" onError={e => (e.currentTarget.style.display = "none")} />}
                  <div className="p-4">
                    <h3 className="font-bold text-slate-800 text-sm leading-snug">{p.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{p.city}, {p.state} · {p.year}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{p.surface} · {p.area}</p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => openModal("project", p)} className="flex items-center gap-1.5 text-xs border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition"><Pencil size={12} /> Edit</button>
                      <button onClick={() => deleteProject(p.id)} className="flex items-center gap-1.5 text-xs border border-red-200 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"><Trash2 size={12} /> Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {projects.length === 0 && <div className="col-span-3 text-center py-16 text-slate-400">No projects yet.</div>}
            </div>
          </div>
        )}

        {/* TESTIMONIALS */}
        {tab === "testimonials" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-800">Testimonials</h2>
              <button onClick={() => openModal("testimonial")} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-4 py-2 rounded-xl text-sm font-semibold transition">
                <Plus size={16} /> Add Testimonial
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {testimonials.map(t => (
                <div key={t.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">{t.avatar || t.name[0]}</div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.institution}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 italic">"{t.quote}"</p>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => openModal("testimonial", t)} className="flex items-center gap-1.5 text-xs border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition"><Pencil size={12} /> Edit</button>
                    <button onClick={() => deleteTestimonial(t.id)} className="flex items-center gap-1.5 text-xs border border-red-200 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"><Trash2 size={12} /> Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS */}
        {tab === "users" && (
          <div>
            <h2 className="text-2xl font-black text-slate-800 mb-4">User Management</h2>
            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search users..." className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 px-5 py-3">Name</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 px-5 py-3">Email</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 px-5 py-3">Role</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 px-5 py-3">Status</th>
                    <th className="text-right text-xs font-semibold uppercase tracking-wider text-slate-500 px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-5 py-3 text-sm font-medium text-slate-800">{u.name || "—"}</td>
                      <td className="px-5 py-3 text-sm text-slate-500">{u.email || "—"}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${u.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600"}`}>{u.role}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${u.emailVerified ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                          {u.emailVerified ? "Verified" : "Unverified"}
                        </span>
                      </td>
                      <td className="px-5 py-3 flex justify-end">
                        <button onClick={() => deleteUser(u.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition text-red-500"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-slate-400 text-sm">No users found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {tab === "settings" && (
          <div>
            <h2 className="text-2xl font-black text-slate-800 mb-6">Site Settings</h2>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 max-w-2xl space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Site Name" name="siteName" value={settings.siteName} onChange={e => setSettings(s => ({ ...s, siteName: e.target.value }))} required />
                <Field label="Logo URL" name="logoUrl" value={settings.logoUrl || ""} onChange={e => setSettings(s => ({ ...s, logoUrl: e.target.value }))} />
              </div>

              <div className="border-t border-slate-100 pt-5">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2"><Palette size={14} /> Colors</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={settings.primaryColor} onChange={e => setSettings(s => ({ ...s, primaryColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
                      <input type="text" value={settings.primaryColor} onChange={e => setSettings(s => ({ ...s, primaryColor: e.target.value }))} className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Secondary Color</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={settings.secondaryColor} onChange={e => setSettings(s => ({ ...s, secondaryColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
                      <input type="text" value={settings.secondaryColor} onChange={e => setSettings(s => ({ ...s, secondaryColor: e.target.value }))} className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2"><Type size={14} /> Typography</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Heading Font" name="fontHeading" value={settings.fontHeading} onChange={e => setSettings(s => ({ ...s, fontHeading: e.target.value }))} />
                  <Field label="Body Font" name="fontBody" value={settings.fontBody} onChange={e => setSettings(s => ({ ...s, fontBody: e.target.value }))} />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2"><LayoutDashboard size={14} /> Layout Visibility</h3>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 transition">
                    <input type="checkbox" checked={!!settings.showCategoryBar} onChange={e => setSettings(s => ({ ...s, showCategoryBar: e.target.checked }))} className="w-4 h-4 accent-amber-500" />
                    <span className="text-slate-700">Category Ribbon</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 transition">
                    <input type="checkbox" checked={!!settings.showTicker} onChange={e => setSettings(s => ({ ...s, showTicker: e.target.checked }))} className="w-4 h-4 accent-amber-500" />
                    <span className="text-slate-700">Announcement Ticker bar</span>
                  </label>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2"><LayoutDashboard size={14} /> CTA Bottom Banner</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="CTA Title" name="ctaTitle" value={settings.ctaTitle || ""} onChange={e => setSettings(s => ({ ...s, ctaTitle: e.target.value }))} />
                  <Field label="Button Text" name="ctaButton" value={settings.ctaButton || ""} onChange={e => setSettings(s => ({ ...s, ctaButton: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Field label="CTA Subtitle" name="ctaSubtitle" value={settings.ctaSubtitle || ""} onChange={e => setSettings(s => ({ ...s, ctaSubtitle: e.target.value }))} />
                  <Field label="Redirect Link" name="ctaLink" value={settings.ctaLink || ""} onChange={e => setSettings(s => ({ ...s, ctaLink: e.target.value }))} />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2"><LayoutDashboard size={14} /> Stat Counters & Certifications (JSON Array format)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Stats Json (value/label)" name="statsJson" value={settings.statsJson || "[]"} onChange={e => setSettings(s => ({ ...s, statsJson: e.target.value }))} textarea />
                  <Field label="Certifications Json (title/imageUrl)" name="certsJson" value={settings.certsJson || "[]"} onChange={e => setSettings(s => ({ ...s, certsJson: e.target.value }))} textarea />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2"><Link2 size={14} /> Contact Info</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Email" name="contactEmail" value={settings.contactEmail || ""} onChange={e => setSettings(s => ({ ...s, contactEmail: e.target.value }))} />
                  <Field label="Phone" name="contactPhone" value={settings.contactPhone || ""} onChange={e => setSettings(s => ({ ...s, contactPhone: e.target.value }))} />
                </div>
                <Field label="Address" name="address" value={settings.address || ""} onChange={e => setSettings(s => ({ ...s, address: e.target.value }))} textarea />
              </div>

              <button onClick={saveSettings} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition">
                <Save size={16} /> Save Settings
              </button>
            </div>
          </div>
        )}
        {tab === "pages" && (
          <div>
            <h2 className="text-2xl font-black text-slate-800 mb-6">About & Contact Page Content</h2>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 max-w-4xl space-y-10">
              
              {/* About Page */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Star className="text-amber-500" size={18} /> About Page: Hero & Story
                </h3>
                <Field label="Hero Story Text" name="aboutText" value={settings.aboutText || ""} onChange={e => setSettings(s => ({ ...s, aboutText: e.target.value }))} textarea />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Origin Section Title" name="aboutOriginTitle" value={settings.aboutOriginTitle || ""} onChange={e => setSettings(s => ({ ...s, aboutOriginTitle: e.target.value }))} />
                  <Field label="Origin Section Description" name="aboutOriginText" value={settings.aboutOriginText || ""} onChange={e => setSettings(s => ({ ...s, aboutOriginText: e.target.value }))} textarea />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <Field label="Values Cards (JSON: title, icon, text)" name="valuesJson" value={settings.valuesJson || "[]"} onChange={e => setSettings(s => ({ ...s, valuesJson: e.target.value }))} textarea />
                  <Field label="History Timeline (JSON: year, title, text)" name="timelineJson" value={settings.timelineJson || "[]"} onChange={e => setSettings(s => ({ ...s, timelineJson: e.target.value }))} textarea />
                </div>
              </div>

              {/* Contact Page */}
              <div className="space-y-6 pt-4 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Phone className="text-amber-500" size={18} /> Contact Page: Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Office Hours" name="officeHours" value={settings.officeHours || ""} onChange={e => setSettings(s => ({ ...s, officeHours: e.target.value }))} />
                  <Field label="WhatsApp Number" name="whatsappNumber" value={settings.whatsappNumber || ""} onChange={e => setSettings(s => ({ ...s, whatsappNumber: e.target.value }))} />
                  <Field label="Service Coverage Area" name="serviceArea" value={settings.serviceArea || ""} onChange={e => setSettings(s => ({ ...s, serviceArea: e.target.value }))} />
                </div>
              </div>

              <div className="pt-6">
                <button onClick={saveSettings} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-8 py-3 rounded-xl text-sm font-bold transition shadow-lg shadow-amber-500/20">
                  <Save size={18} /> Update Page Content
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========= MODALS ========= */}

      {modal?.type === "hero" && (
        <Modal title={formData.id ? "Edit Hero Section" : "Add Hero Section"} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Field label="Page" name="page" value={formData.page || ""} onChange={handleFormChange} required />
            <Field label="Title" name="title" value={formData.title || ""} onChange={handleFormChange} required />
            <Field label="Subtitle" name="subtitle" value={formData.subtitle || ""} onChange={handleFormChange} textarea />
            <Field label="Image URL" name="imageUrl" value={formData.imageUrl || ""} onChange={handleFormChange} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="CTA Text" name="ctaText" value={formData.ctaText || ""} onChange={handleFormChange} />
              <Field label="CTA Link" name="ctaLink" value={formData.ctaLink || ""} onChange={handleFormChange} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Text Color</label>
              <input type="color" name="textColor" value={formData.textColor || "#ffffff"} onChange={handleFormChange} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
            </div>
            <button onClick={saveHero} className="w-full bg-amber-500 hover:bg-amber-400 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2">
              <Save size={16} /> Save Hero
            </button>
          </div>
        </Modal>
      )}

      {modal?.type === "homepage" && (
        <Modal title={formData.id ? "Edit Grid Card" : "Add Grid Card"} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Field label="Card Title" name="label" value={formData.label || ""} onChange={handleFormChange} required />
            <Field label="Short Description" name="description" value={formData.description || ""} onChange={handleFormChange} textarea />
            <Field label="Image URL (Background)" name="imageUrl" value={formData.imageUrl || ""} onChange={handleFormChange} />
            <Field label="Link (href)" name="href" value={formData.href || ""} onChange={handleFormChange} />
            <Field label="Display Order" name="order" value={formData.order || 0} onChange={handleFormChange} type="number" />
            <button onClick={saveHomepageGridItem} className="w-full bg-amber-500 hover:bg-amber-400 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2">
              <Save size={16} /> Save Card
            </button>
          </div>
        </Modal>
      )}

      {modal?.type === "nav" && (
        <Modal title={formData.id ? "Edit Menu Item" : "Add Menu Item"} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Field label="Label" name="label" value={formData.label || ""} onChange={handleFormChange} required />
            <Field label="Link (href)" name="href" value={formData.href || ""} onChange={handleFormChange} required />
            <Field label="Order" name="order" value={formData.order || 0} onChange={handleFormChange} type="number" />
            <button onClick={saveNav} className="w-full bg-amber-500 hover:bg-amber-400 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2">
              <Save size={16} /> Save
            </button>
          </div>
        </Modal>
      )}

      {modal?.type === "category" && (
        <Modal title={formData.id ? "Edit Navbar Category" : "Add Navbar Category"} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Field label="Category Name" name="label" value={formData.label || ""} onChange={handleFormChange} required />
            <Field label="Description" name="description" value={formData.description || ""} onChange={handleFormChange} textarea />
            <Field label="Navbar Icon SVG" name="iconSvg" value={formData.iconSvg || ""} onChange={handleFormChange} textarea />
            <Field label="Background Image URL" name="imageUrl" value={formData.imageUrl || ""} onChange={handleFormChange} />
            <Field label="Navbar Icon URL" name="navbarIconUrl" value={formData.navbarIconUrl || ""} onChange={handleFormChange} />
            <Field label="Routing Page URL" name="href" value={formData.href || ""} onChange={handleFormChange} />
            <Field label="Display Order" name="order" value={formData.order || 0} onChange={handleFormChange} type="number" />
            
            <button onClick={saveCategory} className="w-full bg-amber-500 hover:bg-amber-400 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2">
              <Save size={16} /> Save Category
            </button>
          </div>
        </Modal>
      )}

      {modal?.type === "ticker" && (
        <Modal title={formData.id ? "Edit Announcement" : "Add Announcement"} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Field label="Announcement Text" name="text" value={formData.text || ""} onChange={handleFormChange} required />
            <Field label="Display Order" name="order" value={formData.order || 0} onChange={handleFormChange} type="number" />
            <button onClick={saveTicker} className="w-full bg-amber-500 hover:bg-amber-400 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2">
              <Save size={16} /> Save Announcement
            </button>
          </div>
        </Modal>
      )}

      {modal?.type === "product" && (
        <Modal title={formData.id ? "Edit Product Profile" : "Create New Product"} onClose={() => setModal(null)}>
          <div className="space-y-8 pb-10">
            {/* SECTION: PRIMARY DETAILS */}
            <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 space-y-4">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <LayoutDashboard size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Primary Details</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Product Name" name="name" value={formData.name || ""} onChange={handleFormChange} required />
                <Field label="URL Slug (unique)" name="slug" value={formData.slug || ""} onChange={handleFormChange} required />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5 px-1">Category</label>
                  <select 
                    name="category" 
                    value={formData.category || ""} 
                    onChange={handleFormChange} 
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400 transition-all font-medium"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.label}>{c.label}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5 px-1">Sub-Category</label>
                  <select 
                    name="subCategoryId" 
                    value={formData.subCategoryId || ""} 
                    onChange={handleFormChange} 
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400 transition-all font-medium"
                  >
                    <option value="">No Sub Category</option>
                    {subCategories
                      .filter(sc => !formData.category || sc.category?.label === formData.category)
                      .map(sc => <option key={sc.id} value={sc.id}>{sc.name}</option>)
                    }
                  </select>
                </div>
              </div>
              <Field label="Short Marketing Description" name="description" value={formData.description || ""} onChange={handleFormChange} required textarea />
            </div>

            {/* SECTION: MEDIA & ACTIONS */}
            <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 space-y-4">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <ImageIcon size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Media & Visuals</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Thumbnail Cover (URL)" name="imageUrl" value={formData.imageUrl || ""} onChange={handleFormChange} />
                <Field label="CSS Height Class (Default: h-[400px])" name="heightClass" value={formData.heightClass || "h-[400px]"} onChange={handleFormChange} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5 px-1">Image Gallery (JSON List of URLs)</label>
                <textarea 
                  name="imagesJson" 
                  value={formData.imagesJson || "[]"} 
                  onChange={handleFormChange} 
                  className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs font-mono h-24 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400 transition-all"
                  placeholder='["/img/p1.jpg", "/img/p2.jpg"]'
                />
              </div>
            </div>

            {/* SECTION: DATA STRUCTURES */}
            <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 space-y-4">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Settings size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Technical Data (JSON)</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5 px-1">Specifications (Label/Value Pairs)</label>
                <textarea 
                  name="specs" 
                  value={formData.specs || "[]"} 
                  onChange={handleFormChange} 
                  className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs font-mono h-32 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400 transition-all"
                  placeholder='[{"label": "Thickness", "value": "15mm"}]'
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5 px-1">"Why Invest" Points (Icon, Title, Desc)</label>
                <textarea 
                  name="whyInvestJson" 
                  value={formData.whyInvestJson || "[]"} 
                  onChange={handleFormChange} 
                  className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs font-mono h-32 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400 transition-all"
                  placeholder='[{"icon": "TrendingUp", "title": "Durability", "desc": "Built to last"}]'
                />
              </div>
            </div>

            {/* SECTION: PREMIUM SERVICES */}
            <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 space-y-4">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Star size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Product Detail Page: Rich Content</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Services Title" name="servicesTitle" value={formData.servicesTitle || "Premium Services"} onChange={handleFormChange} />
                <Field label="Premium Benefits (JSON Array: String[])" name="premiumBenefitsJson" value={formData.premiumBenefitsJson || "[]"} onChange={handleFormChange} textarea />
              </div>
              <Field label="Services Subtitle" name="servicesSubtitle" value={formData.servicesSubtitle || ""} onChange={handleFormChange} textarea />
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5 px-1">Service Items (JSON: Icon, Title, Desc)</label>
                <textarea 
                  name="servicesJson" 
                  value={formData.servicesJson || "[]"} 
                  onChange={handleFormChange} 
                  className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs font-mono h-32 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400 transition-all"
                  placeholder='[{"icon": "PenTool", "title": "Expert Consultation"}]'
                />
              </div>
            </div>

            {/* FLAGS */}
            <div className="flex gap-4 p-5 bg-amber-50 rounded-3xl border border-amber-100">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="isNew" checked={!!formData.isNew} onChange={handleFormChange} className="w-5 h-5 accent-amber-500 rounded-lg" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-700">New Arrival</span>
                  <span className="text-[10px] text-slate-500 uppercase font-black">Flash Badge</span>
                </div>
              </label>
              <div className="w-[1px] bg-amber-200 my-1"></div>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="isFeatured" checked={!!formData.isFeatured} onChange={handleFormChange} className="w-5 h-5 accent-amber-500 rounded-lg" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-700">Featured</span>
                  <span className="text-[10px] text-slate-500 uppercase font-black">Priority Placement</span>
                </div>
              </label>
            </div>

            <button 
              onClick={saveProduct} 
              className="group w-full bg-slate-900 hover:bg-black text-white py-5 rounded-[2rem] font-black text-lg transition-all flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20 active:scale-95 border-t border-slate-700/50"
            >
              <Save size={20} className="text-amber-500 group-hover:scale-125 transition-transform" /> {formData.id ? "UPDATE PRODUCT" : "PUBLISH PRODUCT"}
            </button>
          </div>
        </Modal>
      )}

      {modal?.type === "subcategory" && (
        <Modal title={formData.id ? "Edit SubCategory" : "Add SubCategory"} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Field label="Sub Category Name" name="name" value={formData.name || ""} onChange={handleFormChange} required />
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Parent Category</label>
              <select name="categoryId" value={formData.categoryId || ""} onChange={handleFormChange} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                <option value="">Select Parent Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <Field label="Display Order" name="order" value={formData.order || 0} onChange={handleFormChange} type="number" />
            <button onClick={saveSubCategory} className="w-full bg-amber-500 hover:bg-amber-400 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20">
              <Save size={16} /> Save SubCategory
            </button>
          </div>
        </Modal>
      )}

      {modal?.type === "project" && (
        <Modal title={formData.id ? "Edit Project" : "Add Project"} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Field label="Project Name" name="name" value={formData.name || ""} onChange={handleFormChange} required />
            <div className="grid grid-cols-2 gap-4">
              <Field label="City" name="city" value={formData.city || ""} onChange={handleFormChange} required />
              <Field label="State" name="state" value={formData.state || ""} onChange={handleFormChange} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Surface Type" name="surface" value={formData.surface || ""} onChange={handleFormChange} required />
              <Field label="Area (sqm)" name="area" value={formData.area || ""} onChange={handleFormChange} required />
            </div>
            <Field label="Year" name="year" value={formData.year || ""} onChange={handleFormChange} required />
            <Field label="Image URL" name="imageUrl" value={formData.imageUrl || ""} onChange={handleFormChange} />
            <button onClick={saveProject} className="w-full bg-amber-500 hover:bg-amber-400 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2">
              <Save size={16} /> Save Project
            </button>
          </div>
        </Modal>
      )}

      {modal?.type === "testimonial" && (
        <Modal title={formData.id ? "Edit Testimonial" : "Add Testimonial"} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Field label="Name" name="name" value={formData.name || ""} onChange={handleFormChange} required />
            <Field label="Institution" name="institution" value={formData.institution || ""} onChange={handleFormChange} required />
            <Field label="Quote" name="quote" value={formData.quote || ""} onChange={handleFormChange} required textarea />
            <Field label="Avatar Initials" name="avatar" value={formData.avatar || ""} onChange={handleFormChange} />
            <button onClick={saveTestimonial} className="w-full bg-amber-500 hover:bg-amber-400 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2">
              <Save size={16} /> Save
            </button>
          </div>
        </Modal>
      )}

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-600 mx-auto mb-4">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Are you sure?</h3>
              <p className="text-slate-500 text-sm">{confirmModal.title}</p>
            </div>
            <div className="flex border-t border-slate-100">
              <button onClick={() => setConfirmModal(null)} className="flex-1 py-4 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition border-r border-slate-100">Cancel</button>
              <button onClick={confirmModal.onConfirm} className="flex-1 py-4 text-sm font-semibold text-red-600 hover:bg-red-50 transition">Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}
