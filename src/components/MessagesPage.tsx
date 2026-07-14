import React, { useState } from "react";
import {
  Mail,
  Send,
  Plus,
  Search,
  X,
  Clock,
  User,
  Paperclip,
  Check,
  AlertCircle,
  AlertTriangle,
  Bell,
  Trash2,
  Bookmark
} from "lucide-react";
import { Student } from "../types";

interface ChatMessage {
  id: string;
  senderName: string;
  senderRole: string;
  content: string;
  time: string;
  isSelf: boolean;
}

interface Thread {
  id: string;
  contactName: string;
  contactRole: string;
  unreadCount: number;
  lastMessage: string;
  time: string;
  chats: ChatMessage[];
}

interface MessagesPageProps {
  students: Student[];
  darkMode: boolean;
}

export default function MessagesPage({
  students,
  darkMode
}: MessagesPageProps) {
  // Mock messaging threads
  const [threads, setThreads] = useState<Thread[]>([
    {
      id: "TH-001",
      contactName: "Parent of John Doe",
      contactRole: "Parent",
      unreadCount: 1,
      lastMessage: "Thank you for the update. Will clear the tuition fee balance by Monday.",
      time: "09:40 AM",
      chats: [
        { id: "C-1", senderName: "Principal Omato", senderRole: "Principal", content: "Hello! Just a reminder that John's advanced SQL class starts at 9am tomorrow.", time: "Yesterday", isSelf: true },
        { id: "C-2", senderName: "Parent of John Doe", senderRole: "Parent", content: "Thank you for the update. Will clear the tuition fee balance by Monday.", time: "09:40 AM", isSelf: false }
      ]
    },
    {
      id: "TH-002",
      contactName: "Instructor Professor Jane",
      contactRole: "Instructor",
      unreadCount: 0,
      lastMessage: "I've uploaded the Python variables practice syllabus.",
      time: "Yesterday",
      chats: [
        { id: "C-3", senderName: "Professor Jane", senderRole: "Instructor", content: "I've uploaded the Python variables practice syllabus.", time: "Yesterday", isSelf: false }
      ]
    }
  ]);

  // States
  const [activeThreadId, setActiveThreadId] = useState("TH-001");
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [replyText, setReplyText] = useState("");

  // Compose Message form state
  const [newMessage, setNewMessage] = useState({
    recipientType: "Parent",
    recipientName: students[0]?.guardian || "General Parent Desk",
    content: "",
    isUrgentSms: false
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setThreads(prev => prev.map(th => {
      if (th.id === activeThreadId) {
        return {
          ...th,
          lastMessage: replyText,
          time: "Just Now",
          chats: [
            ...th.chats,
            {
              id: `C-${Date.now()}`,
              senderName: "Principal Omato",
              senderRole: "Principal",
              content: replyText,
              time: "Just Now",
              isSelf: true
            }
          ]
        };
      }
      return th;
    }));

    setReplyText("");
  };

  const handleComposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.content) return;

    // Create a new thread or append to existing
    const newTh: Thread = {
      id: `TH-${Date.now()}`,
      contactName: newMessage.recipientName,
      contactRole: newMessage.recipientType,
      unreadCount: 0,
      lastMessage: newMessage.content,
      time: "Just Now",
      chats: [
        {
          id: `C-${Date.now()}`,
          senderName: "Principal Omato",
          senderRole: "Principal",
          content: newMessage.content,
          time: "Just Now",
          isSelf: true
        }
      ]
    };

    setThreads([newTh, ...threads]);
    setActiveThreadId(newTh.id);
    setShowComposeModal(false);

    if (newMessage.isUrgentSms) {
      alert(`Urgent parental SMS alert broadcasted to [${newMessage.recipientName}] device terminal successfully!`);
    } else {
      alert(`Message dispatched to recipient ${newMessage.recipientName} inbox database ledger.`);
    }

    // Reset compose
    setNewMessage({
      recipientType: "Parent",
      recipientName: students[0]?.guardian || "General Parent Desk",
      content: "",
      isUrgentSms: false
    });
  };

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Parent-Teacher Messaging Center</h2>
          <p className="text-xs text-slate-400">Dispatch direct text chats to student guardians, verify instructor briefings, and broadcast urgent SMS alerts.</p>
        </div>

        <button
          onClick={() => setShowComposeModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" /> Compose Message
        </button>
      </div>

      {/* Messaging Layout */}
      <div className={`grid grid-cols-1 md:grid-cols-3 border rounded-xl overflow-hidden min-h-[450px] shadow-sm ${
        darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
      }`}>
        
        {/* Sidebar: Threads List */}
        <div className="border-r border-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-800 bg-slate-900/30">
            <span className="text-xs font-bold text-white block">Conversations Inbox</span>
          </div>

          <div className="divide-y divide-slate-800/60 overflow-y-auto flex-1">
            {threads.map(th => {
              const isActive = th.id === activeThreadId;
              return (
                <div
                  key={th.id}
                  onClick={() => setActiveThreadId(th.id)}
                  className={`p-3.5 cursor-pointer hover:bg-slate-900/30 transition-colors ${
                    isActive ? "bg-slate-900/60 border-l-4 border-cyan-500" : ""
                  }`}
                >
                  <div className="flex justify-between items-start gap-1">
                    <div>
                      <span className="font-extrabold text-slate-100 text-xs block">{th.contactName}</span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block mt-0.5">{th.contactRole}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{th.time}</span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2 line-clamp-1">{th.lastMessage}</p>

                  {th.unreadCount > 0 && (
                    <span className="mt-1 inline-block px-1.5 py-0.5 bg-cyan-600 text-white rounded-full text-[9px] font-bold">
                      {th.unreadCount} New
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Timeline Panel */}
        <div className="md:col-span-2 flex flex-col justify-between h-full min-h-[450px]">
          {activeThread ? (
            <>
              {/* Active Conversation header */}
              <div className="p-4 border-b border-slate-800 bg-slate-900/30 flex justify-between items-center text-xs">
                <div>
                  <span className="font-extrabold text-white block">{activeThread.contactName}</span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Active Thread Context</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold rounded-full uppercase">Secure SSL Desk</span>
                </div>
              </div>

              {/* Chat messages stream */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[300px]">
                {activeThread.chats.map((c, i) => (
                  <div key={i} className={`flex ${c.isSelf ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-sm rounded-xl p-3 space-y-1 ${
                      c.isSelf ? "bg-blue-600 text-white" : "bg-slate-900 border border-slate-800 text-slate-300"
                    }`}>
                      <div className="flex justify-between text-[9px] opacity-60 font-mono">
                        <span>{c.senderName}</span>
                        <span>{c.time}</span>
                      </div>
                      <p className="text-xs font-semibold leading-relaxed">{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Input Form */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 bg-slate-900/10 flex gap-2">
                <input
                  type="text"
                  placeholder="Type secure reply statement onto parent thread..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center flex-1 text-slate-500 italic text-xs">No active conversation thread loaded. Select inbox.</div>
          )}
        </div>
      </div>

      {/* ==================================
          COMPOSE NEW MESSAGES MODAL
          ================================== */}
      {showComposeModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-40 overflow-y-auto">
          <div className="relative w-full max-w-md bg-[#0c1220] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-blue-700 via-cyan-600 to-orange-500 h-2"></div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                <h3 className="font-bold text-sm text-white">Compose Parent-Teacher Dispatch</h3>
                <button onClick={() => setShowComposeModal(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleComposeSubmit} className="space-y-4 text-xs text-slate-300">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Recipient Classification</label>
                    <select
                      value={newMessage.recipientType}
                      onChange={(e) => setNewMessage({...newMessage, recipientType: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    >
                      <option value="Parent">Student Guardian</option>
                      <option value="Instructor">Tutor Faculty</option>
                      <option value="Staff">General Office Desk</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Select Contact Name *</label>
                    <select
                      value={newMessage.recipientName}
                      onChange={(e) => setNewMessage({...newMessage, recipientName: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    >
                      {students.map(s => (
                        <option key={s.id} value={`Guardian of ${s.fullName}`}>
                          {s.guardian} (Guardian of {s.fullName})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Dispatched message content *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Type official briefing text regarding attendance, outstanding tuition balance or certificates notifications..."
                    value={newMessage.content}
                    onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Urgent Parental SMS broadcast trigger option */}
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newMessage.isUrgentSms}
                      onChange={(e) => setNewMessage({...newMessage, isUrgentSms: e.target.checked})}
                      className="accent-rose-500 w-4 h-4 rounded cursor-pointer"
                    />
                    <div>
                      <span className="font-extrabold text-rose-400 text-[11px] block flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Direct Parent SMS Broadcast</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">Overrides web inbox to deliver an urgent SMS text directly to the parent's phone.</span>
                    </div>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
                >
                  Send Official Message
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
