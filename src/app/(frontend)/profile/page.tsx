"use client";

import { useState, useEffect } from "react";
import { User, Settings, Package, Bell, LogOut, ChevronRight, CircleUser } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [userActivity, setUserActivity] = useState<any[]>([]);
  const [userStats, setUserStats] = useState({ activeQuotes: 0, siteVisits: 0, serviceRequests: 0 });
  const [loadingActivity, setLoadingActivity] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/profile");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user/activity")
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) {
            setUserActivity(data.activity || []);
            setUserStats(data.stats || { activeQuotes: 0, siteVisits: 0, serviceRequests: 0 });
          }
          setLoadingActivity(false);
        })
        .catch(() => setLoadingActivity(false));
    }
  }, [status]);

  if (status === "loading" || (status === "authenticated" && loadingActivity)) {
    return (
      <div className="pt-12 min-h-screen bg-ag-bg flex items-center justify-center ">
        <div className="w-8 h-8 rounded-full border-2 border-ag-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!session) return null;

  const tabs = [
    { label: "Dashboard", icon: <User size={18} /> },
    { label: "Project Quotes", icon: <Package size={18} />, count: userStats.activeQuotes > 0 ? userStats.activeQuotes : undefined },
    { label: "Notifications", icon: <Bell size={18} />, count: userStats.siteVisits > 0 ? userStats.siteVisits : undefined },
    { label: "Account Settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="pt-12 bg-ag-bg min-h-screen pb-20">
      <div className="container-retail">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
            <div className="w-24 h-24 rounded-full bg-ag-primary/10 border-2 border-ag-primary flex items-center justify-center text-ag-primary">
               <CircleUser size={48} />
            </div>
            <div className="text-center md:text-left space-y-1">
               <h1 className="font-heading font-black text-3xl md:text-5xl text-ag-text uppercase tracking-tight leading-none">
                 My <span className="text-ag-primary">Antigravity</span>
               </h1>
               <p className="font-body text-ag-text-muted text-sm font-bold uppercase tracking-widest">
                 {session.user?.name || "User"} • {session.user?.email}
               </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar Nav */}
            <div className="lg:col-span-1 space-y-2">
               {tabs.map((item, i) => (
                 <button 
                   key={i} 
                   onClick={() => setActiveTab(item.label)}
                   className={`w-full flex items-center justify-between p-4 rounded-lg transition-all ${activeTab === item.label ? "bg-ag-primary text-white shadow-lg shadow-ag-primary/20" : "hover:bg-ag-bg-alt text-ag-text-muted hover:text-ag-text"}`}
                 >
                   <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="text-[11px] font-bold uppercase tracking-wider">{item.label}</span>
                   </div>
                   {item.count && (
                     <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${activeTab === item.label ? "bg-white text-ag-primary" : "bg-ag-primary text-white"}`}>
                        {item.count}
                     </span>
                   )}
                 </button>
               ))}
               <button onClick={() => signOut({ callbackUrl: "/login" })} className="w-full flex items-center gap-3 p-4 rounded-lg text-red-500 hover:bg-red-500/5 transition-all mt-8">
                  <LogOut size={18} />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Logout Session</span>
               </button>
            </div>

            {/* Main Content Dashboard */}
            <div className="lg:col-span-3 space-y-8">
               {activeTab === "Dashboard" && (
                 <>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { label: "Active Quotes", value: String(userStats.activeQuotes).padStart(2, "0") },
                        { label: "Site Visits", value: String(userStats.siteVisits).padStart(2, "0") },
                        { label: "Service Request", value: String(userStats.serviceRequests).padStart(2, "0") }
                      ].map((stat, i) => (
                        <div key={i} className="retail-card p-6 bg-white flex flex-col items-center">
                           <span className="text-[10px] font-black text-ag-text-muted uppercase tracking-[0.2em] mb-2">{stat.label}</span>
                           <span className="text-4xl font-heading font-black text-ag-primary">{stat.value}</span>
                        </div>
                      ))}
                   </div>

                   <div className="retail-card overflow-hidden">
                      <div className="p-6 border-b border-ag-border flex justify-between items-center bg-ag-bg-alt/30">
                         <h3 className="font-body font-black text-ag-text text-[11px] uppercase tracking-widest">Recent Activity</h3>
                         <button onClick={() => setActiveTab("Project Quotes")} className="text-[10px] font-black text-ag-primary hover:underline uppercase tracking-widest">Full History</button>
                      </div>
                      <div className="divide-y divide-ag-border">
                         {userActivity.length > 0 ? (
                           userActivity.slice(0, 5).map((row, i) => (
                             <div key={i} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-ag-bg-alt/20 transition-colors">
                                <div className="space-y-1">
                                   <p className="text-sm font-bold text-ag-text line-clamp-1">{row.surface || "Quote Request"}</p>
                                   <p className="text-[11px] text-ag-text-muted font-medium uppercase tracking-wide">{row.city || "General Inquiry"}</p>
                                </div>
                                <div className="flex items-center gap-8">
                                   <div className="text-right">
                                      <span className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter ${row.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-ag-primary/10 text-ag-primary'}`}>{row.status}</span>
                                      <p className="text-[9px] text-ag-text-muted font-bold mt-1 uppercase">{new Date(row.createdAt).toLocaleDateString()}</p>
                                   </div>
                                   <ChevronRight size={16} className="text-ag-text-muted" />
                                </div>
                             </div>
                           ))
                         ) : (
                           <div className="p-12 text-center text-ag-text-muted text-xs font-bold uppercase tracking-widest italic">
                              No recent activity found.
                           </div>
                         )}
                      </div>
                   </div>
                 </>
               )}

               {activeTab === "Project Quotes" && (
                  <div className="retail-card">
                     <div className="p-6 border-b border-ag-border bg-ag-bg-alt/30">
                        <h3 className="font-heading font-black text-xs uppercase tracking-widest text-ag-text">Project Quotes</h3>
                     </div>
                     <div className="p-12 text-center flex flex-col items-center justify-center">
                        <Package size={48} className="text-ag-text-muted/30 mb-4" />
                        <h4 className="font-body font-bold text-sm text-ag-text">No Active Quotes</h4>
                        <p className="font-body text-ag-text-muted text-xs mt-1">Submit a request to initialize flat map triggers flawlessly.</p>
                     </div>
                  </div>
               )}

               {activeTab === "Notifications" && (
                  <div className="retail-card">
                     <div className="p-6 border-b border-ag-border bg-ag-bg-alt/30">
                        <h3 className="font-heading font-black text-xs uppercase tracking-widest text-ag-text">Notifications</h3>
                     </div>
                     <div className="divide-y divide-ag-border">
                        {[
                          { title: "Quote Updated", desc: "Your request for Gurgaon Stadium has been updated.", date: "2 Hours Ago" },
                          { title: "Site Visit Confirmed", desc: "Consultation scheduled for tomorrow 11:30 AM.", date: "Yesterday" }
                        ].map((n, i) => (
                           <div key={i} className="p-6 hover:bg-ag-bg-alt/10 transition-colors flex justify-between items-start gap-4">
                              <div className="space-y-1">
                                 <p className="text-sm font-bold text-ag-text">{n.title}</p>
                                 <p className="text-xs text-ag-text-muted">{n.desc}</p>
                              </div>
                              <span className="text-[9px] font-black text-ag-primary uppercase shrink-0">{n.date}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {activeTab === "Account Settings" && (
                  <div className="retail-card">
                     <div className="p-6 border-b border-ag-border bg-ag-bg-alt/30">
                        <h3 className="font-heading font-black text-xs uppercase tracking-widest text-ag-text">Account Settings</h3>
                     </div>
                     <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-1.5">
                              <label className="text-[10px] uppercase tracking-widest font-black text-ag-text-muted">Full Name</label>
                              <input type="text" defaultValue={session.user?.name || ""} className="w-full p-3 border border-ag-border rounded text-sm bg-ag-bg-alt/20" disabled />
                           </div>
                           <div className="space-y-1.5">
                              <label className="text-[10px] uppercase tracking-widest font-black text-ag-text-muted">Email Address</label>
                              <input type="email" defaultValue={session.user?.email || ""} className="w-full p-3 border border-ag-border rounded text-sm bg-ag-bg-alt/20" disabled />
                           </div>
                        </div>
                        <div className="pt-4 border-t border-ag-border">
                           <button className="bg-ag-primary text-white text-[11px] font-black uppercase tracking-wider px-6 py-3 rounded shadow hover:bg-opacity-90 transition-all">
                              Update Profile
                           </button>
                        </div>
                     </div>
                  </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
