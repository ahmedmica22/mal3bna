import { useLanguage } from '../../store/LanguageStore';
import { useState } from 'react';
import { Edit2, X, Loader2 } from 'lucide-react';
import { formatBasisPoints } from '../../utils/formatters';
import type { CommissionEditorProps } from '../../types/ui';

export type { CommissionEditorProps };

export function CommissionEditor({
  commissionBp = 1000,
  onSave,
  isSaving = false,
}: CommissionEditorProps) {
  const { translate } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [percent, setPercent] = useState<number>(commissionBp / 100);

  async function handleSave() {
    const bp = Math.round(percent * 100);
    await onSave(bp);
    setIsEditing(false);
  }

  function handleCancel() {
    setPercent(commissionBp / 100);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-lime-400/40 dark:bg-[#13221f]">
        <input
          type="number"
          min={10}
          max={20}
          step={0.5}
          value={percent}
          disabled={isSaving}
          onChange={(e) => setPercent(Number(e.target.value))}
          className="w-14 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-lime-400 dark:bg-[#0b1715] dark:border-white/15 dark:text-slate-100"
          autoFocus
        />
        <span className="text-xs text-slate-500 font-semibold dark:text-slate-400">%</span>
        <button
          type="button"
          disabled={isSaving}
          onClick={() => void handleSave()}
          aria-label={translate('Save Commission')}
          className="px-1.5 py-0.5 rounded bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold cursor-pointer transition-colors disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={12} className="animate-spin" /> : '✓'}
        </button>
        <button
          type="button"
          disabled={isSaving}
          onClick={handleCancel}
          aria-label={translate('Cancel')}
          className="px-1 py-0.5 rounded text-slate-500 hover:text-white transition-colors cursor-pointer dark:text-slate-400"
        >
          <X size={12} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <strong className="text-emerald-700 font-bold dark:text-lime-400">
        {formatBasisPoints(commissionBp)}
      </strong>
      <button
        type="button"
        aria-label={translate('Edit Commission')}
        className="text-slate-500 hover:text-white transition-colors cursor-pointer p-0.5 dark:text-slate-400"
        onClick={() => {
          setPercent(commissionBp / 100);
          setIsEditing(true);
        }}
      >
        <Edit2 size={12} />
      </button>
    </div>
  );
}
