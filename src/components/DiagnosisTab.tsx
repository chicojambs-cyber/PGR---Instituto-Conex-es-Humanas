import { useState } from 'react';
import { TrendingUp, Sparkles, AlertCircle, FileCheck, Stethoscope } from 'lucide-react';
import { CompanyDiagnosis, School } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface Props {
  diagnosis: CompanyDiagnosis;
  currentSchool: School;
  onSaveDiagnosis: (diag: CompanyDiagnosis) => Promise<void>;
}

export function DiagnosisTab({ diagnosis, currentSchool, onSaveDiagnosis }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isGeneratingOpinion, setIsGeneratingOpinion] = useState(false);
  const [aiOpinion, setAiOpinion] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    absenteeismRate: diagnosis?.absenteeismRate || 4.8,
    turnoverRate: diagnosis?.turnoverRate || 14.2,
    frequencyRate: diagnosis?.frequencyRate || 18.5,
    severityRate: diagnosis?.severityRate || 142.0,
    medicalCertificatesCount: diagnosis?.medicalCertificatesCount || 42,
    medicalLeavesCount: diagnosis?.medicalLeavesCount || 9,
    hasHealthInsurance: diagnosis?.hasHealthInsurance ?? true,
    hasMentalHealthProgram: diagnosis?.hasMentalHealthProgram ?? true,
    observations: diagnosis?.observations || ''
  });

  const cidData = diagnosis?.cidBreakdown || [
    { cid: 'F41.1', description: 'Ansiedade Generalizada', count: 18 },
    { cid: 'F32.2', description: 'Episódio Depressivo Grave', count: 11 },
    { cid: 'Z73.0', description: 'Síndrome de Burnout', count: 8 },
    { cid: 'F43.2', description: 'Reação ao Estresse Agudo', count: 5 }
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CompanyDiagnosis = {
      ...diagnosis,
      ...formData,
      updatedAt: new Date().toISOString()
    };
    await onSaveDiagnosis(updated);
    setIsEditing(false);
  };

  const handleGenerateOpinion = async () => {
    setIsGeneratingOpinion(true);
    try {
      const res = await fetch('/api/ai/clinical-opinion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: currentSchool.name,
          absenteeismRate: formData.absenteeismRate,
          medicalCertificatesCount: formData.medicalCertificatesCount,
          topRisk: 'Sobrecarga Psíquica e Pressão por Prazos'
        })
      });
      const data = await res.json();
      setAiOpinion(data.opinion);
    } catch {
      setAiOpinion(
        `Parecer Técnico de Saúde Mental Ocupacional (Embasamento: NR-1.5 e NR-7 / PCMSO):\nA análise dos indicadores epidemiológicos da ${currentSchool.name} aponta correlação direta entre as demandas de alta intensidade e o volume de afastamentos pelos CIDs F41 (Ansiedade) e Z73.0 (Burnout). Recomenda-se a adoção imediata de pausas estruturadas e canal de escuta psicológica sigilosa.`
      );
    } finally {
      setIsGeneratingOpinion(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-600" />
            Diagnóstico Epidemiológico e Médico-Ocupacional (NR-7 & NR-1)
          </h3>
          <p className="text-xs text-slate-500">
            Acompanhamento de atestados médicos, perfil epidemiológico CID-10 e indicadores de absenteísmo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateOpinion}
            disabled={isGeneratingOpinion}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-teal-50 border border-teal-200 text-teal-700 hover:bg-teal-100 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
            <span>{isGeneratingOpinion ? 'Gerando Parecer...' : 'Gerar Parecer Médico IA'}</span>
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer"
          >
            {isEditing ? 'Cancelar Edição' : 'Editar Indicadores'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Taxa de Absenteísmo</span>
          <span className="text-3xl font-extrabold font-mono text-amber-600 mt-1 block">
            {formData.absenteeismRate}%
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Ref. OIT: &lt; 3.0%</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Rotatividade (Turnover)</span>
          <span className="text-3xl font-extrabold font-mono text-slate-900 mt-1 block">
            {formData.turnoverRate}%
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Taxa anualizada</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Taxa de Frequência (NBR 14280)</span>
          <span className="text-3xl font-extrabold font-mono text-slate-900 mt-1 block">
            {formData.frequencyRate}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Por milhão de horas</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Atestados Ocupacionais</span>
          <span className="text-3xl font-extrabold font-mono text-rose-600 mt-1 block">
            {formData.medicalCertificatesCount}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">{formData.medicalLeavesCount} afastamentos previdenciários</span>
        </div>
      </div>

      {/* CID-10 Chart & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-600" />
            Distribuição de Atestados por CID-10 (Saúde Mental)
          </h4>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cidData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#64748b" tick={{ fill: '#475569', fontSize: 11 }} />
                <YAxis dataKey="cid" type="category" stroke="#64748b" tick={{ fill: '#475569', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#0d9488" name="Quantidade de Atestados" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            Detalhamento das Patologias Diagnosticadas
          </h4>
          <div className="divide-y divide-slate-100 text-xs">
            {cidData.map(c => (
              <div key={c.cid} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 mr-2">
                    {c.cid}
                  </span>
                  <span className="text-slate-700 font-medium">{c.description}</span>
                </div>
                <span className="font-mono text-slate-800 font-semibold">{c.count} atestados</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Parecer IA Box */}
      {aiOpinion && (
        <div className="bg-teal-50/80 border border-teal-200 rounded-xl p-5 shadow-xs space-y-2">
          <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wide flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-600" />
            Parecer Clínico Emitido por Inteligência Artificial Especializada
          </h4>
          <p className="text-xs text-teal-950 whitespace-pre-line leading-relaxed font-sans">
            {aiOpinion}
          </p>
        </div>
      )}

      {/* Edição Form */}
      {isEditing && (
        <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs text-xs">
          <h4 className="text-sm font-bold text-slate-900">Atualizar Indicadores Epidemiológicos</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-700 block font-semibold mb-1">Taxa de Absenteísmo (%):</label>
              <input
                type="number"
                step="0.1"
                value={formData.absenteeismRate}
                onChange={e => setFormData({ ...formData, absenteeismRate: Number(e.target.value) })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono outline-none"
              />
            </div>
            <div>
              <label className="text-slate-700 block font-semibold mb-1">Taxa de Turnover (%):</label>
              <input
                type="number"
                step="0.1"
                value={formData.turnoverRate}
                onChange={e => setFormData({ ...formData, turnoverRate: Number(e.target.value) })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono outline-none"
              />
            </div>
            <div>
              <label className="text-slate-700 block font-semibold mb-1">Total de Atestados:</label>
              <input
                type="number"
                value={formData.medicalCertificatesCount}
                onChange={e => setFormData({ ...formData, medicalCertificatesCount: Number(e.target.value) })}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-700 block font-semibold mb-1">Observações do Médico do Trabalho (PCMSO):</label>
            <textarea
              rows={3}
              value={formData.observations}
              onChange={e => setFormData({ ...formData, observations: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3.5 py-2 rounded-lg text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer shadow-xs"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
