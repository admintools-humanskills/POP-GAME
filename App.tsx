
import React, { useState } from 'react';
import { analyzeGameNeeds } from './geminiService';
import { AnalysisResult, ExperienceMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<ExperienceMode>('cadeau');
  const [description, setDescription] = useState('');
  const [ageInput, setAgeInput] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleSearch = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const analysis = await analyzeGameNeeds({ 
        mode, 
        description, 
        ageRange: ageInput || "Non spécifié (tous âges)" 
      });
      setResult(analysis);
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setDescription('');
    setAgeInput('');
    setMode('cadeau');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-asmodee-black flex flex-col relative">
      
      {/* Navbar Asmodee Style */}
      <nav className="relative z-50 bg-asmodee-black text-white px-6 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={reset}>
          <div className="relative">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-asmodee-black font-black text-2xl asmo-shadow-sm transform group-hover:rotate-12 transition-transform">a</div>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl leading-none tracking-tighter italic">ASMODEE</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-asmodee-cyan">Inspired by Players</span>
          </div>
        </div>
        
        <div className="hidden lg:flex gap-8 text-[11px] font-black uppercase italic tracking-wider">
          <a href="#" className="hover:text-asmodee-yellow transition-colors">Nos Univers</a>
          <a href="#" className="hover:text-asmodee-cyan transition-colors">30 Ans de Jeu</a>
          <a href="#" className="bg-asmodee-red px-4 py-2 rounded-full hover:scale-105 transition-transform">Le Moteur de Jeu</a>
        </div>
      </nav>

      <main className="relative flex-grow">
        {!result && !loading && (
          <div className="flex flex-col">
            {/* Hero Section */}
            <section className="bg-asmodee-yellow py-20 px-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-asmodee-cyan transform skew-x-12 translate-x-32 opacity-20" />
              <div className="max-w-5xl mx-auto relative z-10 text-center flex flex-col items-center">
                <div className="max-w-3xl">
                    <h1 className="text-6xl md:text-8xl font-black text-asmodee-black uppercase italic leading-[0.9] skew-title mb-8">
                        Trouvez <br/> <span className="text-asmodee-red">Le Jeu</span> <br/> Idéal
                    </h1>
                    <p className="text-xl md:text-2xl font-bold leading-snug">
                        Dites-nous avec qui vous jouez, nous trouverons la pépite Asmodee qui fera vibrer votre table !
                    </p>
                </div>
              </div>
            </section>

            {/* Input Section */}
            <section className="py-20 px-6 max-w-4xl mx-auto w-full -mt-10 relative z-20">
              <div className="bg-white asmo-border asmo-shadow rounded-[2rem] overflow-hidden">
                <div className="flex bg-asmodee-black text-white">
                    <button 
                        onClick={() => setMode('cadeau')}
                        className={`flex-1 py-6 text-sm font-black uppercase italic tracking-widest transition-all ${mode === 'cadeau' ? 'bg-asmodee-red text-white' : 'hover:bg-asmodee-gray hover:text-asmodee-black'}`}
                    >
                        Mode Cadeau
                    </button>
                    <button 
                        onClick={() => setMode('occasion')}
                        className={`flex-1 py-6 text-sm font-black uppercase italic tracking-widest transition-all ${mode === 'occasion' ? 'bg-asmodee-cyan text-white' : 'hover:bg-asmodee-gray hover:text-asmodee-black'}`}
                    >
                        Mode Occasion
                    </button>
                </div>

                <div className="p-8 md:p-12">
                    <div className="grid grid-cols-1 gap-12 mb-8">
                        {/* New Age Text Input */}
                        <div className="bg-asmodee-gray/30 p-8 rounded-3xl border-2 border-dashed border-asmodee-black/10">
                          <label className="block text-xs font-black uppercase italic tracking-widest mb-4 text-asmodee-red">Pour quel âge ?</label>
                          <div className="relative">
                            <input 
                              type="text"
                              value={ageInput}
                              onChange={(e) => setAgeInput(e.target.value)}
                              placeholder="Ex: 28 ans, enfants de 5 et 6 ans, entre 30 et 35 ans..."
                              className="w-full bg-white asmo-border rounded-2xl p-6 text-asmodee-black font-bold italic text-lg placeholder-asmodee-black/20 focus:outline-none focus:ring-4 focus:ring-asmodee-red/20 transition-all asmo-shadow-sm"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase italic text-asmodee-black/30 pointer-events-none hidden md:block">
                              Libre
                            </div>
                          </div>
                          <p className="mt-3 text-[10px] font-black uppercase italic text-asmodee-black/40 px-2">
                            Soyez précis : le moteur adaptera la complexité des jeux suggérés.
                          </p>
                        </div>

                        <div className="relative">
                            <label className="block text-xs font-black uppercase italic tracking-widest mb-3 text-asmodee-cyan">Dites-nous en plus sur l'envie</label>
                            <textarea
                                className="w-full bg-asmodee-gray/50 asmo-border rounded-2xl p-6 text-asmodee-black placeholder-asmodee-black/30 focus:outline-none focus:ring-4 focus:ring-asmodee-yellow/50 transition-all h-40 text-lg font-bold leading-tight resize-none shadow-inner"
                                placeholder={mode === 'cadeau' ? "Décrivez le profil : Fan de stratégie ? Créatif ? Adore bluffer ? C'est un cadeau pour qui ?" : "On est combien ? On a combien de temps ? C'est pour un apéro ou une soirée sérieuse ?"}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-asmodee-yellow asmo-border asmo-shadow-sm rounded-full flex items-center justify-center font-black">!</div>
                        </div>
                    </div>
                    
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={handleSearch}
                            disabled={!description.trim() || loading}
                            className={`group px-12 py-6 rounded-full font-black uppercase italic tracking-widest text-lg transition-all shadow-xl flex items-center gap-4 asmo-shadow-sm
                                ${!description.trim() || loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-asmodee-black text-white hover:bg-asmodee-red hover:-translate-y-1'}
                            `}
                        >
                            <span>Lancer le moteur</span>
                            <div className="w-8 h-8 bg-asmodee-yellow rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                                <svg className="w-5 h-5 text-asmodee-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </div>
                        </button>
                    </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {loading && (
          <div className="flex-grow flex flex-col items-center justify-center py-32 text-center px-6 bg-asmodee-cyan/10">
            <div className="relative w-32 h-32 mb-12">
               <div className="absolute inset-0 bg-asmodee-yellow asmo-border asmo-shadow rotate-12 animate-pulse"></div>
               <div className="absolute inset-0 bg-asmodee-red asmo-border asmo-shadow -rotate-12 animate-bounce"></div>
               <div className="absolute inset-0 flex items-center justify-center font-black text-white text-5xl italic drop-shadow-lg">!</div>
            </div>
            <h2 className="text-5xl font-black text-asmodee-black uppercase italic skew-title mb-4">Analyse des Quêtes...</h2>
            <p className="text-asmodee-red font-black uppercase tracking-[0.2em] text-sm italic">Inspired by Players • Chargement de l'Asmodee World</p>
          </div>
        )}

        {result && (
          <div id="results" className="animate-fade-in">
            {/* Header Result */}
            <header className="bg-asmodee-black text-white py-24 px-6 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full bg-asmodee-cyan opacity-10 transform skew-y-3 translate-y-20" />
               <div className="max-w-5xl mx-auto relative z-10 text-center">
                 <span className="bg-asmodee-yellow text-asmodee-black px-6 py-2 text-sm font-black uppercase italic mb-8 inline-block asmo-shadow-sm">Le Diagnostic du Game Master</span>
                 <h2 className="text-5xl md:text-7xl font-black uppercase italic leading-none mb-12 skew-title">
                   « {result.catchphrase} »
                 </h2>
                 <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl p-8 border-2 border-white/20">
                    <p className="text-xl md:text-2xl font-bold leading-relaxed italic text-asmodee-cyan">
                        {result.gameMasterAnalysis}
                    </p>
                 </div>
               </div>
            </header>

            <section className="py-24 px-6 bg-asmodee-gray">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-16 overflow-hidden">
                        <h3 className="text-4xl font-black uppercase italic whitespace-nowrap">La Sélection <span className="text-asmodee-red">Asmodee</span></h3>
                        <div className="h-2 flex-grow bg-asmodee-black/10 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {result.games.map((game, idx) => (
                        <GameCard key={idx} game={game} />
                    ))}
                    </div>
                </div>
            </section>

            <div className="py-20 text-center bg-white border-t-8 border-asmodee-black">
              <button 
                onClick={reset}
                className="group inline-flex items-center gap-4 bg-asmodee-yellow asmo-border asmo-shadow px-12 py-6 rounded-full text-lg font-black uppercase italic hover:bg-asmodee-cyan hover:text-white transition-all"
              >
                <svg className="w-6 h-6 transition-transform group-hover:-translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Nouvelle Quête
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-asmodee-black text-white pt-24 pb-12 px-8 border-t-8 border-asmodee-red">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-asmodee-black font-black text-3xl shadow-lg">a</div>
              <div className="flex flex-col leading-none">
                <span className="font-black text-2xl italic tracking-tighter">ASMODEE</span>
                <span className="text-[10px] font-bold text-asmodee-yellow uppercase tracking-widest">Great Games, Amazing Stories</span>
              </div>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose">
              Inspiré par les joueurs.<br/>
              Depuis 1995, nous créons des moments inoubliables.
            </p>
          </div>
          <div>
            <h4 className="font-black text-sm uppercase italic mb-8 text-asmodee-cyan">Univers Ludiques</h4>
            <ul className="text-xs space-y-4 uppercase font-bold tracking-widest text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Nos Studios</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Jeux Experts</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Jeux Famille</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-sm uppercase italic mb-8 text-asmodee-yellow">L'Entreprise</h4>
            <ul className="text-xs space-y-4 uppercase font-bold tracking-widest text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Notre Vision</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Engagements</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Presse</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-sm uppercase italic mb-8 text-asmodee-red">Newsletter</h4>
            <div className="flex bg-white/10 p-2 rounded-xl border border-white/20">
              <input type="text" placeholder="VOTRE EMAIL" className="bg-transparent text-xs px-4 py-2 w-full focus:outline-none placeholder:text-gray-500 font-black" />
              <button className="bg-asmodee-red text-white text-[10px] font-black px-6 py-2 rounded-lg hover:bg-asmodee-cyan transition-colors">OK</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto text-center pt-12 border-t border-white/10">
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.5em]">© 2024 ASMODEE GROUP • INSPIRED BY PLAYERS • 30 ANS</p>
        </div>
      </footer>
    </div>
  );
};

