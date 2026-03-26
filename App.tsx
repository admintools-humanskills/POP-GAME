
import React, { useState, useEffect, useRef } from 'react';
import { analyzeGameNeeds } from './geminiService';
import { AnalysisResult, ExperienceMode } from './types';

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('reveal-active');
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

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
    <div className="min-h-screen bg-pop-black font-sans text-pop-white flex flex-col relative">

      {/* Navbar */}
      <nav className="relative z-50 bg-pop-black border-b border-pop-yellow/20 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={reset}>
          <div className="relative">
            <div className="w-11 h-11 bg-pop-yellow flex items-center justify-center text-pop-black font-black text-2xl pop-shadow-sm transition-transform group-hover:scale-110">P</div>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl leading-none text-pop-yellow">POP GAME</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-pop-muted">Le Moteur de Jeux</span>
          </div>
        </div>

        <div className="hidden lg:flex gap-8 text-[11px] font-bold uppercase tracking-wider">
          <a href="#" className="hover-underline-pop text-pop-white/70 hover:text-pop-yellow transition-colors">Nos Univers</a>
          <a href="#" className="hover-underline-pop text-pop-white/70 hover:text-pop-yellow transition-colors">30 Ans de Jeu</a>
          <a href="#" className="bg-pop-yellow text-pop-black px-5 py-2 font-black hover:bg-pop-pink hover:text-pop-white transition-all">Le Moteur</a>
        </div>
      </nav>

      <main className="relative flex-grow">
        {!result && !loading && (
          <div className="flex flex-col">
            {/* Hero Section */}
            <section className="py-24 md:py-32 px-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-20 right-20 w-64 h-64 bg-pop-violet/10 blur-[100px]" />
                <div className="absolute bottom-20 left-20 w-48 h-48 bg-pop-pink/10 blur-[80px]" />
              </div>
              <div className="max-w-5xl mx-auto relative z-10 text-center flex flex-col items-center">
                <div className="max-w-4xl">
                    <h1 className="font-sans text-6xl md:text-8xl lg:text-9xl font-black uppercase text-pop-white leading-[0.95] mb-8">
                        Trouvez<br/>
                        Le Jeu<br/>
                        <span className="text-pop-pink">Idéal</span>
                    </h1>
                    <p className="text-lg md:text-xl text-pop-white/60 font-medium leading-relaxed max-w-2xl mx-auto">
                        Dites-nous avec qui vous jouez, nous trouverons la pépite qui fera vibrer votre table.
                    </p>
                </div>
              </div>
            </section>

            {/* Input Section */}
            <section className="pb-24 px-6 max-w-3xl mx-auto w-full relative z-20">
              <div className="bg-pop-white overflow-hidden">
                {/* Mode Tabs */}
                <div className="flex">
                    <button
                        onClick={() => setMode('cadeau')}
                        className={`flex-1 py-5 text-xs font-bold uppercase tracking-[0.2em] transition-all ${mode === 'cadeau' ? 'bg-pop-yellow text-pop-black' : 'bg-pop-black text-pop-white/50 hover:text-pop-yellow'}`}
                    >
                        Mode Cadeau
                    </button>
                    <button
                        onClick={() => setMode('occasion')}
                        className={`flex-1 py-5 text-xs font-bold uppercase tracking-[0.2em] transition-all ${mode === 'occasion' ? 'bg-pop-violet text-pop-white' : 'bg-pop-black text-pop-white/50 hover:text-pop-violet'}`}
                    >
                        Mode Occasion
                    </button>
                </div>

                <div className="p-8 md:p-10">
                    <div className="flex flex-col gap-8 mb-8">
                        {/* Age Input */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-[0.3em] mb-3 text-pop-pink">Pour quel âge ?</label>
                          <input
                            type="text"
                            value={ageInput}
                            onChange={(e) => setAgeInput(e.target.value)}
                            placeholder="Ex: 28 ans, enfants de 5 et 6 ans..."
                            className="w-full bg-pop-white border border-pop-black/15 p-5 text-pop-black font-medium placeholder-pop-black/30 focus:outline-none focus:border-pop-pink transition-colors"
                          />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-[0.3em] mb-3 text-pop-violet">Dites-nous en plus sur l'envie</label>
                            <textarea
                                className="w-full bg-pop-white border border-pop-black/15 p-5 text-pop-black placeholder-pop-black/30 focus:outline-none focus:border-pop-violet transition-colors h-36 resize-none"
                                placeholder={mode === 'cadeau' ? "Décrivez le profil : Fan de stratégie ? Créatif ? C'est un cadeau pour qui ?" : "On est combien ? On a combien de temps ? C'est pour un apéro ou une soirée ?"}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={handleSearch}
                            disabled={!description.trim() || loading}
                            className={`group px-10 py-5 font-bold uppercase tracking-[0.2em] text-sm transition-all flex items-center gap-4
                                ${!description.trim() || loading ? 'bg-pop-black/5 text-pop-black/20 cursor-not-allowed' : 'bg-pop-yellow text-pop-black pop-shadow hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none'}
                            `}
                        >
                            <span>Lancer le moteur</span>
                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </button>
                    </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex-grow flex flex-col items-center justify-center py-32 text-center px-6">
            <div className="relative w-24 h-24 mb-12">
               <div className="absolute inset-0 bg-pop-yellow animate-pulse-glow" />
               <div className="absolute inset-0 flex items-center justify-center font-serif text-pop-black text-4xl">?</div>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-pop-yellow mb-4">Analyse en cours...</h2>
            <div className="w-48 h-1 animate-shimmer rounded-full mt-4" />
            <p className="text-pop-muted text-sm uppercase tracking-[0.3em] mt-6">Le moteur tourne</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div id="results" className="animate-fade-up">
            {/* Header Result */}
            <header className="py-24 px-6 relative overflow-hidden border-b border-pop-yellow/20">
               <div className="absolute top-0 left-0 w-full h-full">
                 <div className="absolute top-10 right-10 w-96 h-96 bg-pop-violet/5 blur-[120px]" />
               </div>
               <div className="max-w-4xl mx-auto relative z-10 text-center">
                 <RevealBlock>
                   <h2 className="font-sans text-4xl md:text-6xl lg:text-7xl font-black uppercase text-pop-white leading-[1.05] mb-12">
                     « {result.catchphrase} »
                   </h2>
                 </RevealBlock>
                 <RevealBlock className="reveal-delay-2">
                   <div className="max-w-2xl mx-auto bg-pop-violet p-10 md:p-12">
                      <p className="text-lg md:text-xl text-pop-white/90 leading-relaxed font-light">
                          {result.gameMasterAnalysis}
                      </p>
                   </div>
                 </RevealBlock>
               </div>
            </header>

            {/* Games Grid */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <RevealBlock>
                      <div className="flex items-center gap-6 mb-16">
                          <h3 className="font-sans text-3xl md:text-4xl font-black uppercase text-pop-yellow whitespace-nowrap">La Sélection</h3>
                          <div className="h-[2px] flex-grow bg-pop-yellow/20"></div>
                      </div>
                    </RevealBlock>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {result.games.map((game, idx) => (
                        <GameCard key={idx} game={game} index={idx} />
                    ))}
                    </div>

                </div>
            </section>

            {/* Reset Button */}
            <div className="py-20 text-center border-t border-pop-white/10">
              <button
                onClick={reset}
                className="group inline-flex items-center gap-4 bg-pop-black border border-pop-yellow text-pop-yellow px-10 py-5 font-bold uppercase tracking-[0.2em] text-sm hover:bg-pop-yellow hover:text-pop-black transition-all"
              >
                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Nouvelle Recherche
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-pop-black border-t border-pop-yellow/20 pt-20 pb-10 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-pop-yellow flex items-center justify-center text-pop-black font-black text-xl">P</div>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-lg text-pop-yellow">POP GAME</span>
                <span className="text-[9px] font-semibold text-pop-muted uppercase tracking-[0.3em]">Le Moteur de Jeux</span>
              </div>
            </div>
            <p className="text-xs text-pop-muted leading-relaxed">
              Trouvez le jeu de société parfait grâce à l'intelligence artificielle.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6 text-pop-violet">Univers</h4>
            <ul className="text-xs space-y-3 text-pop-muted">
              <li><a href="#" className="hover:text-pop-yellow transition-colors">Nos Studios</a></li>
              <li><a href="#" className="hover:text-pop-yellow transition-colors">Jeux Experts</a></li>
              <li><a href="#" className="hover:text-pop-yellow transition-colors">Jeux Famille</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6 text-pop-pink">L'Entreprise</h4>
            <ul className="text-xs space-y-3 text-pop-muted">
              <li><a href="#" className="hover:text-pop-yellow transition-colors">Notre Vision</a></li>
              <li><a href="#" className="hover:text-pop-yellow transition-colors">Engagements</a></li>
              <li><a href="#" className="hover:text-pop-yellow transition-colors">Presse</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6 text-pop-yellow">Newsletter</h4>
            <div className="flex border border-pop-white/20">
              <input type="text" placeholder="VOTRE EMAIL" className="bg-transparent text-xs px-4 py-3 w-full focus:outline-none placeholder:text-pop-muted font-medium" />
              <button className="bg-pop-yellow text-pop-black text-[10px] font-bold px-5 hover:bg-pop-pink hover:text-pop-white transition-colors whitespace-nowrap">OK</button>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto text-center pt-10 border-t border-pop-white/10">
          <p className="text-[10px] text-pop-muted uppercase tracking-[0.4em]">© 2025 POP GAME • Le Moteur de Jeux</p>
        </div>
      </footer>
    </div>
  );
};

const accentColors = ['pop-yellow', 'pop-violet', 'pop-pink'] as const;

const RevealBlock: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const ref = useScrollReveal();
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
};

const ACCENT_COLORS = ['#FDF709', '#5544CC', '#FF56AE'] as const;
const ACCENT_TEXT = ['text-pop-yellow', 'text-pop-violet', 'text-pop-pink'] as const;
const ACCENT_BADGE = [
  'bg-pop-yellow text-pop-black',
  'bg-pop-violet text-pop-white',
  'bg-pop-pink text-pop-white',
] as const;

const GameCard: React.FC<{ game: any; index: number }> = ({ game, index }) => {
  const ci = index % 3;
  const color = ACCENT_COLORS[ci];
  const [hovered, setHovered] = useState(false);
  const revealRef = useScrollReveal();

  return (
    <div
      ref={revealRef}
      className={`reveal reveal-delay-${index + 1} group flex flex-col bg-pop-black transition-all duration-300 hover:-translate-y-2`}
      style={{
        border: `2px solid ${hovered ? color : '#FFFFFF'}`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="w-full bg-pop-black p-6 flex items-center justify-center relative aspect-square overflow-hidden">
         <div className="absolute top-4 left-4 z-10">
            <span className={`${ACCENT_BADGE[ci]} text-[9px] font-bold px-4 py-1.5 uppercase tracking-[0.2em]`}>Recommandé</span>
         </div>
         <div className="w-full h-full border border-pop-white/20 flex items-center justify-center bg-pop-black transition-colors p-6">
           <img
            src={`https://picsum.photos/seed/${encodeURIComponent(game.name)}/600/600`}
            alt={game.name}
            className="w-full h-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
          />
         </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow" style={{ borderTop: `2px solid ${hovered ? color : '#FFFFFF'}` }}>
        <div className="mb-4">
          <span className={`text-[9px] uppercase tracking-[0.3em] ${ACCENT_TEXT[ci]} font-bold block mb-2`}>
            {game.superPower}
          </span>
          <h3
            className="font-sans text-2xl font-black uppercase leading-tight transition-colors min-h-[3.5rem]"
            style={{ color: hovered ? color : '#FFFFFF' }}
          >
            {game.name}
          </h3>
        </div>

        <p className="text-pop-white text-sm leading-relaxed mb-6 flex-grow font-light">
          « {game.rationale} »
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="text-center py-4 px-2 rounded-lg" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}40` }}>
            <span className="block text-[9px] uppercase tracking-wider mb-2 font-bold" style={{ color }}>Joueurs</span>
            <span className="text-base font-black text-pop-white">{game.stats.players}</span>
          </div>
          <div className="text-center py-4 px-2 rounded-lg" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}40` }}>
            <span className="block text-[9px] uppercase tracking-wider mb-2 font-bold" style={{ color }}>Temps</span>
            <span className="text-base font-black text-pop-white">{game.stats.duration}</span>
          </div>
          <div className="text-center py-4 px-2 rounded-lg" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}40` }}>
            <span className="block text-[9px] uppercase tracking-wider mb-2 font-bold" style={{ color }}>Âge</span>
            <span className="text-base font-black text-pop-white">{game.stats.age}</span>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between gap-4">
          <span className={`text-2xl font-black ${ACCENT_TEXT[ci]}`}>{game.price}</span>
          <button
            className="rounded-full px-8 py-3.5 uppercase text-[10px] font-black tracking-[0.15em] transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              backgroundColor: color,
              color: ci === 0 ? '#000000' : '#FFFFFF',
              boxShadow: `4px 4px 0px ${ci === 0 ? '#000000' : color}80`,
            }}
          >
            C'est mon jeu !
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
