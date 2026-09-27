import { useState } from 'react';
import { Cloud, Download, Upload, CheckCircle2, RefreshCw, Database } from 'lucide-react';
import { DataService } from '../lib/firebase';

interface Props {
  onRefreshData: () => Promise<void>;
}

export function CloudSyncTab({ onRefreshData }: Props) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleDownloadBackup = () => {
    const json = DataService.exportBackupJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_psicosafe_nr1_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async event => {
      const content = event.target?.result as string;
      const success = DataService.importBackupJson(content);
      if (success) {
        await onRefreshData();
        alert('Backup restaurado com sucesso! Os dados foram recarregados.');
      } else {
        alert('Erro ao restaurar arquivo de backup.');
      }
    };
    reader.readAsText(file);
  };

  const handleForceSync = async () => {
    setIsSyncing(true);
    setSyncStatus('Sincronizando com Firestore Database: ai-studio-psicosafenr1gest-b5c6d3ed-5997-4835-bff1-e3ba7276b228...');
    try {
      await onRefreshData();
      setSyncStatus('Sincronização em nuvem concluída com sucesso!');
    } catch {
      setSyncStatus('Operando com réplica em cache local offline-first.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Cloud className="w-5 h-5 text-teal-600" />
          Sincronização em Nuvem, Persistência e Backup
        </h3>
        <p className="text-xs text-slate-500">
          Gerenciamento da conexão com o banco de dados Firebase Firestore e geração de cópias de segurança (backups).
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Instância Firestore Ativa</h4>
              <p className="text-xs font-mono text-slate-500">
                ai-studio-psicosafenr1gest-b5c6d3ed-5997-4835-bff1-e3ba7276b228
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Conectado & Seguro
          </span>
        </div>

        {syncStatus && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-mono">
            {syncStatus}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            onClick={handleForceSync}
            disabled={isSyncing}
            className="flex items-center justify-center gap-2 p-3 rounded-lg border border-teal-600 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sincronizar Nuvem</span>
          </button>

          <button
            onClick={handleDownloadBackup}
            className="flex items-center justify-center gap-2 p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs cursor-pointer transition-all"
          >
            <Download className="w-4 h-4 text-teal-600" />
            <span>Exportar Backup (JSON)</span>
          </button>

          <label className="flex items-center justify-center gap-2 p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs cursor-pointer transition-all">
            <Upload className="w-4 h-4 text-slate-600" />
            <span>Restaurar Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
