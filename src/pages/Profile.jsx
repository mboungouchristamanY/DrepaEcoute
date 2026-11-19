import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PatientHeader, PatientShell } from '../components/layout/PatientShell';
import { Icon } from '../components/ui/Icon';
import { useAppStore } from '../store/useAppStore';
import { patient } from '../data/mock';
import { cn } from '../lib/utils';
export default function Profile() {
    const navigate = useNavigate();
    const logout = useAppStore((s) => s.logout);
    const pushToast = useAppStore((s) => s.pushToast);
    const [notifications, setNotifications] = useState(true);
    const [reminders, setReminders] = useState(true);
    const [biometrics, setBiometrics] = useState(true);
    const settings = [
        { label: 'Rappels d’hydratation', description: 'Objectif 3 L · 3 rappels par jour', value: reminders, set: setReminders },
        { label: 'Notifications cliniques', description: 'Résumés et rendez-vous', value: notifications, set: setNotifications },
        { label: 'Déverrouillage biométrique', description: 'Empreinte sur cet appareil', value: biometrics, set: setBiometrics },
    ];
    return (<PatientShell>
      <PatientHeader title="Profil & paramètres" subtitle="Votre carnet personnel" backTo="/accueil"/>
      <main className="flex flex-1 flex-col gap-4 px-4 pb-8 pt-4">
        <div className="flex items-center gap-3 rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary font-display text-[20px] font-bold text-on-primary">
              AD
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-secondary text-on-secondary">
              <Icon name="verified" size={13} filled/>
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-[20px] font-bold leading-tight text-primary">{patient.fullName}</h1>
            <p className="text-[12px] text-on-surface-variant">
              {patient.age} ans · {patient.genotype}
            </p>
            <p className="mt-0.5 text-[11px] text-on-surface-variant">
              Suivi : {patient.hospital}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-surface-container px-2 py-0.5 text-[9px] font-semibold text-on-surface-variant">
                {patient.carnetId}
              </span>
              <span className="flex items-center gap-0.5 rounded-full bg-secondary-fixed px-2 py-0.5 text-[9px] font-semibold text-secondary">
                <Icon name="verified_user" size={11}/> Vérifié HDS
              </span>
            </div>
          </div>
        </div>

        <section className="flex flex-col gap-2 rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
          <h2 className="flex items-center gap-1.5 font-display text-[15px] font-bold text-primary">
            <Icon name="medical_information" size={18} className="text-error"/> Repères de soins d’urgence
          </h2>
          <div className="flex items-start gap-2.5 rounded-xl bg-error-container/30 p-3">
            <Icon name="contact_phone" size={18} className="mt-0.5 shrink-0 text-on-error-container"/>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-on-error-container">Contact désigné</p>
              <p className="text-[12px] font-semibold text-primary">{patient.emergencyContact}</p>
            </div>
            <button type="button" onClick={() => pushToast('Appel simulé vers le contact d’urgence.', 'call', 'success')} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-on-secondary" aria-label="Appeler le contact d'urgence">
              <Icon name="call" size={17}/>
            </button>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl bg-surface-container-low p-3">
            <Icon name="local_hospital" size={18} className="mt-0.5 shrink-0 text-secondary"/>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-secondary">Centre de référence</p>
              <p className="text-[12px] font-semibold text-primary">{patient.hospital}</p>
              <p className="text-[11px] text-on-surface-variant">{patient.doctor} ({patient.doctorRole})</p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-2 rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
          <h2 className="flex items-center gap-1.5 font-display text-[15px] font-bold text-primary">
            <Icon name="prescriptions" size={18} className="text-secondary"/> Traitement de fond usuel
          </h2>
          <p className="text-[10px] text-outline">Auto-déclaré · à valider avec votre hématologue</p>
          {patient.treatment.map((item) => (<div key={item} className="flex items-center gap-2 rounded-lg bg-surface-container-low px-2.5 py-2">
              <Icon name="medication" size={16} className="shrink-0 text-secondary"/>
              <span className="text-[11px] text-on-surface">{item}</span>
            </div>))}
          <button type="button" onClick={() => pushToast('Mise à jour du traitement simulée.', 'edit', 'success')} className="mt-1 flex min-h-10 items-center justify-center gap-1 rounded-xl border border-dashed border-outline-variant text-[11px] font-semibold text-secondary hover:bg-surface-container-low">
            <Icon name="edit" size={15}/> Mettre à jour
          </button>
        </section>

        <section className="flex flex-col gap-2 rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
          <h2 className="font-display text-[15px] font-bold text-primary">Préférences</h2>
          {settings.map((item) => (<div key={item.label} className="flex items-center justify-between gap-3 rounded-xl bg-surface-container-low p-3">
              <div>
                <p className="text-[12px] font-semibold text-primary">{item.label}</p>
                <p className="text-[10px] text-on-surface-variant">{item.description}</p>
              </div>
              <button type="button" role="switch" aria-checked={item.value} onClick={() => {
                item.set(!item.value);
                pushToast(`${item.label} ${!item.value ? 'activé' : 'désactivé'}.`, 'tune', 'success');
            }} className={cn('relative h-7 w-12 shrink-0 rounded-full transition-colors', item.value ? 'bg-secondary' : 'bg-surface-container-highest')}>
                <span className={cn('absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all', item.value ? 'left-6' : 'left-1')}/>
              </button>
            </div>))}
          <button type="button" onClick={() => navigate('/confidentialite')} className="mt-1 flex min-h-11 items-center justify-between rounded-xl bg-surface-container-low px-3 text-[12px] font-semibold text-primary">
            <span className="flex items-center gap-2">
              <Icon name="shield_person" size={18} className="text-secondary"/> Confidentialité & partages
            </span>
            <Icon name="chevron_right" size={18} className="text-outline"/>
          </button>
        </section>

        <div className="flex flex-col gap-2 pt-1">
          <button type="button" onClick={() => pushToast('Aide et ressources bientôt disponibles.', 'support_agent')} className="flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-surface-container text-[12px] font-semibold text-primary transition hover:bg-surface-container-high">
            <Icon name="help_outline" size={17}/> Besoin d’aide ?
          </button>
          <button type="button" onClick={() => {
            logout();
            navigate('/');
        }} className="flex min-h-11 items-center justify-center gap-1.5 rounded-full text-[12px] font-semibold text-error transition hover:bg-error-container/30">
            <Icon name="logout" size={17}/> Se déconnecter
          </button>
          <p className="text-center text-[10px] text-outline">DrepaEcoute · v1.0 · prototype de recherche HDS</p>
        </div>
      </main>
    </PatientShell>);
}
