import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Icon } from '../ui/Icon';
export function PatientHeader({ title, subtitle, backTo, actions, logo = false }) {
    const navigate = useNavigate();
    return (<header className="sticky top-0 z-40 border-b border-surface-container/60 bg-surface/85 pt-safe backdrop-blur-xl">
      <div className="flex min-h-16 items-center justify-between gap-3 px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          {backTo && (<button type="button" onClick={() => navigate(backTo)} aria-label="Retour" className="-ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container">
              <Icon name="arrow_back" size={22}/>
            </button>)}
          {logo ? (<>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-container-highest text-secondary">
                <Icon name="water_drop" size={24}/>
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="font-display text-[19px] font-bold leading-tight tracking-tight text-primary">
                  Drepa<span className="text-secondary">Ecoute</span>
                </span>
                <span className="mt-0.5 w-fit rounded-full bg-secondary-fixed/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-secondary">
                  Prototype de recherche
                </span>
              </div>
            </>) : (<div className="flex min-w-0 flex-col">
              <h1 className="truncate font-display text-[19px] font-bold leading-tight text-primary">{title}</h1>
              {subtitle && <p className="truncate text-[12px] text-on-surface-variant">{subtitle}</p>}
            </div>)}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {actions ?? (<>
              <button type="button" aria-label="Centre d'aide" className="flex h-11 w-11 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container">
                <Icon name="help_outline" size={22}/>
              </button>
              <button type="button" aria-label="Notifications" className="hidden h-11 w-11 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container sm:flex">
                <Icon name="notifications" size={22}/>
              </button>
              <NavLink to="/profil" aria-label="Mon profil" className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-on-primary">
                <Icon name="person" size={18}/>
              </NavLink>
            </>)}
        </div>
      </div>
    </header>);
}
const navItems = [
    { to: '/accueil', label: 'Accueil', icon: 'home' },
    { to: '/conversation', label: 'Discussion', icon: 'chat_bubble' },
    { to: '/historique', label: 'Historique', icon: 'calendar_month' },
    { to: '/confidentialite', label: 'Confiance', icon: 'shield' },
];
export function PatientShell({ children, withNav = true }) {
    return (<div className="app-backdrop min-h-dvh">
      <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col bg-surface shadow-[0_0_60px_rgba(15,41,66,0.10)]">
        <div className="flex flex-1 flex-col">{children}</div>
        {withNav && (<nav className="sticky bottom-0 z-40 border-t border-surface-container/70 bg-surface/90 pb-safe backdrop-blur-xl">
            <div className="flex h-20 items-center justify-around px-2">
              {navItems.map((item) => (<NavLink key={item.to} to={item.to} className={({ isActive }) => cn('flex min-h-12 min-w-14 flex-col items-center justify-center rounded-xl px-2 py-1 transition-all', isActive
                    ? 'font-semibold text-secondary'
                    : 'text-on-surface-variant hover:bg-surface-container-low')}>
                  {({ isActive }) => (<>
                      <Icon name={item.icon} size={24} filled={isActive}/>
                      <span className="mt-1 text-[11px] leading-none">{item.label}</span>
                    </>)}
                </NavLink>))}
            </div>
          </nav>)}
      </div>
    </div>);
}
