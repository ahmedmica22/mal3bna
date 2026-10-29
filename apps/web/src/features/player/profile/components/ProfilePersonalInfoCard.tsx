import { useState } from 'react';
import { User, Edit3, X, Check } from 'lucide-react';
import type { User as DomainUser } from '../../../../types/domain';

interface ProfilePersonalInfoCardProps {
  user: DomainUser | null | undefined;
  translate: (key: string) => string;
  onSave: (data: { name: string; phone?: string | null }) => Promise<void>;
}

export function ProfilePersonalInfoCard({
  user,
  translate,
  onSave,
}: ProfilePersonalInfoCardProps) {
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [isSavingInfo, setIsSavingInfo] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsSavingInfo(true);
    try {
      await onSave({ name: name.trim(), phone: phone.trim() || null });
      setIsEditingInfo(false);
    } finally {
      setIsSavingInfo(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md backdrop-blur-md dark:bg-[#13221f]/70 dark:border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2 m-0">
          <User size={16} className="text-emerald-700 dark:text-lime-400" />
          <span>{translate('Personal Information')}</span>
        </h2>
        {!isEditingInfo ? (
          <button
            type="button"
            onClick={() => setIsEditingInfo(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-lime-400/20 hover:bg-lime-400/30 border border-lime-400/40 dark:text-lime-300 dark:bg-lime-400/10 dark:hover:bg-lime-400/20 transition-all cursor-pointer"
          >
            <Edit3 size={13} />
            <span>{translate('Edit Details')}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSavingInfo}
              onClick={() => {
                setName(user?.name ?? '');
                setPhone(user?.phone ?? '');
                setIsEditingInfo(false);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X size={13} />
              <span>{translate('Cancel')}</span>
            </button>
            <button
              type="button"
              disabled={isSavingInfo || !name.trim()}
              onClick={() => void handleSave()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-lime-400 hover:bg-lime-300 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isSavingInfo ? (
                <span className="w-3.5 h-3.5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
              ) : (
                <Check size={13} />
              )}
              <span>{translate('Save Changes')}</span>
            </button>
          </div>
        )}
      </div>

      {isEditingInfo ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSave();
          }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
        >
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {translate('Full Name')} *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={translate('Enter your name')}
              className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lime-400 text-slate-900 dark:bg-white/5 dark:border-white/10 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {translate('Phone Number')}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01012345678"
              className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lime-400 text-slate-900 dark:bg-white/5 dark:border-white/10 dark:text-slate-100"
            />
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 text-sm">
          <div className="bg-slate-50 dark:bg-white/5 p-3.5 rounded-xl border border-slate-100 dark:border-white/5">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
              {translate('Full Name')}
            </span>
            <strong className="text-slate-900 dark:text-slate-100 font-bold block truncate">
              {user?.name || '—'}
            </strong>
          </div>
          <div className="bg-slate-50 dark:bg-white/5 p-3.5 rounded-xl border border-slate-100 dark:border-white/5">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
              {translate('Email Address')}
            </span>
            <strong className="text-slate-900 dark:text-slate-100 font-bold block truncate">
              {user?.email || '—'}
            </strong>
          </div>
          <div className="bg-slate-50 dark:bg-white/5 p-3.5 rounded-xl border border-slate-100 dark:border-white/5">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
              {translate('Phone Number')}
            </span>
            <strong className="text-slate-900 dark:text-slate-100 font-bold block truncate">
              {user?.phone || translate('Not set')}
            </strong>
          </div>
        </div>
      )}
    </div>
  );
}
