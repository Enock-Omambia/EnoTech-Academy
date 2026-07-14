import React, { useState } from "react";
import {
  Bell,
  Plus,
  Bookmark,
  Calendar,
  User,
  Trash2,
  Filter,
  CheckCircle,
  X,
  Megaphone,
  Clock,
  Pin,
  Building,
  AlertCircle
} from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  audience: "Everyone" | "Students Only" | "Instructors Only";
  date: string;
  author: string;
  isPinned: boolean;
}

interface AnnouncementsPageProps {
  darkMode: boolean;
}

export default function AnnouncementsPage({
  darkMode
}: AnnouncementsPageProps) {
  // Mock announcements list
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: "ANN-001",
      title: "Resumption of physical laboratory sessions in Kisii center",
      content: "We are pleased to inform all students registered in Cisco and Advanced Programming modules that physical lab equipment proctoring has fully resumed. Book your lab chair in settings.",
      audience: "Everyone",
      date: "2026-07-01",
      author: "Principal Enock Omato",
      isPinned: true
    },
    {
      id: "ANN-002",
      title: "Mid-Term Python & SQL evaluation schedule",
      content: "All tutors must formulate and submit mid-term evaluation assessment question sets by Friday. Theoretical multiple choice tests will intake on the exam module starting July 15.",
      audience: "Instructors Only",
      date: "2026-07-05",
      author: "Registrar Office",
      isPinned: false
    }
  ]);

  // States
  const [showAddModal, setShowAddModal] = useState(false);
  const [audienceFilter, setAudienceFilter] = useState("All");

  // Form state
  const [newAnn, setNewAnn] = useState({
    title: "",
    content: "",
    audience: "Everyone" as const,
    isPinned: false
  });

  const handlePostAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnn.title || !newAnn.content) return;

    const created: Announcement = {
      id: `ANN-00${announcements.length + 1}`,
      title: newAnn.title,
      content: newAnn.content,
      audience: newAnn.audience,
      date: new Date().toISOString().split("T")[0],
      author: "Principal Enock Omato",
      isPinned: newAnn.isPinned
    };

    setAnnouncements([created, ...announcements]);
    setShowAddModal(false);
    // Reset
    setNewAnn({
      title: "",
      content: "",
      audience: "Everyone",
      isPinned: false
    });
    alert(`Board announcement "${created.title}" published and broadcasted successfully!`);
  };

  const filteredAnnouncements = announcements.filter(ann => {
    if (audienceFilter === "All") return true;
    return ann.audience === audienceFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Institution Broadcasts & Announcements</h2>
          <p className="text-xs text-slate-400">Manage and publish official board notifications, course syllabus updates, and scheduled academic bulletins.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" /> Publish Announcement
        </button>
      </div>

      {/* Filters Bar */}
      <div className={`p-4 border rounded-xl shadow-xs flex items-center justify-between ${
        darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
      }`}>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-bold text-slate-400">Target Audience:</span>
          
          <div className="flex gap-1.5">
            {["All", "Everyone", "Students Only", "Instructors Only"].map(filterVal => {
              const isSelected = audienceFilter === filterVal;
              return (
                <button
                  key={filterVal}
                  onClick={() => setAudienceFilter(filterVal)}
                  className={`px-2.5 py-1 border rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    isSelected ? "bg-cyan-600 text-white border-cyan-500" : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {filterVal}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Announcements Stream feed */}
      <div className="space-y-4">
        {/* Pinned Announcements group */}
        {filteredAnnouncements.filter(a => a.isPinned).map(ann => (
          <div
            key={ann.id}
            className={`p-5 rounded-2xl border bg-gradient-to-br from-cyan-950/20 to-blue-950/10 border-cyan-500/30 space-y-3 relative shadow-md`}
          >
            <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold text-cyan-400 uppercase font-mono">
              <Pin className="w-3 h-3 fill-cyan-400" /> PINNED BROADCAST
            </div>

            <div className="space-y-1">
              <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-bold uppercase rounded">{ann.audience}</span>
              <h3 className="text-sm font-black text-white mt-1.5 flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-cyan-400" /> {ann.title}
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">{ann.content}</p>

            <div className="flex gap-4 text-[10px] text-slate-500 font-mono pt-1">
              <span>Author: <strong>{ann.author}</strong></span>
              <span>Published Date: {ann.date}</span>
            </div>
          </div>
        ))}

        {/* Standard Announcements group */}
        {filteredAnnouncements.filter(a => !a.isPinned).map(ann => (
          <div
            key={ann.id}
            className={`p-5 rounded-2xl border space-y-3 shadow-sm ${
              darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100 text-slate-800"
            }`}
          >
            <div className="space-y-1">
              <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[9px] font-bold uppercase">{ann.audience}</span>
              <h3 className="text-sm font-black text-slate-100 mt-1.5 flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-slate-400" /> {ann.title}
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">{ann.content}</p>

            <div className="flex gap-4 text-[10px] text-slate-500 font-mono pt-1">
              <span>Author: <strong>{ann.author}</strong></span>
              <span>Published Date: {ann.date}</span>
            </div>
          </div>
        ))}

        {filteredAnnouncements.length === 0 && (
          <div className="py-12 text-center text-slate-400 italic text-xs">No official broadcasts logged matching this specific filter.</div>
        )}
      </div>

      {/* =====================================
          MODAL: POST BROADCAST BULLETIN
          ===================================== */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-40 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#0c1220] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-blue-700 via-cyan-600 to-orange-500 h-2"></div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                <h3 className="font-bold text-sm text-white">Publish Broadcaster Bulletin</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handlePostAnnouncementSubmit} className="space-y-4 text-xs text-slate-300">
                <div>
                  <label className="block text-slate-400 mb-1">Broadcaster Header Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Scheduled Maintenance: Systems Upgrade on Kisii Lab Servers"
                    value={newAnn.title}
                    onChange={(e) => setNewAnn({...newAnn, title: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Broadcast Target Audience</label>
                  <select
                    value={newAnn.audience}
                    onChange={(e) => setNewAnn({...newAnn, audience: e.target.value as any})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="Everyone">Everyone (Public Feed)</option>
                    <option value="Students Only">Students Only</option>
                    <option value="Instructors Only">Instructors Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Bulletin Content Narrative *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide specific details of notifications, links, directions or requirements clearly..."
                    value={newAnn.content}
                    onChange={(e) => setNewAnn({...newAnn, content: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Pin options */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAnn.isPinned}
                      onChange={(e) => setNewAnn({...newAnn, isPinned: e.target.checked})}
                      className="accent-cyan-500 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <span className="font-extrabold text-white text-[11px] block">Pin Broadcast Bulletin</span>
                      <span className="text-[9px] text-slate-500 block mt-0.5">Places this broadcast at the absolute top of the board with a high-priority flag.</span>
                    </div>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
                >
                  Publish Broadcast bulletin
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
