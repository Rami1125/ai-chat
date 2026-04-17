import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { BookOpen, Activity, Users, TrendingUp, DollarSign, Info, ShieldCheck, Dumbbell } from 'lucide-react';

export const TrainingStudio = () => {
  const [rules, setRules] = useState({
    membershipFee: 250,
    marketingBudget: 1000,
    instructorLevel: 2,
    sessionLimit: 12
  });

  // Simulation Logic: Generates dynamic data based on rules
  const simulationData = useMemo(() => {
    const data = [];
    let members = 50;
    const baseGrowth = rules.marketingBudget / 100;
    const churn = Math.max(0, (rules.membershipFee / 500) * 5);
    const satisfactionBonus = (rules.instructorLevel * 2) - (rules.sessionLimit / 10);

    for (let i = 1; i <= 12; i++) {
        const growth = Math.floor(baseGrowth + satisfactionBonus - churn);
        members = Math.max(10, members + growth);
        data.push({
            month: `חודש ${i}`,
            members: members,
            revenue: members * rules.membershipFee,
            satisfaction: Math.min(100, 70 + (rules.instructorLevel * 5) - (rules.membershipFee / 50))
        });
    }
    return data;
  }, [rules]);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-6 overflow-y-auto lg:overflow-hidden bg-bg-main" dir="rtl">
      {/* Rulebook & Controls Panel */}
      <motion.section 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="lg:w-1/3 flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar"
      >
        {/* Rulebook Header */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-border-color transition-shadow hover:shadow-md"
        >
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="text-accent w-6 h-6" />
            <h2 className="text-2xl font-bold tracking-tight">ספר החוקים של סטודיו Aura</h2>
          </div>
          <div className="prose prose-sm text-text-muted">
            <p>ברוכים הבאים למערכת ניהול הסטודיו. כאן תוכלו להגדיר את "כללי הבית" ולראות בזמן אמת כיצד הם משפיעים על צמיחת העסק.</p>
            <ul className="text-xs space-y-1">
              <li className="flex items-center gap-2 text-emerald-600"><ShieldCheck className="w-3 h-3" /> ביטוח חובה לכל מתאמן</li>
              <li className="flex items-center gap-2 text-emerald-600"><ShieldCheck className="w-3 h-3" /> מינימום 2 מדריכים במשמרת</li>
              <li className="flex items-center gap-2 text-emerald-600"><ShieldCheck className="w-3 h-3" /> מחויבות לשיפור מתמיד</li>
            </ul>
          </div>
        </motion.div>

        {/* Real-time Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-border-color space-y-6"
        >
          <div className="flex items-center gap-2">
            <Activity className="text-accent w-5 h-5" />
            <h3 className="text-lg font-bold">פרמטרים לסימולציה</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <label className="font-medium">דמי מנוי חודשיים (₪)</label>
                <span className="text-accent font-bold">{rules.membershipFee}</span>
              </div>
              <input 
                type="range" min="100" max="600" step="10"
                value={rules.membershipFee}
                onChange={(e) => setRules({...rules, membershipFee: parseInt(e.target.value)})}
                className="w-full accent-accent cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <label className="font-medium">תקציב שיווק חודשי (₪)</label>
                <span className="text-accent font-bold">{rules.marketingBudget}</span>
              </div>
              <input 
                type="range" min="0" max="5000" step="100"
                value={rules.marketingBudget}
                onChange={(e) => setRules({...rules, marketingBudget: parseInt(e.target.value)})}
                className="w-full accent-accent cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <label className="font-medium">רמת מדריכים (1-5)</label>
                <span className="text-accent font-bold">{rules.instructorLevel}</span>
              </div>
              <select 
                value={rules.instructorLevel}
                onChange={(e) => setRules({...rules, instructorLevel: parseInt(e.target.value)})}
                className="w-full p-2 bg-zinc-50 border border-border-color rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent/20 transition-all cursor-pointer"
              >
                {[1,2,3,4,5].map(v => <option key={v} value={v}>רמה {v}</option>)}
              </select>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="p-4 bg-accent/5 rounded-2xl border border-accent/20 flex items-start gap-3"
        >
            <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <p className="text-xs text-accent leading-relaxed">הסימולציה מבוססת על מודל צמיחה אורגני המשלב שביעות רצון לקוחות מול תקציב שיווק.</p>
        </motion.div>
      </motion.section>

      {/* Simulation View Panel */}
      <section className="flex-1 flex flex-col gap-6 h-full overflow-hidden">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-5 rounded-3xl border border-border-color flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                <Users size={24} />
            </div>
            <div>
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider">סה"כ מנויים</p>
                <h4 className="text-2xl font-black">{simulationData[11].members}</h4>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className="bg-white p-5 rounded-3xl border border-border-color flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                <DollarSign size={24} />
            </div>
            <div>
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider">הכנסה חזויה</p>
                <h4 className="text-2xl font-black">₪{simulationData[11].revenue.toLocaleString()}</h4>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="bg-white p-5 rounded-3xl border border-border-color flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                <TrendingUp size={24} />
            </div>
            <div>
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider">שביעות רצון</p>
                <h4 className="text-2xl font-black">{Math.round(simulationData[11].satisfaction)}%</h4>
            </div>
          </motion.div>
        </div>

        {/* Charts Container */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex-1 bg-white p-6 rounded-[2.5rem] border border-border-color shadow-sm flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
                <Dumbbell className="text-accent" />
                צמיחת הסטודיו - תחזית ל-12 חודשים
            </h3>
            <div className="flex gap-2 text-xs font-bold uppercase items-center">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-accent" /> הכנסות</span>
                <span className="flex items-center gap-1 opacity-50"><div className="w-2 h-2 rounded-full bg-slate-300" /> מנויים</span>
            </div>
          </div>

          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={simulationData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fill: '#64748b'}}
                    dy={10}
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fill: '#64748b'}}
                    width={40}
                />
                <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                    itemStyle={{fontSize: '12px', fontWeight: 'bold'}}
                />
                <Area 
                    animationBegin={300}
                    animationDuration={1000}
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#6366f1" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                    name="הכנסות (₪)"
                />
                <Area 
                    animationBegin={600}
                    animationDuration={1200}
                    type="monotone" 
                    dataKey="members" 
                    stroke="#94a3b8" 
                    strokeWidth={2} 
                    fill="transparent"
                    name="מנויים"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
