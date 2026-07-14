import React, { useState } from "react";
import {
  Calendar,
  Plus,
  Clock,
  MapPin,
  Users,
  Bookmark,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  category: "Exam" | "Class Intake" | "Holiday" | "Holiday Lab";
  location: string;
}

interface CalendarPageProps {
  darkMode: boolean;
}

export default function CalendarPage({
  darkMode
}: CalendarPageProps) {
  // Mock calendar events
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: "EV-1", title: "Cisco Routing Theoretical Lab Exam", date: "2026-07-20", time: "10:00 AM", category: "Exam", location: "Computer Lab 1" },
    { id: "EV-2", title: "New Evening Programming Cohort Orientation", date: "2026-07-15", time: "05:30 PM", category: "Class Intake", location: "Main Hall" },
    { id: "EV-3", title: "System Servers Maintenance & Upgrades", date: "2026-07-12", time: "09:00 AM", category: "Holiday Lab", location: "Server Room" }
  ]);

  // States
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(15);

  // Form State
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "2026-07-15",
    time: "09:00 AM",
    category: "Exam" as const,
    location: "Kisii Office Center"
  });

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title) return;

    const created: CalendarEvent = {
      id: `EV-${events.length + 1}`,
      title: newEvent.title,
      date: newEvent.date,
      time: newEvent.time,
      category: newEvent.category,
      location: newEvent.location
    };

    setEvents([...events, created]);
    setShowAddModal(false);
    // Reset Form
    setNewEvent({
      title: "",
      date: "2026-07-15",
      time: "09:00 AM",
      category: "Exam",
      location: "Kisii Office Center"
    });
    alert(`Calendar event "${created.title}" successfully saved on scheduling board.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Academic Schedulers & Board Calendars</h2>
          <p className="text-xs text-slate-400">Review exams intakes, schedule orientation seminars, coordinate physical lab hours and map deadlines.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" /> Book Calendar Event
        </button>
      </div>

      {/* Grid Layout: Calendar Sheet + Events list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Calendar Grid card */}
        <div className={`p-5 border rounded-2xl shadow-sm lg:col-span-2 space-y-4 ${
          darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
        }`}>
          <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800/60">
            <h3 className="font-extrabold text-sm text-slate-200">July 2026</h3>
            
            <div className="flex items-center gap-2">
              <button className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"><ChevronLeft className="w-4 h-4" /></button>
              <span className="font-extrabold text-[11px] font-mono">JUL 2026</span>
              <button className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Simple Days Grid */}
          <div className="grid grid-cols-7 gap-2.5 text-center text-[10px] font-bold text-slate-500">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <span key={d} className="uppercase font-mono">{d}</span>)}
          </div>

          <div className="grid grid-cols-7 gap-2.5 text-center text-xs">
            {/* Empty days placeholder before July 1st starts (Wednesday) */}
            <span className="p-2 text-slate-700">28</span>
            <span className="p-2 text-slate-700">29</span>
            <span className="p-2 text-slate-700">30</span>

            {Array.from({ length: 31 }, (_, i) => {
              const day = i + 1;
              const isSelected = selectedDay === day;
              
              // check if day has scheduled events
              const eventDateStr = `2026-07-${day < 10 ? '0' + day : day}`;
              const dayHasEvents = events.some(e => e.date === eventDateStr);

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`p-2.5 rounded-xl font-bold font-mono transition-all relative hover:scale-105 cursor-pointer ${
                    isSelected ? "bg-cyan-600 text-white" : "bg-slate-950 text-slate-300 hover:bg-slate-900 border border-slate-900"
                  }`}
                >
                  <span>{day}</span>
                  {dayHasEvents && (
                    <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Days Agenda Events List */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className={`p-5 border rounded-2xl shadow-sm flex-1 ${
            darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
          }`}>
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-3">Agenda Schedulers List</span>
            
            <div className="space-y-4">
              {events.map(ev => (
                <div key={ev.id} className="p-3.5 border border-slate-800 bg-slate-950/40 rounded-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                      ev.category === "Exam" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                      ev.category === "Class Intake" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" :
                      "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}>{ev.category}</span>

                    <span className="text-[10px] font-mono font-bold text-slate-500">{ev.date}</span>
                  </div>

                  <h4 className="text-xs font-black text-slate-100">{ev.title}</h4>

                  <div className="flex gap-4 text-[10px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-500" /> {ev.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {ev.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ====================================
          MODAL: BOOK CALENDAR EVENTS
          ==================================== */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-40 overflow-y-auto">
          <div className="relative w-full max-w-md bg-[#0c1220] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-blue-700 via-cyan-600 to-orange-500 h-2"></div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                <h3 className="font-bold text-sm text-white">Schedule Calendar Board Event</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleCreateEventSubmit} className="space-y-4 text-xs text-slate-300">
                <div>
                  <label className="block text-slate-400 mb-1">Calendar Event Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cisco subnetting review panel"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Schedule Date</label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Event Clock Time</label>
                    <input
                      type="text"
                      placeholder="09:00 AM"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Event Category</label>
                    <select
                      value={newEvent.category}
                      onChange={(e) => setNewEvent({...newEvent, category: e.target.value as any})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    >
                      <option value="Exam">Exam Evaluation</option>
                      <option value="Class Intake">Class Orientation</option>
                      <option value="Holiday">School Holiday</option>
                      <option value="Holiday Lab">Lab Access Session</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Physical Location *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kisii center"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
                >
                  Schedule Event Session
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