const GameCard: React.FC<{ game: any }> = ({ game }) => (
  <div className="group flex flex-col bg-white asmo-border asmo-shadow rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-4 hover:asmodee-yellow">
    <div className="w-full bg-asmodee-gray/50 p-8 flex items-center justify-center relative aspect-square">
       <div className="absolute top-6 left-6 z-10 skew-title">
          <span className="bg-asmodee-red text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest asmo-shadow-sm">WANTED</span>
       </div>
       <div className="w-full h-full bg-white asmo-border rounded-3xl flex items-center justify-center asmo-shadow-sm group-hover:rotate-2 transition-transform duration-500 p-8">
         <img 
          src={`https://picsum.photos/seed/${encodeURIComponent(game.name)}/600/600`} 
          alt={game.name} 
          className="w-full h-auto object-contain drop-shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700"
        />
       </div>
    </div>
    
    <div className="p-8 flex flex-col flex-grow">
      <div className="mb-6">
        <span className="text-[10px] uppercase tracking-[0.2em] text-asmodee-cyan font-black block mb-3 italic">
          {game.superPower}
        </span>
        <h3 className="text-3xl font-black text-asmodee-black uppercase italic leading-none group-hover:text-asmodee-red transition-colors min-h-[4rem]">
          {game.name}
        </h3>
      </div>
      
      <p className="text-asmodee-black text-[14px] font-bold leading-tight italic mb-8 flex-grow">
        « {game.rationale} »
      </p>

      <div className="flex flex-wrap gap-2 mb-8 bg-asmodee-gray/50 p-4 rounded-xl border border-asmodee-black/10">
        <div className="flex-1 text-center">
          <span className="block text-[8px] text-gray-500 font-black uppercase mb-1">Joueurs</span>
          <span className="text-[11px] font-black text-asmodee-black italic">{game.stats.players}</span>
        </div>
        <div className="flex-1 text-center border-x-2 border-asmodee-black/10">
          <span className="block text-[8px] text-gray-500 font-black uppercase mb-1">Temps</span>
          <span className="text-[11px] font-black text-asmodee-black italic">{game.stats.duration}</span>
        </div>
        <div className="flex-1 text-center">
          <span className="block text-[8px] text-gray-500 font-black uppercase mb-1">Âge</span>
          <span className="text-[11px] font-black text-asmodee-black italic">{game.stats.age}</span>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-4">
        <span className="text-2xl font-black italic text-asmodee-red">{game.price}</span>
        <button className="bg-asmodee-black text-white px-8 py-4 rounded-xl uppercase italic text-[10px] font-black hover:bg-asmodee-cyan transition-all transform asmo-shadow-sm active:translate-x-1 active:translate-y-1 active:shadow-none">
          C'est mon jeu !
        </button>
      </div>
    </div>
  </div>
);

export default App;
