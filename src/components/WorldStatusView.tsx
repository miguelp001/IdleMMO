import React from 'react';
import { useGame } from '../context/GameContext';
import Card, { CardHeader, CardTitle, CardContent } from './ui/Card';
import { Globe, TrendingUp, Users, AlertCircle, Clock } from 'lucide-react';
import { getGlobalModifiers, getFactionModifiers } from '../services/worldEventService';

const WorldStatusView: React.FC = () => {
    const { state } = useGame();
    const { worldState } = state;

    const factions = [
        { id: 'Trade_Consortium', name: 'Trade Consortium', icon: TrendingUp, color: 'text-blue-400' },
        { id: 'Warrior_Keep', name: "Warrior's Keep", icon: Users, color: 'text-red-400' },
        { id: 'Explorer_League', name: "Explorer's League", icon: Globe, color: 'text-emerald-400' }
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Active World Events */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-5 h-5 text-purple-400" />
                    <h2 className="text-xl font-bold text-white tracking-tight">Active World Events</h2>
                </div>
                
                {worldState.activeEvents.length === 0 ? (
                    <Card variant="shadow" className="border-dashed border-slate-700 bg-slate-900/20 backdrop-blur-sm">
                        <CardContent className="flex flex-col items-center py-10 text-slate-500">
                            <Clock className="w-10 h-10 mb-2 opacity-20" />
                            <p className="italic">The winds of fate are still. No active events.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {worldState.activeEvents.map(event => (
                            <Card key={event.id} variant="obsidian" className="overflow-hidden border-purple-500/30 group">
                                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Globe className="w-12 h-12" />
                                </div>
                                <CardHeader className="border-purple-500/20 bg-purple-500/5">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-purple-100">{event.name}</CardTitle>
                                        <div className="px-2 py-1 rounded text-[10px] uppercase font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                            {event.type}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <p className="text-sm text-slate-300 leading-relaxed mb-4">{event.description}</p>
                                    
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(event.modifiers).map(([key, val]) => (
                                            <div key={key} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-xs">
                                                <span className="text-slate-400">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                                <span className={val > 1 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                                                    {val > 1 ? `+${Math.round((val - 1) * 100)}%` : `-${Math.round((1 - val) * 100)}%`}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                                        <Clock className="w-3 h-3" />
                                        Ends in {event.duration} days
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>

            {/* Faction Standings */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-blue-400" />
                    <h2 className="text-xl font-bold text-white tracking-tight">Faction Standings</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {factions.map(faction => {
                        const rep = worldState.factionStandings[faction.id] || 0;
                        const Icon = faction.icon;
                        
                        return (
                            <Card key={faction.id} variant="bone" className="border-slate-700/50 hover:border-slate-600 transition-colors">
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`p-2 rounded-lg bg-slate-800 ${faction.color}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white leading-tight">{faction.name}</h3>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Faction Reputation</p>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-400">Neutral</span>
                                            <span className="text-white font-mono font-bold tracking-widest">{rep} / 1000</span>
                                        </div>
                                        <div className="relative h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                                            <div 
                                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-blue-500 shadow-[0_0_10px_rgba(139,92,246,0.3)] transition-all duration-1000"
                                                style={{ width: `${Math.min(100, (rep / 1000) * 100)}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-[10px] text-slate-500 tracking-wider font-semibold uppercase">
                                            <span>Rank 1</span>
                                            <span>Rank 2</span>
                                        </div>
                                    </div>

                                    {/* Bonus Indicator */}
                                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                                        <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-bold tracking-widest leading-none">
                                            {rep >= 500 ? (
                                                <div className="flex items-center gap-1.5 text-emerald-400">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                    Active Bonus Unlocked
                                                </div>
                                            ) : (
                                                <>Next Bonus at 500 Rep</>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </section>

            {/* Global Alerts */}
            <section className="bg-amber-900/10 border border-amber-900/30 rounded-lg p-4 flex gap-4">
                <div className="flex-shrink-0 text-amber-500">
                    <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-amber-200 font-bold text-sm mb-1 uppercase tracking-wide">Global Economic Outlook</h3>
                    <p className="text-amber-100/60 text-xs leading-relaxed">
                        The current global gold multiplier is <span className="text-amber-400 font-mono font-bold">{worldState.globalGoldMultiplier.toFixed(2)}x</span>. 
                        World treasury cycles refresh every 7 days, redistributing wealth to all active adventurers.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default WorldStatusView;
