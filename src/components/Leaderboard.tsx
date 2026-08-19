"use client";

import { Award, Trophy, Zap, Shield, Crown, UserCheck } from "lucide-react";

export default function Leaderboard() {
  const topGamers = [
    { rank: 1, name: "CYBER_GHOST_99", level: 42, xp: "28,400 XP", tickets: 140, badge: "Quantum Warlord" },
    { rank: 2, name: "NEXUS_RIDER", level: 28, xp: "14,250 XP", tickets: 85, badge: "Cyber Elite", isUser: true },
    { rank: 3, name: "NEO_TOKYO_DEV", level: 25, xp: "12,100 XP", tickets: 60, badge: "High Roller" },
    { rank: 4, name: "PIXEL_VALKYRIE", level: 19, xp: "9,800 XP", tickets: 45, badge: "Lucky Byte" },
    { rank: 5, name: "GLITCH_MASTER", level: 14, xp: "6,500 XP", tickets: 30, badge: "Pioneer" },
  ];

  return (
    <section id="leaderboard" className="w-full py-16 bg-cyber-void border-t border-cyber-cyan/20 relative">
      
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center space-y-2 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-card border border-yellow-500/40 text-yellow-400 font-mono text-xs font-bold">
            <Trophy className="w-4 h-4" /> CHAMPIONS LEAGUE HALL OF FAME
          </div>
          <h2 className="font-cyber text-3xl md:text-4xl font-black text-white uppercase tracking-wider">
            LEADERBOARD <span className="text-yellow-400">ARCADE</span>
          </h2>
          <p className="font-mono text-xs text-slate-400">
            Os maiores conquistadores de bilhetes e nível da plataforma Quantum.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: CHAMPIONS LEAGUE TABLE (8 COLS) */}
          <div className="lg:col-span-8 bg-cyber-card/80 border border-cyber-border rounded-2xl p-4 sm:p-6 shadow-neon-box font-mono">
            <div className="flex items-center justify-between border-b border-cyber-border pb-4 mb-4">
              <span className="text-xs font-bold text-cyber-cyan">RANKING TOP GAMERS</span>
              <span className="text-[10px] text-slate-400">XP RECOMPENSADO A CADA PIX</span>
            </div>

            <div className="space-y-3">
              {topGamers.map((gamer) => (
                <div
                  key={gamer.rank}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    gamer.isUser
                      ? "bg-cyber-magenta/20 border-cyber-magenta shadow-magenta-glow"
                      : "bg-cyber-void/80 border-cyber-border hover:border-cyber-cyan/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">
                      {gamer.rank === 1 ? (
                        <Crown className="w-6 h-6 text-yellow-400" />
                      ) : gamer.rank === 2 ? (
                        <span className="text-cyber-cyan font-bold">#2</span>
                      ) : (
                        <span className="text-slate-500 font-bold">#{gamer.rank}</span>
                      )}
                    </div>

                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{gamer.name}</span>
                        {gamer.isUser && (
                          <span className="bg-cyber-magenta text-white text-[9px] px-1.5 py-0.2 rounded font-bold">
                            VOCÊ
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{gamer.badge}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="text-xs font-bold text-cyber-cyan">LVL {gamer.level}</div>
                      <div className="text-[10px] text-slate-400">{gamer.xp}</div>
                    </div>
                    <div className="hidden sm:block text-xs font-bold text-white bg-cyber-void px-3 py-1 rounded border border-cyber-border">
                      {gamer.tickets} NUMS
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: USER PROFILE CARD HIGHLIGHT (4 COLS) */}
          <div className="lg:col-span-4 bg-cyber-card border-2 border-cyber-magenta rounded-2xl p-6 shadow-magenta-glow font-mono relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-magenta/10 rounded-full blur-2xl pointer-events-none" />

            <div className="text-xs text-cyber-magenta font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4" /> MEU PERFIL QUANTUM
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl border-2 border-cyber-cyan overflow-hidden bg-slate-900 shadow-cyan-glow">
                  <img
                    src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80"
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-2 -right-2 bg-cyber-magenta text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white">
                  LVL 28
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white">NEXUS_RIDER</h4>
                <p className="text-xs text-cyber-cyan">CYBER ELITE GAMER</p>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-yellow-400">
                  <Award className="w-3.5 h-3.5" /> 85 BILHETES ADQUIRIDOS
                </div>
              </div>
            </div>

            {/* XP PROGRESS BAR */}
            <div className="space-y-1.5 mb-6">
              <div className="flex justify-between text-[11px] text-slate-300 font-bold">
                <span>PROGRESSO PRÓXIMO NÍVEL</span>
                <span className="text-cyber-cyan">14.250 / 15.000 XP</span>
              </div>
              <div className="w-full bg-cyber-void h-2.5 rounded-full overflow-hidden border border-cyber-cyan/30">
                <div className="bg-gradient-to-r from-cyber-cyan to-cyber-magenta h-full w-[95%] shadow-cyan-glow" />
              </div>
            </div>

            {/* BADGES UNLOCKED */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold">CONQUISTAS DESBLOQUEADAS</span>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="bg-cyber-void border border-cyber-cyan/40 p-2 rounded text-cyber-cyan font-bold">
                  ⚡ QUANTUM
                </div>
                <div className="bg-cyber-void border border-cyber-magenta/40 p-2 rounded text-cyber-magenta font-bold">
                  🔥 LUCKY 85
                </div>
                <div className="bg-cyber-void border border-yellow-500/40 p-2 rounded text-yellow-400 font-bold">
                  👑 VIP RIG
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
