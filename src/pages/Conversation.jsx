import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { PatientHeader, PatientShell } from '../components/layout/PatientShell';
import { Icon } from '../components/ui/Icon';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/utils';
const now = () => new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
const initialMessages = [
    {
        id: 'm1',
        role: 'assistant',
        text: 'Bonjour Amadou. Prenez votre temps. Je suis là pour vous écouter, sans jugement ni pression. Décrivez ce que vous ressentez : douleurs, fatigue, hydratation ou questions pour votre consultation.',
        time: '14:32',
    },
    {
        id: 'm2',
        role: 'user',
        text: 'Depuis ce matin vers 7h, j’ai une douleur lancinante dans les genoux et un peu dans le bas du dos. C’est après être sorti sous la pluie fraîche.',
        time: '14:35',
    },
    {
        id: 'm3',
        role: 'assistant',
        text: 'Merci de partager cela. Sur une échelle de 0 à 10, comment évalueriez-vous cette douleur maintenant ? Avez-vous pris un antalgique ou bu de l’eau depuis ?',
        time: '14:35',
    },
];
const scenarios = [
    { label: 'Douleur lombaire (6/10)', icon: 'healing', text: 'J’ai une douleur lombaire à 6 sur 10 depuis le réveil, surtout quand je me penche.' },
    { label: 'Hydratation grand froid', icon: 'water_drop', text: 'Il fait très froid dehors, j’ai bu 2 litres d’eau et je ressens quelques frissons.' },
    { label: 'Fatigue & vertiges', icon: 'battery_alert', text: 'Je suis très fatigué et j’ai eu un vertige en me levant ce matin.' },
];
const replies = [
    'Merci, c’est noté. Depuis quand ressentez-vous cela, et est-ce que le repos ou la chaleur l’atténue ?',
    'Je comprends. Avez-vous de la fièvre, des vomissements ou une douleur qui augmente malgré le traitement habituel ?',
    'Merci pour ces précisions. Je garde cela dans votre carnet. Vous pourrez relire et confirmer le résumé avant tout enregistrement.',
];
export default function Conversation() {
    const navigate = useNavigate();
    const startDraft = useAppStore((s) => s.startDraft);
    const pushToast = useAppStore((s) => s.pushToast);
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState('');
    const [mode, setMode] = useState('voice');
    const [recording, setRecording] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [typing, setTyping] = useState(false);
    const [replyIndex, setReplyIndex] = useState(0);
    const endRef = useRef(null);
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [messages, typing]);
    useEffect(() => {
        if (!recording)
            return;
        const timer = window.setInterval(() => setElapsed((v) => v + 1), 1000);
        return () => window.clearInterval(timer);
    }, [recording]);
    const send = (text) => {
        const value = text.trim();
        if (!value)
            return;
        setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', text: value, time: now() }]);
        setInput('');
        setTyping(true);
        window.setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { id: `a-${Date.now()}`, role: 'assistant', text: replies[replyIndex % replies.length], time: now() },
            ]);
            setReplyIndex((i) => i + 1);
            setTyping(false);
        }, 1100);
    };
    const stopRecording = () => {
        setRecording(false);
        const transcript = elapsed < 3
            ? 'J’ai une douleur dans les genoux depuis ce matin, environ 4 sur 10.'
            : 'J’ai une douleur dans les genoux et le bas du dos depuis ce matin. J’ai bu deux litres d’eau et pris mon traitement. La douleur est à 4 sur 10 et s’atténue avec la chaleur.';
        setInput(transcript);
        setElapsed(0);
        pushToast('Transcription vocale prête à être relue.', 'graphic_eq', 'success');
    };
    const buildSummary = () => {
        const patientWords = messages
            .filter((m) => m.role === 'user')
            .map((m) => m.text)
            .join(' ');
        startDraft(patientWords || 'Aucune parole patient enregistrée.', 'Douleurs des genoux et du bas du dos apparues après une exposition au froid. Hydratation à 2 L et traitement habituel déclarés. Intensité évaluée à 4/10, atténuée par la chaleur. Pas de fièvre ni de vomissement rapporté. À poursuivre : hydratation et surveillance de la douleur.', ['Douleur 4/10', 'Genoux & dos', 'Exposition au froid', '2 L d’eau']);
        navigate('/resume');
    };
    const userMessages = messages.filter((m) => m.role === 'user').length;
    return (<PatientShell withNav={false}>
      <PatientHeader title="Compagnon DrepaEcoute" subtitle="Protocole d’écoute active · Drépanocytose" backTo="/accueil" actions={<button type="button" onClick={() => navigate('/historique')} aria-label="Archives" className="flex h-11 w-11 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container">
            <Icon name="history" size={22}/>
          </button>}/>

      <div className="flex items-center gap-2 border-b border-error-container bg-error-container/50 px-4 py-2 text-[10px] leading-snug text-on-error-container">
        <Icon name="emergency" size={16} className="shrink-0"/>
        <p>
          <strong>Rappel médical :</strong> cet assistant ne remplace pas un médecin. En cas de crise aiguë, appelez le
          15 ou les urgences.
        </p>
      </div>

      <main className="flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-secondary-container">
              <Icon name="smart_toy" size={22} filled/>
              <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-surface bg-emerald-500"/>
            </span>
            <div>
              <p className="text-[13px] font-semibold text-primary">Assistant bienveillant</p>
              <p className="text-[10px] text-on-surface-variant">Espace sécurisé · données de santé chiffrées</p>
            </div>
          </div>
          <button type="button" onClick={() => navigate('/resume')} disabled={userMessages === 0} className="flex min-h-10 items-center gap-1 rounded-full bg-secondary-fixed px-3 text-[11px] font-semibold text-secondary transition hover:bg-secondary-fixed-dim disabled:opacity-40">
            <Icon name="summarize" size={16}/> Résumé
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto bg-surface-container-low/40 px-4 py-3">
          <div className="flex justify-center">
            <span className="rounded-full bg-surface-container px-2.5 py-1 text-[10px] font-medium text-on-surface-variant">
              Aujourd’hui · Nouvelle session de suivi
            </span>
          </div>

          {messages.map((message) => (<motion.div key={message.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn('flex gap-2', message.role === 'user' ? 'justify-end' : 'justify-start')}>
              {message.role === 'assistant' && (<span className="mt-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-secondary-container">
                  <Icon name="smart_toy" size={15} filled/>
                </span>)}
              <div className={cn('max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm', message.role === 'user'
                ? 'rounded-br-md bg-primary text-on-primary'
                : 'rounded-bl-md border border-surface-container bg-surface-container-lowest text-on-surface')}>
                <p>{message.text}</p>
                <p className={cn('mt-1 text-right text-[9px]', message.role === 'user' ? 'text-on-primary-container' : 'text-outline')}>
                  {message.time}
                </p>
              </div>
            </motion.div>))}

          {typing && (<div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-secondary-container">
                <Icon name="smart_toy" size={15} filled/>
              </span>
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-surface-container bg-surface-container-lowest px-3.5 py-3 shadow-sm">
                {[0, 1, 2].map((i) => (<span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-outline" style={{ animationDelay: `${i * 0.15}s` }}/>))}
              </div>
            </div>)}
          <div ref={endRef}/>
        </div>

        <div className="border-t border-surface-container bg-surface px-4 pb-4 pt-3">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex rounded-full bg-surface-container p-1">
              <button type="button" onClick={() => setMode('voice')} className={cn('flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold transition', mode === 'voice' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant')}>
                <Icon name="mic" size={15}/> Vocal
              </button>
              <button type="button" onClick={() => setMode('text')} className={cn('flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold transition', mode === 'text' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant')}>
                <Icon name="keyboard" size={15}/> Texte
              </button>
            </div>
            <span className="ml-auto text-[10px] text-on-surface-variant">
              {messages.length} échanges · chiffré
            </span>
          </div>

          <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1">
            {scenarios.map((scenario) => (<button key={scenario.label} type="button" onClick={() => send(scenario.text)} className="flex shrink-0 items-center gap-1 rounded-full border border-outline-variant/50 bg-surface-container-low px-2.5 py-1.5 text-[10px] font-medium text-on-surface-variant transition hover:border-secondary/40 hover:text-secondary">
                <Icon name={scenario.icon} size={14}/> {scenario.label}
              </button>))}
          </div>

          <AnimatePresence mode="wait">
            {mode === 'voice' ? (<motion.div key="voice" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex flex-col items-center gap-2">
                {recording && (<div className="flex w-full flex-col items-center gap-2 rounded-2xl bg-surface-container-low px-4 py-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 18 }).map((_, i) => (<motion.span key={i} animate={{ height: [6, 18 + ((i * 7) % 14), 6] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.04 }} className="w-1 rounded-full bg-secondary"/>))}
                    </div>
                    <p className="text-[11px] font-medium text-secondary">
                      Enregistrement en direct · {String(Math.floor(elapsed / 60)).padStart(2, '0')}:
                      {String(elapsed % 60).padStart(2, '0')}
                    </p>
                  </div>)}
                {input && (<div className="w-full rounded-xl border border-secondary/30 bg-secondary-fixed/20 p-2.5 text-[11px] text-on-surface-variant">
                    <span className="mb-1 flex items-center gap-1 text-[10px] font-semibold text-secondary">
                      <Icon name="subtitles" size={14}/> Transcription à relire
                    </span>
                    {input}
                  </div>)}
                <div className="flex w-full items-center gap-2">
                  <button type="button" onClick={recording ? stopRecording : () => setRecording(true)} className={cn('flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl text-[14px] font-bold shadow-md transition active:scale-[0.98]', recording
                ? 'bg-error-container text-on-error-container'
                : 'bg-primary text-on-primary hover:bg-primary-container')}>
                    <Icon name={recording ? 'stop_circle' : 'mic'} size={24} filled/>
                    {recording ? 'Terminer et transcrire' : 'Maintenir pour parler'}
                  </button>
                  <button type="button" onClick={() => send(input)} disabled={!input} aria-label="Envoyer la transcription" className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-on-secondary shadow-md transition active:scale-[0.98] disabled:opacity-40">
                    <Icon name="send" size={22} filled/>
                  </button>
                </div>
              </motion.div>) : (<motion.form key="text" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} onSubmit={(e) => {
                e.preventDefault();
                send(input);
            }} className="flex items-end gap-2">
                <div className="flex-1 rounded-2xl bg-surface-container-low px-3 py-2">
                  <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={1} placeholder="Écrivez ce que vous ressentez…" className="max-h-28 w-full resize-none bg-transparent py-1 text-[13px] text-on-surface outline-none placeholder:text-outline" onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                }
            }}/>
                </div>
                <button type="submit" disabled={!input.trim()} aria-label="Envoyer" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary shadow-md transition active:scale-[0.98] disabled:opacity-40">
                  <Icon name="send" size={21} filled/>
                </button>
              </motion.form>)}
          </AnimatePresence>

          <button type="button" onClick={buildSummary} className="mt-3 flex min-h-10 w-full items-center justify-center gap-1.5 rounded-full text-[11px] font-semibold text-secondary transition hover:bg-secondary-fixed/20">
            <Icon name="task_alt" size={16}/>
            Générer le résumé à relire
          </button>
        </div>
      </main>
    </PatientShell>);
}
