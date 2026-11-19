import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
export default function Splash() {
    const navigate = useNavigate();
    const login = useAppStore((s) => s.login);
    const pushToast = useAppStore((s) => s.pushToast);
    const enterDemo = () => {
        login(true);
        pushToast('Mode aperçu activé. Aucun profil permanent créé.', 'auto_stories');
        navigate('/accueil');
    };
    return (<div className="app-backdrop flex min-h-dvh flex-col">
      <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-6 pb-safe pt-safe">
        <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
          <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="relative mb-8 flex h-32 w-32 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-secondary/10"/>
            <span className="absolute inset-4 animate-pulse rounded-full bg-secondary/10"/>
            <span className="absolute inset-8 rounded-full bg-primary shadow-lg"/>
            <Icon name="water_drop" size={44} filled className="relative z-10 text-secondary-container"/>
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }} className="absolute -right-1 bottom-3 flex h-9 w-9 items-center justify-center rounded-full bg-secondary-fixed text-secondary shadow-md">
              <Icon name="verified" size={18} filled/>
            </motion.span>
          </motion.div>

          <p className="mb-2 flex items-center gap-1.5 rounded-full bg-surface-container-lowest px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-secondary shadow-sm">
            <Icon name="lock" size={13}/> Santé numérique certifiée &amp; HDS
          </p>
          <h1 className="font-display text-[34px] font-extrabold leading-none tracking-tight text-primary">
            Drepa<span className="text-secondary">Ecoute</span>
          </h1>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-on-surface-variant">
            L’allié bienveillant d’écoute, d’expression et de suivi partagé de la drépanocytose.
          </p>

          <div className="mt-8 grid w-full grid-cols-3 gap-2">
            {[
            { icon: 'support_agent', label: 'Assistance vocale & IA' },
            { icon: 'shield_lock', label: 'Hébergement HDS' },
            { icon: 'diversity_1', label: 'Centres de référence' },
        ].map((item) => (<div key={item.label} className="flex flex-col items-center gap-2 rounded-2xl border border-surface-container bg-surface-container-lowest/80 p-3 shadow-sm">
                <Icon name={item.icon} size={20} className="text-secondary"/>
                <span className="text-[10px] font-medium leading-tight text-on-surface-variant">{item.label}</span>
              </div>))}
          </div>
        </div>

        <div className="flex flex-col gap-3 pb-4">
          <Button size="lg" iconRight="arrow_forward" fullWidth onClick={() => navigate('/connexion')}>
            Démarrer mon suivi
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="soft" size="md" icon="badge" onClick={() => navigate('/pro')}>
              Espace praticien
            </Button>
            <Button variant="ghost" size="md" icon="login" onClick={() => navigate('/connexion')}>
              Se connecter
            </Button>
          </div>
          <button type="button" onClick={enterDemo} className="flex min-h-12 items-center justify-center gap-1.5 rounded-full text-[13px] font-medium text-secondary transition hover:underline">
            <Icon name="chevron_right" size={18}/>
            Découvrir en mode aperçu anonyme
          </button>

          <div className="mt-2 flex items-start gap-2 rounded-xl bg-surface-container-low p-3 text-[11px] leading-snug text-on-surface-variant">
            <Icon name="health_and_safety" size={16} className="mt-0.5 shrink-0 text-secondary"/>
            <p>
              Cadre éthique strict · RGPD Art. 9 · Secret médical partagé sous consentement explicite. Cet outil
              ne remplace pas un avis médical.
            </p>
          </div>
        </div>
      </div>
    </div>);
}
