import React, { useState } from 'react';
import {
  X,
  Globe,
  Github,
  Rocket,
  CheckCircle2,
  Copy,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Server,
} from 'lucide-react';
import { TRANSLATIONS, Language } from '../locales/translations';

interface PublishOnlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const PublishOnlineModal: React.FC<PublishOnlineModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [activeGuide, setActiveGuide] = useState<'vercel' | 'render' | 'netlify'>('vercel');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-zinc-100">
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-950/90 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-zinc-950 font-bold shadow-lg shadow-emerald-500/20">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                {lang === 'sq'
                  ? 'Si ta Publikoni Online Falas me GitHub & Domen Falas'
                  : 'How to Publish Online Free with GitHub & Free Domain'}
              </h3>
              <p className="text-xs text-zinc-400">
                {lang === 'sq'
                  ? 'Udhëzues i thjeshtë hap pas hapi për ta bërë aplikacionin të përdorshëm nga të gjithë'
                  : 'Step-by-step easy guide to make this mockup app live for everyone'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Summary Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-zinc-900 border border-emerald-500/40">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-300">
                  {lang === 'sq'
                    ? 'Gjithçka është 100% Falas dhe zgjat vetëm 2 minuta!'
                    : 'Everything is 100% Free and takes just 2 minutes!'}
                </h4>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                  {lang === 'sq'
                    ? 'Meqë e keni llogarinë në GitHub, ju mund ta lidhni direkt me platforma falas si Vercel ose Render. Ato ju japin automatikisht një domen falas me certifikatë sigurie SSL (p.sh. emri-juaj.vercel.app ose emri-juaj.onrender.com).'
                    : 'Since you already have GitHub, you can connect it directly to free hosting platforms like Vercel or Render. They automatically provide a free domain with SSL (e.g., your-name.vercel.app or your-name.onrender.com).'}
                </p>
              </div>
            </div>
          </div>

          {/* Platform Switcher Tabs */}
          <div className="flex items-center gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setActiveGuide('vercel')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                activeGuide === 'vercel'
                  ? 'bg-zinc-800 text-emerald-400 border border-zinc-700 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>1. Vercel (Më e Lehta / E Rekomanduar)</span>
            </button>
            <button
              onClick={() => setActiveGuide('render')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                activeGuide === 'render'
                  ? 'bg-zinc-800 text-emerald-400 border border-zinc-700 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>2. Render.com (Server Full-Stack)</span>
            </button>
            <button
              onClick={() => setActiveGuide('netlify')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                activeGuide === 'netlify'
                  ? 'bg-zinc-800 text-emerald-400 border border-zinc-700 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>3. Netlify</span>
            </button>
          </div>

          {/* Guide 1: Vercel */}
          {activeGuide === 'vercel' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-3">
                <h5 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold">
                    1
                  </span>
                  <span>{lang === 'sq' ? 'Krijoni Repository-n në GitHub' : 'Create Repo on GitHub'}</span>
                </h5>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {lang === 'sq'
                    ? 'Krijoni një repository të ri në GitHub (p.sh. "maketa-rrobash") dhe hidhni kodin e këtij projekti:'
                    : 'Create a new repository on GitHub (e.g. "apparel-mockup-studio") and push your code:'}
                </p>
                <div className="bg-zinc-900 rounded-lg p-2.5 font-mono text-xs text-emerald-400 flex items-center justify-between">
                  <span>git init && git add . && git commit -m "initial commit"</span>
                  <button
                    onClick={() =>
                      handleCopy('git init && git add . && git commit -m "initial commit"', 'git')
                    }
                    className="text-zinc-400 hover:text-zinc-100 text-[11px] flex items-center gap-1"
                  >
                    {copiedCode === 'git' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'git' ? 'Kopjuar' : 'Kopjo'}</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-3">
                <h5 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold">
                    2
                  </span>
                  <span>{lang === 'sq' ? 'Lidhuni me Vercel me GitHub (1 Klikim)' : 'Connect Vercel with GitHub (1 Click)'}</span>
                </h5>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {lang === 'sq'
                    ? 'Hapni faqen vercel.com dhe klikoni "Sign Up" ose "Log In" me GitHub. Do të shihni listën e projekteve tuaja.'
                    : 'Open vercel.com and click "Sign Up" or "Log In" with GitHub. You will see your projects list.'}
                </p>
                <div className="flex items-center gap-2">
                  <a
                    href="https://vercel.com"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700 flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Hap Vercel.com</span>
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-3">
                <h5 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold">
                    3
                  </span>
                  <span>{lang === 'sq' ? 'Merrni Domenin Tuaj Falas' : 'Get Your Free Domain'}</span>
                </h5>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {lang === 'sq'
                    ? 'Zgjidhni projektin dhe klikoni "Deploy". Brenda pak sekondash Vercel ju jep një domen falas, si:'
                    : 'Select your project and click "Deploy". In a few seconds Vercel assigns you a free domain, like:'}
                </p>
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 font-mono flex items-center justify-between">
                  <span>https://emri-juaj.vercel.app</span>
                  <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-200 font-sans">
                    100% Falas + SSL
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  {lang === 'sq'
                    ? 'Mund ta ndryshoni emrin e domenit falas në çdo kohë nga paneli: Settings > Domains në Vercel.'
                    : 'You can change the free subdomain name anytime from Settings > Domains in Vercel.'}
                </p>
              </div>

              {/* Environment Variables tip */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
                <span className="font-bold">Këshillë për Gemini AI:</span> Tek Vercel (ose Render), shkoni tek <strong>Settings &gt; Environment Variables</strong> dhe shtoni <code>GEMINI_API_KEY</code> me vlerën e çelësit tuaj nëse dëshironi që gjenerimi me AI të funksionojë edhe në serverin tuaj të publikuar.
              </div>
            </div>
          )}

          {/* Guide 2: Render.com */}
          {activeGuide === 'render' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-3">
                <h5 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-400" />
                  <span>Render.com (Për Server Node.js / Express të plotë)</span>
                </h5>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Render është perfekt për aplikacione që kanë backend me Express:
                </p>
                <ol className="text-xs text-zinc-300 space-y-2 list-decimal list-inside leading-relaxed">
                  <li>Shkoni tek <strong>render.com</strong> dhe bëni login me <strong>GitHub</strong>.</li>
                  <li>Kliko <strong>New +</strong> &gt; <strong>Web Service</strong>.</li>
                  <li>Zgjidhni repository-n e projektit tuaj nga GitHub.</li>
                  <li>Vendosni <strong>Build Command</strong>: <code>npm install && npm run build</code></li>
                  <li>Vendosni <strong>Start Command</strong>: <code>npm start</code></li>
                  <li>Kliko <strong>Deploy Web Service</strong>.</li>
                </ol>
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 font-mono">
                  Domeni juaj falas: <strong>https://emri-juaj.onrender.com</strong>
                </div>
              </div>
            </div>
          )}

          {/* Guide 3: Netlify */}
          {activeGuide === 'netlify' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-3">
                <h5 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>Netlify (Hosting shumë i shpejtë për faqe web)</span>
                </h5>
                <ol className="text-xs text-zinc-300 space-y-2 list-decimal list-inside leading-relaxed">
                  <li>Shkoni tek <strong>netlify.com</strong> dhe zgjidhni "Log in with GitHub".</li>
                  <li>Kliko "Add new site" &gt; "Import an existing project".</li>
                  <li>Zgjidhni repository-n tuaj të GitHub.</li>
                  <li>Build command vendoset automatikisht <code>npm run build</code> dhe Publish directory <code>dist</code>.</li>
                  <li>Kliko "Deploy site" dhe menjëherë merrni domenin tuaj: <strong>https://emri-juaj.netlify.app</strong>.</li>
                </ol>
              </div>
            </div>
          )}

          {/* Custom Domain Tips */}
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>Dëshironi një domen të shkurtër tuajin (p.sh. .com, .shop, .al)?</span>
            </h5>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Të gjitha platformat (Vercel, Render, Netlify) ju lejojnë të lidhni pa asnjë pagesë shtesë çdo domen që mund të blini (p.sh. me $1-3 në vit për .xyz/.shop/.online). Thjesht shkoni tek <em>Settings &gt; Domains</em> dhe shtoni domenin tuaj!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-zinc-950/90 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-zinc-400">
            {lang === 'sq' ? 'Çdo gjë është e thjeshtë dhe e automatizuar.' : 'Everything is simple and automated.'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-zinc-950 rounded-lg transition-colors"
          >
            {lang === 'sq' ? 'E Kuptova, Faleminderit!' : 'Got it, Thanks!'}
          </button>
        </div>
      </div>
    </div>
  );
};
