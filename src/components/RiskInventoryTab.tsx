import { useState } from 'react';
import { AlertCircle, Plus, Trash2, ShieldAlert, Filter } from 'lucide-react';
import { RiskInventoryItem } from '../types';

interface Props {
  inventory: RiskInventoryItem[];
  onSaveItem: (item: RiskInventoryItem) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
}

export function RiskInventoryTab({ inventory, onSaveItem, onDeleteItem }: Props) {
  const [filterCategory, setFilterCategory] = useState<string>('todos');
  const [filterSector, setFilterSector] = useState<string>('todos');
  const [showModal, setShowModal] = useState(false);

  const [newItem, setNewItem] = useState<Partial<RiskInventoryItem>>({
    ghe: 'GHE-01 - Operações',
    sector: 'Operacional',
    dangerFactor: '',
    source: '',
    exposedWorkers: 10,
    probability: 3,
    severity: 3,
    existingControls: '',
    proposedControls: ''
  });

  const filtered = inventory.filter(item => {
    const matchCat = filterCategory === 'todos' || item.riskCategory.toLowerCase() === filterCategory.toLowerCase();
    const matchSec = filterSector === 'todos' || item.sector.toLowerCase().includes(filterSector.toLowerCase());
    return matchCat && matchSec;
  });

  const calculateCategory = (prob: number, sev: number) => {
    const score = prob * sev;
    if (score >= 16) return 'Intolerável';
    if (score >= 12) return 'Substancial';
    if (score >= 8) return 'Moderado';
    if (score >= 4) return 'Tolerável';
    return 'Trivial';
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.dangerFactor || !newItem.source) {
      alert('Preencha os campos obrigatórios (Fator de Risco e Fonte Geradora).');
      return;
    }
    const prob = Number(newItem.probability) || 3;
    const sev = Number(newItem.severity) || 3;
    const cat = calculateCategory(prob, sev);

    const item: RiskInventoryItem = {
      id: `inv-${Date.now()}`,
      ghe: newItem.ghe || 'GHE Geral',
      sector: newItem.sector || 'Operacional',
      dangerFactor: newItem.dangerFactor,
      source: newItem.source,
      exposedWorkers: Number(newItem.exposedWorkers) || 10,
      probability: prob,
      severity: sev,
      riskScore: prob * sev,
      riskCategory: cat as any,
      existingControls: newItem.existingControls || 'Controles básicos vigentes',
      proposedControls: newItem.proposedControls || 'Ação preventiva vinculada ao PGR'
    };

    await onSaveItem(item);
    setShowModal(false);
    setNewItem({
      ghe: 'GHE-01 - Operações',
      sector: 'Operacional',
      dangerFactor: '',
      source: '',
      exposedWorkers: 10,
      probability: 3,
      severity: 3,
      existingControls: '',
      proposedControls: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-teal-600" />
            Inventário Geral de Riscos Ocupacionais (GRO / NR-1.5.7)
          </h3>
          <p className="text-xs text-slate-500">
            Mapeamento obrigatório por Grupo Homogêneo de Exposição (GHE), fontes geradoras, probabilidade e severidade.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="bg-transparent outline-none cursor-pointer font-medium"
            >
              <option value="todos">Todos os Graus</option>
              <option value="intolerável">Intolerável</option>
              <option value="substancial">Substancial</option>
              <option value="moderado">Moderado</option>
              <option value="tolerável">Tolerável</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
            <select
              value={filterSector}
              onChange={e => setFilterSector(e.target.value)}
              className="bg-transparent outline-none cursor-pointer font-medium"
            >
              <option value="todos">Todos os Setores</option>
              <option value="operacional">Operacional</option>
              <option value="administrativo">Administrativo</option>
              <option value="gestão">Gestão</option>
            </select>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Fator de Risco</span>
          </button>
        </div>
      </div>

      {/* Tabela do Inventário */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">GHE / Setor</th>
                <th className="py-3 px-4">Fator de Risco Psicossocial</th>
                <th className="py-3 px-4">Fonte Geradora / Perigo</th>
                <th className="py-3 px-3 text-center">Exp.</th>
                <th className="py-3 px-3 text-center">P x S</th>
                <th className="py-3 px-3 text-center">Grau de Risco</th>
                <th className="py-3 px-4">Medidas Propostas</th>
                <th className="py-3 px-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map(item => {
                let badgeClass = 'bg-yellow-50 text-yellow-800 border-yellow-200';
                if (item.riskCategory === 'Intolerável') badgeClass = 'bg-rose-50 text-rose-800 border-rose-200 font-bold';
                else if (item.riskCategory === 'Substancial') badgeClass = 'bg-amber-50 text-amber-800 border-amber-200 font-bold';
                else if (item.riskCategory === 'Tolerável') badgeClass = 'bg-teal-50 text-teal-800 border-teal-200';

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 block">{item.ghe}</span>
                      <span className="text-[11px] text-slate-500">{item.sector}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 max-w-[200px]">
                      {item.dangerFactor}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-[220px]">
                      {item.source}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold text-slate-800">
                      {item.exposedWorkers}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-800">
                      {item.probability} × {item.severity} = <span className="font-bold">{item.riskScore}</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] border ${badgeClass}`}>
                        {item.riskCategory}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-[240px]">
                      {item.proposedControls}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        title="Remover item"
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Novo Item de Inventário */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-teal-600" />
              Inserir Fator de Risco no Inventário GRO (NR-1.5.7)
            </h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-700 block font-semibold mb-1">GHE (Grupo Homogêneo):</label>
                  <input
                    type="text"
                    required
                    value={newItem.ghe}
                    onChange={e => setNewItem({ ...newItem, ghe: e.target.value })}
                    placeholder="Ex: GHE-01 Operações"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block font-semibold mb-1">Setor:</label>
                  <select
                    value={newItem.sector}
                    onChange={e => setNewItem({ ...newItem, sector: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 outline-none font-medium"
                  >
                    <option value="Operacional">Operacional</option>
                    <option value="Administrativo">Administrativo</option>
                    <option value="Gestão e Liderança">Gestão e Liderança</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 block font-semibold mb-1">Fator de Risco Psicossocial:</label>
                <input
                  type="text"
                  required
                  value={newItem.dangerFactor}
                  onChange={e => setNewItem({ ...newItem, dangerFactor: e.target.value })}
                  placeholder="Ex: Sobrecarga mental e ritmo acelerado contínuo"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-700 block font-semibold mb-1">Perigo / Fonte Geradora:</label>
                <textarea
                  rows={2}
                  required
                  value={newItem.source}
                  onChange={e => setNewItem({ ...newItem, source: e.target.value })}
                  placeholder="Ex: Falta de pausas para descanso, acúmulo de entregas diárias"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-700 block font-semibold mb-1">Trabalhadores Exp.:</label>
                  <input
                    type="number"
                    min={1}
                    value={newItem.exposedWorkers}
                    onChange={e => setNewItem({ ...newItem, exposedWorkers: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block font-semibold mb-1">Probabilidade (1 a 5):</label>
                  <select
                    value={newItem.probability}
                    onChange={e => setNewItem({ ...newItem, probability: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 outline-none font-mono"
                  >
                    <option value={1}>1 - Improvável</option>
                    <option value={2}>2 - Raro</option>
                    <option value={3}>3 - Ocasional</option>
                    <option value={4}>4 - Frequente</option>
                    <option value={5}>5 - Diário / Contínuo</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 block font-semibold mb-1">Severidade (1 a 5):</label>
                  <select
                    value={newItem.severity}
                    onChange={e => setNewItem({ ...newItem, severity: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 outline-none font-mono"
                  >
                    <option value={1}>1 - Leve</option>
                    <option value={2}>2 - Menor</option>
                    <option value={3}>3 - Médio (Afastamento curto)</option>
                    <option value={4}>4 - Grave (CID F / Burnout)</option>
                    <option value={5}>5 - Crítico / Incapacitante</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 block font-semibold mb-1">Medidas de Controle Propostas:</label>
                <input
                  type="text"
                  value={newItem.proposedControls}
                  onChange={e => setNewItem({ ...newItem, proposedControls: e.target.value })}
                  placeholder="Ex: Escala de pausas, redistribuição e treinamento de liderança"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-2 rounded-lg text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer shadow-xs"
                >
                  Salvar no Inventário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
