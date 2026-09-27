import { useState } from 'react';
import { FileText, Upload, Plus, CheckCircle2, BookOpen, Layers } from 'lucide-react';
import { Form, SurveyQuestion } from '../types';
import { parseDocxFile } from '../lib/docParser';

interface Props {
  forms: Form[];
  onSaveForm: (form: Form) => Promise<void>;
}

export function FormsTab({ forms, onSaveForm }: Props) {
  const [selectedFormId, setSelectedFormId] = useState<string>(forms[0]?.id || '');
  const [isUploading, setIsUploading] = useState(false);
  const [showNewQuestionModal, setShowNewQuestionModal] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionDomain, setNewQuestionDomain] = useState<'exigencias' | 'ritmo' | 'apoio' | 'reconhecimento' | 'assedio' | 'saude'>('exigencias');

  const currentForm = forms.find(f => f.id === selectedFormId) || forms[0];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { detectedQuestions } = await parseDocxFile(file);
      if (detectedQuestions.length === 0) {
        alert('Nenhuma pergunta estruturada encontrada no arquivo docx. Verifique a formatação.');
      } else {
        const updatedQuestions = [...(currentForm.questions || []), ...detectedQuestions];
        const updatedForm: Form = {
          ...currentForm,
          questions: updatedQuestions
        };
        await onSaveForm(updatedForm);
        alert(`Sucesso! ${detectedQuestions.length} perguntas foram importadas do documento Word (.docx)!`);
      }
    } catch (err) {
      console.error('Error importing docx', err);
      alert('Falha ao processar arquivo .docx.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const domainLabels: Record<string, string> = {
      exigencias: 'Exigências Quantitativas e Emocionais',
      ritmo: 'Ritmo e Intensidade de Trabalho',
      apoio: 'Apoio Social e Liderança',
      reconhecimento: 'Reconhecimento e Recompensas',
      assedio: 'Relações Interpessoais e Conflitos',
      saude: 'Sintomas de Estresse e Burnout'
    };

    const newQ: SurveyQuestion = {
      id: `q-custom-${Date.now()}`,
      domain: newQuestionDomain,
      domainLabel: domainLabels[newQuestionDomain],
      text: newQuestionText,
      options: [
        { label: 'Nunca / Raramente', value: 1 },
        { label: 'Às vezes', value: 2 },
        { label: 'Com frequência', value: 3 },
        { label: 'Muito frequentemente', value: 4 },
        { label: 'Sempre', value: 5 }
      ]
    };

    const updatedForm: Form = {
      ...currentForm,
      questions: [...(currentForm.questions || []), newQ]
    };

    await onSaveForm(updatedForm);
    setNewQuestionText('');
    setShowNewQuestionModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Modelos de Questionários Psicossociais (COPSOQ II-Br & HSE-IT)
          </h3>
          <p className="text-xs text-slate-500">
            Instrumentos psicométricos padronizados validados pela comunidade científica e pelo MTE.
          </p>
        </div>

        {/* Upload Docx & Add Question */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-teal-600" />
            <span>{isUploading ? 'Processando...' : 'Importar Perguntas (.docx)'}</span>
            <input
              type="file"
              accept=".docx"
              disabled={isUploading}
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={() => setShowNewQuestionModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova Pergunta</span>
          </button>
        </div>
      </div>

      {/* Selector de Formulários */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {forms.map(f => {
          const isSelected = f.id === currentForm?.id;
          return (
            <button
              key={f.id}
              onClick={() => setSelectedFormId(f.id)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-teal-50/70 border-teal-500 shadow-xs ring-1 ring-teal-500'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{f.sector}</span>
                <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-600">
                  {f.version || 'v2.4'}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-teal-800 mt-1">{f.title}</h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{f.targetAudience}</p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <span>{f.questions?.length || 0} questões</span>
                <span className="text-teal-700 font-medium">Validado NR-1</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Lista de Perguntas do Formulário Ativo */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h4 className="text-sm font-bold text-slate-900">{currentForm?.title}</h4>
            <p className="text-xs text-slate-500">{currentForm?.description}</p>
          </div>
          <span className="text-xs font-mono bg-slate-100 px-2.5 py-1 rounded text-slate-700 font-medium">
            Total: {currentForm?.questions?.length || 0} Itens
          </span>
        </div>

        <div className="space-y-3">
          {currentForm?.questions?.map((q, idx) => (
            <div key={q.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                  Questão {idx + 1} · {q.domainLabel}
                </span>
                <p className="text-xs text-slate-800 font-medium">{q.text}</p>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono whitespace-nowrap bg-white px-2 py-1 rounded border border-slate-200">
                <span>Escala Likert 5 Pontos</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Nova Pergunta */}
      {showNewQuestionModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Adicionar Pergunta ao Formulário</h3>
            <form onSubmit={handleAddQuestion} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 block font-semibold mb-1">Dimensão Psicossocial:</label>
                <select
                  value={newQuestionDomain}
                  onChange={e => setNewQuestionDomain(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 outline-none font-medium"
                >
                  <option value="exigencias">Exigências Quantitativas e Emocionais</option>
                  <option value="ritmo">Ritmo e Intensidade de Trabalho</option>
                  <option value="apoio">Apoio Social e Liderança</option>
                  <option value="reconhecimento">Reconhecimento e Recompensas</option>
                  <option value="assedio">Relações Interpessoais e Conflitos</option>
                  <option value="saude">Sintomas de Estresse e Burnout</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 block font-semibold mb-1">Enunciado da Questão:</label>
                <textarea
                  rows={3}
                  required
                  value={newQuestionText}
                  onChange={e => setNewQuestionText(e.target.value)}
                  placeholder="Ex: Você tem autonomia para planejar a sequência das suas atividades diárias?"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewQuestionModal(false)}
                  className="px-3.5 py-2 rounded-lg text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer shadow-xs"
                >
                  Adicionar ao Formulário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
