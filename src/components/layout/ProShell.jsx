import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Icon } from '../ui/Icon';
const items = [
    { to: '/pro', label: 'Tableau de bord', icon: 'grid_view', end: true },
    { to: '/pro/patients', label: 'Patients autorisés', icon: 'patient_list', end: false },
    { to: '/pro/patients/ID-DRP-84920', label: 'Dossier patient', icon: 'clinical_notes', end: true },
    { to: '/confidentialite', label: 'Confidentialité', icon: 'verified_user', end: true },
];
export function ProShell({ children, title, subtitle }) {
    const location = useLocation();
    return (<div className="app-backdrop min-h-dvh p-0 lg:p-6">
      <div className="mx-auto flex min-h-dvh w-full max-w-7xl overflow-hidden bg-surface shadow-[0_20px_80px_rgba(15,41,66,0.12)] lg:min-h-[calc(100dvh-3rem)] lg:rounded-3xl">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-surface-container bg-surface-container-lowest lg:flex">
          <div className="flex items-center gap-3 px-5 py-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-secondary-container">
              <Icon name="cardiology" size={24}/>
            </div>
            <div>
              <p className="font-display text-[17px] font-bold leading-tight text-primary">DrepaEcoute</p>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Pro · HDS</p>
            </div>
          </div>

          <nav className="flex flex-1 flex-col gap-1 px-3">
            {items.map((item) => (<NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition', isActive
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container')}>
                <Icon name={item.icon} size={20}/>
                <span className="font-medium">{item.label}</span>
              </NavLink>))}
          </nav>

          <div className="m-3 rounded-2xl bg-primary p-4 text-on-primary">
            <div className="flex items-center gap-2 text-secondary-fixed">
              <Icon name="verified_user" size={18} filled/>
              <span className="text-[11px] font-semibold uppercase tracking-wide">Session e-CPS</span>
            </div>
            <p className="mt-2 text-sm font-semibold">Dr. Aïssatou Traoré</p>
            <p className="text-[11px] text-on-primary-container">Hématologue · CHU Necker</p>
            <p className="mt-2 text-[10px] text-on-primary-container">RPPS 10103948271</p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex flex-col gap-4 border-b border-surface-container px-5 py-4 sm:px-8 sm:py-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
                  Hôpital Necker-Enfants Malades
                </p>
                <h1 className="truncate font-display text-[22px] font-bold tracking-tight text-primary sm:text-[26px]">
                  {title}
                </h1>
                {subtitle && <p className="truncate text-sm text-on-surface-variant">{subtitle}</p>}
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden items-center gap-1.5 rounded-full bg-secondary-fixed/60 px-3 py-1.5 text-[11px] font-semibold text-secondary sm:flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary"/> Synchro HDS : direct
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-on-primary">
                  AT
                </div>
              </div>
            </div>
            <nav className="flex gap-1 overflow-x-auto lg:hidden">
              {items.map((item) => (<NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => cn('whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-medium', isActive ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant')}>
                  {item.label}
                </NavLink>))}
            </nav>
          </header>
          <main key={location.pathname} className="flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-7">
            {children}
          </main>
        </div>
      </div>
    </div>);
}
