import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import { services, timeSlots } from './data/services';
import { specialists } from './data/specialists';
import { Scissors, Sparkles, Clock, Star, LogOut, Calendar, Search, Moon, Sun, Bell, Trash2 } from 'lucide-react';

const App = () => {
  const [user, setUser] = useState(() => {
    const session = localStorage.getItem('activeSession');
    return session ? JSON.parse(session) : null;
  });

  const [myBookings, setMyBookings] = useState(() => {
    const session = localStorage.getItem('activeSession');
    if (session) {
      const parsedUser = JSON.parse(session);
      const saved = localStorage.getItem(`bookings_${parsedUser.username}`);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [view, setView] = useState('barber');
  const [searchTerm, setSearchTerm] = useState('');
  const [selection, setSelection] = useState({ service: null, specialist: null, time: null });
  const [showHistory, setShowHistory] = useState(false);
  const [notification, setNotification] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = (u) => {
    setUser(u);
    localStorage.setItem('activeSession', JSON.stringify(u));
    const saved = localStorage.getItem(`bookings_${u.username}`);
    setMyBookings(saved ? JSON.parse(saved) : []);
    showToast(`Welcome back, ${u.username}!`);
  };

  const handleLogout = () => {
    setUser(null);
    setMyBookings([]);
    localStorage.removeItem('activeSession');
  };

  const confirmBooking = () => {
    if (!user) return;
    const newBooking = { 
      ...selection, 
      id: Date.now(), 
      date: new Date().toLocaleDateString(), 
      rating: 0 
    };
    const updated = [...myBookings, newBooking];
    setMyBookings(updated);
    localStorage.setItem(`bookings_${user.username}`, JSON.stringify(updated));
    setSelection({ service: null, specialist: null, time: null });
    setShowHistory(true);
    showToast("Booking Confirmed!");
  };

  const deleteBooking = (id) => {
    const updated = myBookings.filter(b => b.id !== id);
    setMyBookings(updated);
    localStorage.setItem(`bookings_${user.username}`, JSON.stringify(updated));
    showToast("Booking Removed.");
  };

  const rateBooking = (id, stars) => {
    const updated = myBookings.map(b => b.id === id ? { ...b, rating: stars } : b);
    setMyBookings(updated);
    localStorage.setItem(`bookings_${user.username}`, JSON.stringify(updated));
    showToast(`Rated ${stars} Stars!`);
  };

  if (!user) return <Auth onLogin={handleLogin} />;

  const filteredServices = services.filter(s => 
    s.category === view && s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {notification && (
        <div className="fixed top-20 right-6 z-[100] animate-bounce">
          <div className="bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 border border-white/20">
            <Bell size={16} /> 
            <span className="font-bold text-xs uppercase">{notification}</span>
          </div>
        </div>
      )}

      <nav className={`p-4 border-b sticky top-0 z-50 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="cursor-pointer" onClick={() => setShowHistory(false)}>
            <h1 className="text-xl font-black italic tracking-tighter text-indigo-600 uppercase text-blue shadow-text">Glow&Groom</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
            </button>
            <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold text-xs">
              {showHistory ? 'BOOKING' : 'MY HISTORY'}
            </button>
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-500"><LogOut size={18} /></button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {showHistory ? (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-black mb-6 border-b-2 border-indigo-600 w-fit pb-1 uppercase tracking-tight">Booking History</h2>
            <div className="grid gap-4">
              {myBookings.length === 0 ? (
                <div className="p-16 text-center rounded-3xl border border-dashed border-slate-300">
                  <p className="text-slate-400 text-sm font-bold uppercase italic">No history found</p>
                </div>
              ) : (
                myBookings.slice().reverse().map(b => (
                  <div key={b.id} className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} flex flex-col md:flex-row justify-between items-center gap-4`}>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-indigo-600 uppercase">{b.service?.name}</h3>
                      <p className="font-bold text-sm opacity-70 uppercase tracking-tighter">{b.specialist?.name} • {b.date} • {b.time}</p>
                      
                      <div className="flex items-center gap-2 mt-4 bg-slate-100 dark:bg-slate-800 p-2 rounded-xl w-fit">
                        <span className="text-[10px] font-black text-white uppercase mr-2">Rate:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} onClick={() => rateBooking(b.id, star)}>
                            <Star size={18} fill={star <= b.rating ? "#eab308" : "none"} className={star <= b.rating ? "text-yellow-500" : "text-slate-400"} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => deleteBooking(b.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-10">
              
              <div className="flex gap-2 p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl w-fit">
                <button onClick={() => setView('barber')} className={`px-8 py-2.5 rounded-lg font-bold text-xs transition-all ${view === 'barber' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500'}`}>BARBER</button>
                <button onClick={() => setView('makeup')} className={`px-8 py-2.5 rounded-lg font-bold text-xs transition-all ${view === 'makeup' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500'}`}>MAKEUP</button>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search services..." 
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl border outline-none text-sm font-medium ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 focus:border-indigo-600 shadow-sm'}`}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <section>
                <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-4">1. Luxury Treatments</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {filteredServices.map(s => (
                    <button 
                      key={s.id} 
                      onClick={() => setSelection({...selection, service: s, time: null})}
                      className={`p-6 rounded-2xl border-2 text-left transition-all ${selection.service?.id === s.id ? 'border-indigo-600 bg-indigo-600 shadow-lg' : 'border-transparent bg-slate-800 hover:bg-slate-700'}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-bold text-base text-white">{s.name}</h3>
                        <span className="font-black text-white text-lg">${s.price}</span>
                      </div>
                      <p className="text-[11px] font-bold text-white/70 uppercase">{s.duration} MINS SESSION</p>
                    </button>
                  ))}
                </div>
              </section>

              {selection.service && (
                <section className="animate-in fade-in duration-300">
                  <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-4">2. Choose Expert</h2>
                  <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                    {specialists.filter(sp => sp.category === view).map(sp => (
                      <button 
                        key={sp.id} 
                        onClick={() => setSelection({...selection, specialist: sp})}
                        className={`flex-shrink-0 w-40 p-6 rounded-3xl border-2 transition-all ${selection.specialist?.id === sp.id ? 'border-indigo-600 bg-indigo-600 shadow-lg scale-105' : 'border-transparent bg-slate-800 hover:bg-slate-700'}`}
                      >
                        <img src={sp.image} className="w-16 h-16 rounded-2xl mx-auto mb-3 border border-white/20 shadow-md" alt={sp.name} />
                        <h3 className="font-bold text-center text-xs tracking-tight text-white uppercase">{sp.name}</h3>
                        <div className="flex items-center justify-center gap-1 text-yellow-400 text-[10px] font-black mt-2"><Star size={10} fill="currentColor"/> {sp.rating}</div>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {selection.specialist && (
                <section className="animate-in fade-in duration-300">
                  <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-4">3. Booking Slot</h2>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {timeSlots.map(t => (
                      <button 
                        key={t} 
                        onClick={() => setSelection({...selection, time: t})}
                        className={`py-3 rounded-xl font-bold text-xs transition-all border ${selection.time === t ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-slate-800 text-white border-transparent hover:bg-slate-700'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="lg:col-span-4">
              <div className={`sticky top-28 p-8 rounded-3xl border transition-all ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xl'}`}>
                <h2 className="text-base font-black uppercase tracking-widest mb-8 text-indigo-600">Final Bill</h2>
                <div className="space-y-5">
                  <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
                    <p className="text-[11px] font-bold opacity-50 uppercase italic">Treatment</p>
                    <p className="font-bold text-sm text-right uppercase">{selection.service?.name || '---'}</p>
                  </div>
                  <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
                    <p className="text-[11px] font-bold opacity-50 uppercase italic">Specialist</p>
                    <p className="font-bold text-sm text-right uppercase">{selection.specialist?.name || '---'}</p>
                  </div>
                  <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
                    <p className="text-[11px] font-bold opacity-50 uppercase italic">Selected Slot</p>
                    <p className="font-bold text-sm text-indigo-600">{selection.time || '---'}</p>
                  </div>
                  <div className="pt-4 flex justify-between items-end">
                    <span className="font-black text-xs uppercase opacity-40 italic">Total Amount</span>
                    <span className="text-4xl font-black italic tracking-tighter text-indigo-600">${selection.service?.price || 0}</span>
                  </div>
                  <button 
                    onClick={confirmBooking} 
                    disabled={!selection.time} 
                    className="w-full py-5 rounded-xl bg-indigo-600 text-white font-black text-base shadow-xl hover:bg-indigo-700 disabled:opacity-20 transition-all uppercase tracking-tighter italic"
                  >
                    Confirm Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;