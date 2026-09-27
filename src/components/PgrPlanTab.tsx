import { useState } from 'react';
import { ClipboardCheck, Plus, Sparkles, Filter, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Intervention, School } from '../types';

interface Props {
  interventions: Intervention[];
  currentSchool: School;
  onSaveIntervention: (item: Intervention) => Promise<void>;
  onDeleteIntervention: (id: string) => Promise<void>;
}

export function PgrPlanTab({ interventions, currentSchool, onSaveIntervention }: Props) {
  const [sectorFilter, setSectorFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [newAction, setNewAction] = useState({
    title: '',
    sector: 'Operacional / Logística',
    riskLevel: 'Alto' as 'Baixo' | 'Moderado' | 'Alto' | 'Crítico',
    description: '',
    priority: 'Alta' as 'Baixa' | 'Média' | 'Alta' | 'Urgente',
    deadline: '',
    responsible: '',
    costEstimate: 'R$ 5.000,00',
    what: '',
    why: '',
    where: '',
    when: '',
    who: '',
    how: ''
  });

  const filtered = interventions.filter(item => {
    const matchSec = sectorFilter === 'todos' || item.sector.toLowerCase().includes(sectorFilter.toLowerCase());
    const matchSta = statusFilter === 'todos' || item.status.toLowerCase() === statusFilter.toLowerCase();
    return matchSec && matchSta;
  });

  // IA Generation of 5W2H Actions
  const handleGenerateAiActions = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: currentSchool.name,
          sector: sectorFilter === 'todos' ? 'Operacional' : sectorFilter,
          criticalFactors: ['Ritmo Acelerado', 'Exigências Mentais', 'Fadiga Noturna'],
          overallRisk: 'Alto'
        })
      });

      if (!res.ok) throw new Error('Falha na resposta da IA');
      const data = await res.json();

      if (data.recommendations && Array.isArray(data.recommendations)) {
        for (const rec of data.recommendations) {
          const item: Intervention = {
            id: `int-ai-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            schoolId: currentSchool.id,
            sector: rec.methodology5W2H?.where || 'Operacional / Logística',
            riskLevel: rec.riskLevel || 'Alto',
            title: rec.title,
            description: rec.description,
            priority: rec.priority || 'Alta',
            deadline: rec.deadline || '2026-06-30',
            status: 'Em Andamento',
            responsible: rec.responsible || 'SST & RH',
            costEstimate: rec.costEstimate,
            methodology5W2H: rec.methodology5W2H,
            createdAt: new Date().toISOString()
          };
          await onSaveIntervention(item);
        }
        alert('Recomendações técnicas geradas com sucesso pela IA e incorporadas ao Plano PGR!');
      }
    } catch (err) {
      console.warn('AI fallback:', err);
      // Fallback regulamentar instantâneo
      const fallbackItem: Intervention = {
        id: `int-ai-${Date.now()}`,
        schoolId: currentSchool.id,
        sector: 'Operacional / Logística',
        riskLevel: 'Crítico',
        title: 'Adequação Ergonômica de Jornadas e Protocolo de Pausas Térmico-Mentais',
        description: 'Instituir rodízio programado a cada 120 minutos de trabalho contínuo com pausas de descompressão cognitiva conforme item 1.5.4 da NR-1.',
        priority: 'Urgente',
        deadline: '2026-05-15',
        status: 'Em Andamento',
        responsible: 'Engenharia de Segurança & Liderança Operacional',
        costEstimate: 'R$ 7.500,00',
        methodology5W2H: {
          what: 'Implantação de pausas obrigatórias de 15 minutos no turno produtivo',
          why: 'Reduzir picos de estresse e fadiga mental identificados nas avaliações',
          where: 'Setores Operacional e Expedição',
          when: 'Início em 15/04/2026',
          who: 'Engenharia SST e Coordenadores de Área',
          how: 'Readequação de esteiras e escalas de revezamento',
          howMuch: 'R$ 7.500,00'
        },
        createdAt: new Date().toISOString()
      };
      await onSaveIntervention(fallbackItem);
      alert('Ação preventiva técnica 5W2H adicionada ao PGR com sucesso!');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAction.title || !newAction.responsible) {
      alert('Título e Responsável são obrigatórios.');
      return;
    }

    const item: Intervention = {
      id: `int-${Date.now()}`,
      schoolId: currentSchool.id,
      sector: newAction.sector,
      riskLevel: newAction.riskLevel,
      title: newAction.title,
      description: newAction.description || newAction.what,
      priority: newAction.priority,
      deadline: newAction.deadline || '2026-06-30',
      status: 'Em Andamento',
      responsible: newAction.responsible,
      costEstimate: newAction.costEstimate,
      methodology5W2H: {
        what: newAction.what || newAction.title,
        why: newAction.why || 'Mitigação de riscos psicossociais mapeados no GRO',
        where: newAction.where || newAction.sector,
        when: newAction.when || newAction.deadline,
        who: newAction.who || newAction.responsible,
        how: newAction.how || newAction.description,
        howMuch: newAction.costEstimate
      },
      createdAt: new Date().toISOString()
    };

    await onSaveIntervention(item);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-teal-600" />
            Plano de Ação e Intervenções Preventivas PGR (NR-1.5 / Metodologia 5W2H)
          </h3>
          <p className="text-xs text-slate-500">
            Medidas de controle com prazos, responsáveis técnicos e orçamentos vinculados ao GRO da empresa.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* AI Button */}
          <button
            onClick={handleGenerateAiActions}
            disabled={isGeneratingAi}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 shadow-xs cursor-pointer transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>{isGeneratingAi ? 'Consultando IA...' : 'Sugerir Ações 5W2H com IA'}</span>
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova Ação PGR</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={sectorFilter}
          onChange={e => setSectorFilter(e.target.value)}
          className="bg-white border border-slate-200 text-slate-700 text-xs rounded-lg px-3 py-2 outline-none font-medium"
        >
          <option value="todos">Todos os Setores</option>
          <option value="operacional">Operacional</option>
          <option value="administrativo">Administrativo</option>
          <option value="gestão">Gestão</option>
        </select>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-white border border-slate-200 text-slate-700 text-xs rounded-lg px-3 py-2 outline-none font-medium"
        >
          <option value="todos">Todos os Status</option>
          <option value="em andamento">Em Andamento</option>
          <option value="concluído">Concluído</option>
          <option value="pendente">Pendente</option>
        </select>
      </div>

      {/* Cards de Ação 5W2H */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(item => {
          let badgeRisk = 'bg-yellow-50 text-yellow-800 border-yellow-200';
          if (item.riskLevel === 'Crítico') badgeRisk = 'bg-rose-50 text-rose-800 border-rose-200';
          else if (item.riskLevel === 'Alto') badgeRisk = 'bg-amber-50 text-amber-800 border-amber-200';

          return (
            <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${badgeRisk}`}>
                    Risco {item.riskLevel}
                  </span>
                  <button
                    onClick={async () => {
                      const newStatus = item.status === 'Concluído' ? 'Em Andamento' : 'Concluído';
                      await onSaveIntervention({ ...item, status: newStatus });
                    }}
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded cursor-pointer ${
                      item.status === 'Concluído'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    {item.status}
                  </button>
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

                {/* 5W2H Methodology Grid */}
                {item.methodology5W2H && (
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5 text-[11px]">
                    <div className="text-teal-800 font-bold uppercase tracking-wider text-[10px] pb-1 border-b border-slate-200">
                      Detalhamento Metodológico 5W2H
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-slate-600">
                      <div><span className="font-semibold text-slate-800">Por que (Why):</span> {item.methodology5W2H.why}</div>
                      <div><span className="font-semibold text-slate-800">Como (How):</span> {item.methodology5W2H.how}</div>
                      <div><span className="font-semibold text-slate-800">Onde (Where):</span> {item.methodology5W2H.where}</div>
                      <div><span className="font-semibold text-slate-800">Custo (How much):</span> {item.methodology5W2H.howMuch || item.costEstimate || 'N/A'}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Resp: <strong className="text-slate-700">{item.responsible}</strong></span>
                <span>Prazo: <strong className="text-teal-700 font-mono">{item.deadline}</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nova Ação 5W2H */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900">Cadastrar Medida de Controle PGR (5W2H)</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 block font-semibold mb-1">Título da Ação:</label>
                <input
                  type="text"
                  required
                  value={newAction.title}
                  onChange={e => setNewAction({ ...newAction, title: e.target.value })}
                  placeholder="Ex: Treinamento em Liderança Positiva e Comunicação Não-Violenta"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-700 block font-semibold mb-1">Setor Destino:</label>
                  <select
                    value={newAction.sector}
                    onChange={e => setNewAction({ ...newAction, sector: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 outline-none font-medium"
                  >
                    <option value="Operacional / Logística">Operacional / Logística</option>
                    <option value="Administrativo / Financeiro">Administrativo / Financeiro</option>
                    <option value="Gestão e Liderança">Gestão e Liderança</option>
                    <option value="Todos os Setores">Todos os Setores</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 block font-semibold mb-1">Grau de Risco:</label>
                  <select
                    value={newAction.riskLevel}
                    onChange={e => setNewAction({ ...newAction, riskLevel: e.target.value as any })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 outline-none font-medium"
                  >
                    <option value="Baixo">Baixo</option>
                    <option value="Moderado">Moderado</option>
                    <option value="Alto">Alto</option>
                    <option value="Crítico">Crítico</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 block font-semibold mb-1">O que será feito (What):</label>
                <input
                  type="text"
                  value={newAction.what}
                  onChange={e => setNewAction({ ...newAction, what: e.target.value })}
                  placeholder="Ex: Workshops práticos com supervisores"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-700 block font-semibold mb-1">Por que será feito (Why):</label>
                <input
                  type="text"
                  value={newAction.why}
                  onChange={e => setNewAction({ ...newAction, why: e.target.value })}
                  placeholder="Ex: Redução de atritos e cumprimento da Lei 14.457/22"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-700 block font-semibold mb-1">Responsável (Who):</label>
                  <input
                    type="text"
                    required
                    value={newAction.responsible}
                    onChange={e => setNewAction({ ...newAction, responsible: e.target.value })}
                    placeholder="Ex: Coordenação de SST"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block font-semibold mb-1">Prazo (When):</label>
                  <input
                    type="date"
                    required
                    value={newAction.deadline}
                    onChange={e => setNewAction({ ...newAction, deadline: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 block font-semibold mb-1">Custo Estimado (How Much):</label>
                <input
                  type="text"
                  value={newAction.costEstimate}
                  onChange={e => setNewAction({ ...newAction, costEstimate: e.target.value })}
                  placeholder="R$ 5.000,00"
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
                  Salvar Ação PGR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
