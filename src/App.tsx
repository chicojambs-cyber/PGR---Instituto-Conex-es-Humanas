import { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  Activity,
  FileText,
  Users,
  Download,
  Plus,
  Building2,
  Lock,
  HeartHandshake,
  ClipboardCheck,
  TrendingUp,
  RefreshCw,
  BookOpen,
  Cloud,
  Layers,
  ShieldAlert,
  UserCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';

import {
  School,
  CompanyDiagnosis,
  Form,
  Response,
  Intervention,
  AuditLog,
  ScheduledAppointment,
  SurveyScores,
  Employee,
  RiskInventoryItem,
  AppointmentSlot,
  RolePermission
} from './types';
import { DataService } from './lib/firebase';
import { generateAnonymousHash } from './lib/crypto';
import { generatePgrPdfReport } from './lib/pdfExport';

import { RiskInventoryTab } from './components/RiskInventoryTab';
import { EmployeesTab } from './components/EmployeesTab';
import { FormsTab } from './components/FormsTab';
import { PgrPlanTab } from './components/PgrPlanTab';
import { DiagnosisTab } from './components/DiagnosisTab';
import { SupportTab } from './components/SupportTab';
import { PermissionsTab } from './components/PermissionsTab';
import { CloudSyncTab } from './components/CloudSyncTab';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'inventory' | 'pgr' | 'survey' | 'forms' | 'employees' | 'diagnosis' | 'support' | 'permissions' | 'cloud' | 'audit'
  >('dashboard');

  const [userRole, setUserRole] = useState<'admin' | 'sst' | 'rh' | 'colaborador'>('sst');

  // State
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('');
  const [diagnoses, setDiagnoses] = useState<CompanyDiagnosis[]>([]);
  const [forms, setForms] = useState<Form[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [riskInventory, setRiskInventory] = useState<RiskInventoryItem[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [appointmentSlots, setAppointmentSlots] = useState<AppointmentSlot[]>([]);
  const [appointments, setAppointments] = useState<ScheduledAppointment[]>([]);
  const [permissions, setPermissions] = useState<RolePermission[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [showNewSchoolModal, setShowNewSchoolModal] = useState(false);

  // Survey Answering State
  const [surveySector, setSurveySector] = useState('Operacional');
  const [surveyRole, setSurveyRole] = useState('Colaborador');
  const [surveyTenure, setSurveyTenure] = useState('1 a 3 anos');
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, number>>({});
  const [anonymousHash, setAnonymousHash] = useState('');
  const [surveySubmitted, setSurveySubmitted] = useState(false);

  // New School Form State
  const [newSchool, setNewSchool] = useState({
    name: '',
    cnpj: '',
    cnae: '',
    riskDegree: 3,
    city: '',
    state: 'SP',
    totalEmployees: 100
  });

  const loadAll = async () => {
    try {
      const [sc, dg, fm, rs, iv, ri, em, as, ap, pm, lg] = await Promise.all([
        DataService.getSchools(),
        DataService.getDiagnoses(),
        DataService.getForms(),
        DataService.getResponses(),
        DataService.getInterventions(),
        DataService.getRiskInventory(),
        DataService.getEmployees(),
        DataService.getAppointmentSlots(),
        DataService.getAppointments(),
        DataService.getRolePermissions(),
        DataService.getAuditLogs()
      ]);
      setSchools(sc);
      if (sc.length > 0 && !selectedSchoolId) setSelectedSchoolId(sc[0].id);
      setDiagnoses(dg);
      setForms(fm);
      setResponses(rs);
      setInterventions(iv);
      setRiskInventory(ri);
      setEmployees(em);
      setAppointmentSlots(as);
      setAppointments(ap);
      setPermissions(pm);
      setAuditLogs(lg);
    } catch (err) {
      console.error('Error loading data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    generateAnonymousHash().then(hash => setAnonymousHash(hash));
  }, [activeTab]);

  // Current selected school & diagnosis
  const currentSchool = useMemo(() => {
    return schools.find(s => s.id === selectedSchoolId) || schools[0] || {
      id: 'emp-default',
      name: 'Organização Padrão',
      city: 'São Paulo',
      state: 'SP',
      totalEmployees: 100,
      createdAt: new Date().toISOString()
    };
  }, [schools, selectedSchoolId]);

  const currentDiagnosis = useMemo(() => {
    return diagnoses.find(d => d.schoolId === currentSchool?.id) || diagnoses[0];
  }, [diagnoses, currentSchool]);

  const currentForm = useMemo(() => {
    if (surveySector === 'Operacional') {
      return forms.find(f => f.id === 'form-copsoq-operacional') || forms[0];
    }
    if (surveySector === 'Administrativo') {
      return forms.find(f => f.id === 'form-copsoq-admin') || forms[1] || forms[0];
    }
    return forms.find(f => f.id === 'form-copsoq-gestao') || forms[2] || forms[0];
  }, [forms, surveySector]);

  // Handle survey submit
  const handleSubmitSurvey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentForm || !currentForm.questions) return;

    const unanswered = currentForm.questions.filter(q => !surveyAnswers[q.id]);
    if (unanswered.length > 0) {
      alert(`Por favor, responda todas as questões antes de enviar. Faltam ${unanswered.length} perguntas.`);
      return;
    }

    const domains: Record<string, { total: number; count: number }> = {
      exigencias: { total: 0, count: 0 },
      ritmo: { total: 0, count: 0 },
      apoio: { total: 0, count: 0 },
      reconhecimento: { total: 0, count: 0 },
      assedio: { total: 0, count: 0 },
      saude: { total: 0, count: 0 }
    };

    currentForm.questions.forEach(q => {
      const val = surveyAnswers[q.id] || 3;
      if (domains[q.domain]) {
        domains[q.domain].total += val;
        domains[q.domain].count += 1;
      }
    });

    const getScore = (domainKey: string) => {
      const d = domains[domainKey];
      if (!d || d.count === 0) return 50;
      return Math.round(((d.total / d.count - 1) / 4) * 100);
    };

    const exigencias = getScore('exigencias');
    const ritmo = getScore('ritmo');
    const apoio = getScore('apoio');
    const reconhecimento = getScore('reconhecimento');
    const assedio = getScore('assedio');
    const saude = getScore('saude');

    const avgRisk = Math.round((exigencias + ritmo + (100 - apoio) + (100 - reconhecimento) + assedio + saude) / 6);
    let overallRisk: 'baixo' | 'moderado' | 'alto' | 'critico' = 'baixo';
    if (avgRisk > 75) overallRisk = 'critico';
    else if (avgRisk > 55) overallRisk = 'alto';
    else if (avgRisk > 35) overallRisk = 'moderado';

    const scores: SurveyScores = {
      exigencias,
      ritmo,
      apoio,
      reconhecimento,
      assedio,
      saude,
      overallRisk
    };

    const newResponse: Response = {
      id: `resp-${Date.now()}`,
      formId: currentForm.id,
      formTitle: currentForm.title,
      segment: surveySector,
      sector: surveySector,
      roleCategory: surveyRole,
      tenure: surveyTenure,
      submittedAt: new Date().toISOString(),
      anonymousHash: anonymousHash,
      answers: surveyAnswers,
      scores
    };

    await DataService.submitResponse(newResponse);
    setResponses(prev => [newResponse, ...prev]);
    setSurveySubmitted(true);
  };

  // Add School
  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchool.name || !newSchool.city) {
      alert('Nome e Cidade são obrigatórios.');
      return;
    }

    const school: School = {
      id: `emp-${Date.now()}`,
      name: newSchool.name,
      cnpj: newSchool.cnpj || '00.000.000/0001-00',
      cnae: newSchool.cnae || 'CNAE Geral',
      riskDegree: Number(newSchool.riskDegree) || 3,
      city: newSchool.city,
      state: newSchool.state,
      totalEmployees: Number(newSchool.totalEmployees) || 50,
      createdAt: new Date().toISOString()
    };

    await DataService.saveSchool(school);
    setSchools(prev => [school, ...prev]);
    setSelectedSchoolId(school.id);
    setShowNewSchoolModal(false);
  };

  // Export PDF with full GRO and 5W2H
  const handleDownloadPdf = () => {
    if (!currentSchool) return;
    generatePgrPdfReport(currentSchool, currentDiagnosis, responses, interventions, riskInventory);
  };

  // Metrics
  const metrics = useMemo(() => {
    const totalResponses = responses.length;
    const totalEmployees = currentSchool?.totalEmployees || 100;
    const participationRate = Math.min(100, Math.round((totalResponses / totalEmployees) * 100));

    let sumExigencias = 0;
    let sumRitmo = 0;
    let sumApoio = 0;
    let sumReconhecimento = 0;
    let sumAssedio = 0;
    let sumSaude = 0;

    responses.forEach(r => {
      if (r.scores) {
        sumExigencias += r.scores.exigencias;
        sumRitmo += r.scores.ritmo;
        sumApoio += r.scores.apoio;
        sumReconhecimento += r.scores.reconhecimento;
        sumAssedio += r.scores.assedio;
        sumSaude += r.scores.saude;
      }
    });

    const count = totalResponses || 1;
    const avgExigencias = Math.round(sumExigencias / count);
    const avgRitmo = Math.round(sumRitmo / count);
    const avgApoio = Math.round(sumApoio / count);
    const avgReconhecimento = Math.round(sumReconhecimento / count);
    const avgAssedio = Math.round(sumAssedio / count);
    const avgSaude = Math.round(sumSaude / count);

    const irp = Math.round(
      (avgExigencias + avgRitmo + (100 - avgApoio) + (100 - avgReconhecimento) + avgAssedio + avgSaude) / 6
    );

    let riskBadgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    let riskBadgeText = 'Risco Baixo (Controlado)';
    if (irp > 70) {
      riskBadgeColor = 'text-rose-700 bg-rose-50 border-rose-200';
      riskBadgeText = 'Risco Crítico (Ação Imediata)';
    } else if (irp > 50) {
      riskBadgeColor = 'text-amber-800 bg-amber-50 border-amber-200';
      riskBadgeText = 'Risco Alto (Atenção)';
    } else if (irp > 30) {
      riskBadgeColor = 'text-yellow-800 bg-yellow-50 border-yellow-200';
      riskBadgeText = 'Risco Moderado';
    }

    return {
      totalResponses,
      participationRate,
      irp,
      riskBadgeColor,
      riskBadgeText,
      avgExigencias,
      avgRitmo,
      avgApoio,
      avgReconhecimento,
      avgAssedio,
      avgSaude
    };
  }, [responses, currentSchool]);

  const radarData = useMemo(() => {
    return [
      { subject: 'Exigências Mentais', value: metrics.avgExigencias || 75, fullMark: 100 },
      { subject: 'Ritmo Acelerado', value: metrics.avgRitmo || 82, fullMark: 100 },
      { subject: 'Apoio da Chefia', value: metrics.avgApoio || 60, fullMark: 100 },
      { subject: 'Reconhecimento', value: metrics.avgReconhecimento || 55, fullMark: 100 },
      { subject: 'Relações / Assédio', value: metrics.avgAssedio || 40, fullMark: 100 },
      { subject: 'Sintomas de Burnout', value: metrics.avgSaude || 70, fullMark: 100 }
    ];
  }, [metrics]);

  const sectorData = useMemo(() => {
    const sectors: Record<string, { total: number; sum: number }> = {
      Operacional: { total: 0, sum: 0 },
      Administrativo: { total: 0, sum: 0 },
      'Gestão e Liderança': { total: 0, sum: 0 }
    };

    responses.forEach(r => {
      const s = r.sector || 'Operacional';
      if (!sectors[s]) sectors[s] = { total: 0, sum: 0 };
      sectors[s].total += 1;
      const score = r.scores ? r.scores.saude : 50;
      sectors[s].sum += score;
    });

    return Object.entries(sectors).map(([name, data]) => ({
      name,
      respostas: data.total,
      riscoMedio: data.total > 0 ? Math.round(data.sum / data.total) : 60
    }));
  }, [responses]);

  const timelineData = [
    { mes: 'Out/25', atestados: 24, absenteismo: 3.8 },
    { mes: 'Nov/25', atestados: 29, absenteismo: 4.1 },
    { mes: 'Dez/25', atestados: 38, absenteismo: 5.2 },
    { mes: 'Jan/26', atestados: 32, absenteismo: 4.5 },
    { mes: 'Fev/26', atestados: 45, absenteismo: 5.8 },
    { mes: 'Mar/26', atestados: 34, absenteismo: 4.8 }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-700">
        <RefreshCw className="w-8 h-8 animate-spin text-teal-600 mb-4" />
        <p className="text-sm font-medium">Carregando dados da plataforma PsicoSafe NR-1...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Top Navbar */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shadow-md shadow-teal-600/20 text-white font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-slate-900">PsicoSafe NR-1</span>
                <span className="text-[11px] uppercase font-mono px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200 font-semibold">
                  Portaria MTE nº 1.419 / GRO
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Gestão e Inventário de Riscos Psicossociais em Conformidade com a NR-1 e LGPD
              </p>
            </div>
          </div>

          {/* Org Selector & Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Organization Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
              <Building2 className="w-3.5 h-3.5 text-teal-600" />
              <select
                value={selectedSchoolId}
                onChange={e => setSelectedSchoolId(e.target.value)}
                className="bg-transparent text-slate-800 font-medium outline-none cursor-pointer max-w-[200px] truncate"
              >
                {schools.map(s => (
                  <option key={s.id} value={s.id} className="bg-white text-slate-900">
                    {s.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowNewSchoolModal(true)}
                title="Cadastrar Nova Empresa"
                className="hover:text-teal-700 ml-1 cursor-pointer text-slate-500"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Role Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setUserRole('admin')}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                  userRole === 'admin' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => setUserRole('sst')}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                  userRole === 'sst' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Eng. SST
              </button>
              <button
                onClick={() => setUserRole('rh')}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                  userRole === 'rh' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                RH / Psicólogo
              </button>
              <button
                onClick={() => {
                  setUserRole('colaborador');
                  setActiveTab('survey');
                }}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                  userRole === 'colaborador' ? 'bg-white text-teal-700 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Colaborador
              </button>
            </div>

            {/* Export PDF */}
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Laudo PGR (PDF)</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation (Todas as abas) */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto border-t border-slate-200 pt-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'dashboard'
                ? 'border-teal-600 text-teal-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4 text-teal-600" />
            <span>Dashboard NR-1</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'inventory'
                ? 'border-teal-600 text-teal-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Inventário GRO (1.5.7)</span>
          </button>

          <button
            onClick={() => setActiveTab('pgr')}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'pgr'
                ? 'border-teal-600 text-teal-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardCheck className="w-4 h-4 text-indigo-600" />
            <span>Plano 5W2H PGR</span>
          </button>

          <button
            onClick={() => setActiveTab('survey')}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'survey'
                ? 'border-teal-600 text-teal-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Portal Anônimo LGPD</span>
          </button>

          <button
            onClick={() => setActiveTab('forms')}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'forms'
                ? 'border-teal-600 text-teal-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-cyan-600" />
            <span>Questionários (.docx)</span>
          </button>

          <button
            onClick={() => setActiveTab('employees')}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'employees'
                ? 'border-teal-600 text-teal-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>Colaboradores & Adesão</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnosis')}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'diagnosis'
                ? 'border-teal-600 text-teal-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <span>Epidemiologia / PCMSO</span>
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'support'
                ? 'border-teal-600 text-teal-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-pink-600" />
            <span>Acolhimento Psicológico</span>
          </button>

          <button
            onClick={() => setActiveTab('permissions')}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'permissions'
                ? 'border-teal-600 text-teal-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4 text-purple-600" />
            <span>Permissões RBAC</span>
          </button>

          <button
            onClick={() => setActiveTab('cloud')}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'cloud'
                ? 'border-teal-600 text-teal-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cloud className="w-4 h-4 text-teal-600" />
            <span>Nuvem & Backup</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'audit'
                ? 'border-teal-600 text-teal-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span>Auditoria</span>
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-6">
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Índice Geral de Risco (IRP)</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${metrics.riskBadgeColor}`}>
                    {metrics.riskBadgeText}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 font-mono">{metrics.irp}</span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Média ponderada das 6 dimensões psicossociais
                </p>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Participação na Pesquisa</span>
                  <Users className="w-4 h-4 text-teal-600" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 font-mono">{metrics.totalResponses}</span>
                  <span className="text-xs text-slate-500">de {currentSchool?.totalEmployees} colaboradores</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                  <div className="bg-teal-600 h-full rounded-full transition-all" style={{ width: `${metrics.participationRate}%` }} />
                </div>
                <span className="text-[11px] text-slate-500 mt-1.5 block font-medium">{metrics.participationRate}% de adesão amostral</span>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Taxa de Absenteísmo Global</span>
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 font-mono">
                    {currentDiagnosis?.absenteeismRate || 4.8}%
                  </span>
                  <span className="text-xs text-slate-500">último trimestre</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {currentDiagnosis?.medicalCertificatesCount || 42} atestados médicos registrados
                </p>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Planos de Ação PGR (NR-1.5)</span>
                  <ClipboardCheck className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 font-mono">
                    {interventions.filter(i => i.status === 'Em Andamento').length}
                  </span>
                  <span className="text-xs text-slate-500">em execução ({interventions.length} total)</span>
                </div>
                <p className="text-xs text-emerald-700 mt-1 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Conforme Portaria MTE nº 1.419
                </p>
              </div>
            </div>

            {/* Matriz 5x5 e Radar Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Matriz 5x5 */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-teal-600" />
                      Matriz de Riscos Psicossociais (NR-1.5.4)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Cruzamento de Probabilidade (Frequência) x Severidade (Impacto à Saúde Mental)
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-600 font-mono bg-slate-100 px-2 py-1 rounded border border-slate-200 font-semibold">
                    Graduação GRO
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="grid grid-cols-6 gap-1.5 text-center font-mono text-[10px] text-slate-600 font-semibold">
                    <span className="text-left text-slate-500">Prob.\Sev.</span>
                    <span>1 (Leve)</span>
                    <span>2 (Menor)</span>
                    <span>3 (Médio)</span>
                    <span>4 (Grave)</span>
                    <span>5 (Crítico)</span>
                  </div>

                  <div className="grid grid-cols-6 gap-1.5 h-9 text-[11px] font-mono">
                    <span className="flex items-center text-slate-500 text-[10px] font-sans font-medium truncate">5 (Diário)</span>
                    <div className="bg-yellow-50 border border-yellow-200 flex items-center justify-center text-yellow-900 font-medium rounded">Mod</div>
                    <div className="bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 font-semibold rounded">Alto</div>
                    <div className="bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-900 font-bold rounded">Crítico (1)</div>
                    <div className="bg-rose-200 border border-rose-400 flex items-center justify-center text-rose-950 font-bold rounded">Crítico (2)</div>
                    <div className="bg-rose-300 border border-rose-500 flex items-center justify-center text-rose-950 font-extrabold rounded">Crítico</div>
                  </div>

                  <div className="grid grid-cols-6 gap-1.5 h-9 text-[11px] font-mono">
                    <span className="flex items-center text-slate-500 text-[10px] font-sans font-medium truncate">4 (Frequente)</span>
                    <div className="bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 font-medium rounded">Tol</div>
                    <div className="bg-yellow-50 border border-yellow-200 flex items-center justify-center text-yellow-900 font-medium rounded">Mod</div>
                    <div className="bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 font-semibold rounded">Alto (2)</div>
                    <div className="bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-900 font-bold rounded">Crítico</div>
                    <div className="bg-rose-200 border border-rose-400 flex items-center justify-center text-rose-950 font-bold rounded">Crítico</div>
                  </div>

                  <div className="grid grid-cols-6 gap-1.5 h-9 text-[11px] font-mono">
                    <span className="flex items-center text-slate-500 text-[10px] font-sans font-medium truncate">3 (Ocasional)</span>
                    <div className="bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 font-medium rounded">Triv</div>
                    <div className="bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 font-medium rounded">Tol</div>
                    <div className="bg-yellow-50 border border-yellow-200 flex items-center justify-center text-yellow-900 font-medium rounded">Mod (3)</div>
                    <div className="bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 font-semibold rounded">Alto</div>
                    <div className="bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-900 font-bold rounded">Crítico</div>
                  </div>

                  <div className="grid grid-cols-6 gap-1.5 h-9 text-[11px] font-mono">
                    <span className="flex items-center text-slate-500 text-[10px] font-sans font-medium truncate">2 (Raro)</span>
                    <div className="bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 font-medium rounded">Triv</div>
                    <div className="bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 font-medium rounded">Triv</div>
                    <div className="bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 font-medium rounded">Tol</div>
                    <div className="bg-yellow-50 border border-yellow-200 flex items-center justify-center text-yellow-900 font-medium rounded">Mod</div>
                    <div className="bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 font-semibold rounded">Alto</div>
                  </div>

                  <div className="grid grid-cols-6 gap-1.5 h-9 text-[11px] font-mono">
                    <span className="flex items-center text-slate-500 text-[10px] font-sans font-medium truncate">1 (Improvável)</span>
                    <div className="bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 font-medium rounded">Triv</div>
                    <div className="bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 font-medium rounded">Triv</div>
                    <div className="bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 font-medium rounded">Triv</div>
                    <div className="bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 font-medium rounded">Tol</div>
                    <div className="bg-yellow-50 border border-yellow-200 flex items-center justify-center text-yellow-900 font-medium rounded">Mod</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-200 gap-2">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Trivial/Tolerável</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block" /> Moderado</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Alto</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Crítico (Ação PGR)</span>
                </div>
              </div>

              {/* Radar Chart */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-teal-600" />
                      Dimensões Psicossociais (COPSOQ II-Br)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Média padronizada (0 a 100) obtida das respostas anônimas
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-semibold">
                    Amostra: {metrics.totalResponses}
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                      <PolarGrid stroke="#cbd5e1" />
                      <PolarAngleAxis dataKey="subject" stroke="#475569" tick={{ fill: '#334155', fontSize: 10, fontWeight: 500 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" />
                      <Radar name="Fator de Risco" dataKey="value" stroke="#0d9488" fill="#0d9488" fillOpacity={0.3} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', fontSize: '12px' }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Setores e Linha Temporal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-teal-600" />
                  Nível Médio de Estresse / Sobrecarga por Setor
                </h3>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sectorData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#475569', fontSize: 11 }} />
                      <YAxis stroke="#64748b" domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', fontSize: '12px' }}
                      />
                      <Bar dataKey="riscoMedio" fill="#e11d48" name="Score de Estresse (0-100)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-600" />
                  Evolução de Atestados Médicos e Absenteísmo
                </h3>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="mes" stroke="#64748b" tick={{ fill: '#475569', fontSize: 11 }} />
                      <YAxis stroke="#64748b" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', fontSize: '12px' }}
                      />
                      <Line type="monotone" dataKey="atestados" stroke="#0284c7" strokeWidth={2.5} name="Total Atestados" />
                      <Line type="monotone" dataKey="absenteismo" stroke="#d97706" strokeWidth={2.5} name="Taxa Absenteísmo (%)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INVENTÁRIO GRO (NR-1.5.7) */}
        {activeTab === 'inventory' && (
          <RiskInventoryTab
            inventory={riskInventory}
            onSaveItem={async item => {
              await DataService.saveRiskInventoryItem(item);
              setRiskInventory(prev => [item, ...prev.filter(i => i.id !== item.id)]);
            }}
            onDeleteItem={async id => {
              await DataService.deleteRiskInventoryItem(id);
              setRiskInventory(prev => prev.filter(i => i.id !== id));
            }}
          />
        )}

        {/* TAB 3: PLANO 5W2H PGR */}
        {activeTab === 'pgr' && (
          <PgrPlanTab
            interventions={interventions}
            currentSchool={currentSchool}
            onSaveIntervention={async item => {
              await DataService.saveIntervention(item);
              setInterventions(prev => [item, ...prev.filter(i => i.id !== item.id)]);
            }}
            onDeleteIntervention={async id => {
              await DataService.deleteIntervention(id);
              setInterventions(prev => prev.filter(i => i.id !== id));
            }}
          />
        )}

        {/* TAB 4: PORTAL ANÔNIMO LGPD */}
        {activeTab === 'survey' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-emerald-600 rounded-lg text-white mt-0.5">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                    Protocolo de Anonimato e Proteção de Dados (LGPD)
                  </h3>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Sua participação é <strong>100% anônima e confidencial</strong>, conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018) e normas do CFP. Seu nome, e-mail e matrícula <strong>NÃO</strong> são solicitados nem vinculados a estas respostas.
                  </p>
                  <div className="flex items-center gap-2 pt-2 text-[11px] font-mono text-emerald-800">
                    <span>Hash Criptográfico de Sessão:</span>
                    <code className="bg-white px-2 py-0.5 rounded border border-emerald-300 font-bold text-emerald-900">
                      {anonymousHash || 'Gerando hash SHA-256...'}
                    </code>
                  </div>
                </div>
              </div>
            </div>

            {surveySubmitted ? (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-4 shadow-sm">
                <div className="w-14 h-14 bg-emerald-100 border border-emerald-200 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">Resposta Registrada com Sucesso!</h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Muito obrigado por contribuir para um ambiente de trabalho mais saudável e seguro. Suas respostas foram consolidadas de forma anônima no banco de dados do PGR (NR-1).
                </p>
                <div className="text-xs font-mono text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 inline-block font-semibold">
                  Comprovante de Envio: {anonymousHash}
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSurveySubmitted(false);
                      setSurveyAnswers({});
                      generateAnonymousHash().then(setAnonymousHash);
                    }}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white cursor-pointer shadow-xs"
                  >
                    Responder Novamente (Outro Colaborador)
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitSurvey} className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    {currentForm?.title || 'Questionário Psicossocial Ocupacional'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {currentForm?.description || 'Responda com sinceridade. Suas informações apoiam o plano de prevenção da empresa.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <label className="text-slate-700 block font-semibold mb-1">Seu Setor de Atuação:</label>
                    <select
                      value={surveySector}
                      onChange={e => setSurveySector(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 font-medium"
                    >
                      <option value="Operacional">Operacional / Produção</option>
                      <option value="Administrativo">Administrativo / Escritório</option>
                      <option value="Gestão e Liderança">Gestão e Liderança</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-700 block font-semibold mb-1">Categoria de Função:</label>
                    <select
                      value={surveyRole}
                      onChange={e => setSurveyRole(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 font-medium"
                    >
                      <option value="Operador / Técnico">Operador / Técnico</option>
                      <option value="Analista / Administrativo">Analista / Administrativo</option>
                      <option value="Atendimento / Suporte">Atendimento / Suporte</option>
                      <option value="Supervisão / Gerência">Supervisão / Gerência</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-700 block font-semibold mb-1">Tempo na Organização:</label>
                    <select
                      value={surveyTenure}
                      onChange={e => setSurveyTenure(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 font-medium"
                    >
                      <option value="Menos de 1 ano">Menos de 1 ano</option>
                      <option value="1 a 3 anos">1 a 3 anos</option>
                      <option value="Mais de 3 anos">Mais de 3 anos</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-5 pt-2">
                  {currentForm?.questions?.map((q, qIndex) => (
                    <div key={q.id} className="p-4 sm:p-5 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-xs font-bold text-teal-800 uppercase tracking-wide">
                          {qIndex + 1}. {q.domainLabel}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">Obrigatória</span>
                      </div>

                      <p className="text-sm text-slate-800 font-medium leading-relaxed">{q.text}</p>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                        {q.options.map(opt => {
                          const isSelected = surveyAnswers[q.id] === opt.value;
                          return (
                            <button
                              type="button"
                              key={opt.label}
                              onClick={() => setSurveyAnswers(prev => ({ ...prev, [q.id]: opt.value }))}
                              className={`p-2.5 rounded-lg border text-xs text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                                isSelected
                                  ? 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs'
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              <span>{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 gap-3">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>Transmissão segura protegida por SSL/TLS e anonimato.</span>
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Enviar Resposta Anônima</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 5: QUESTIONÁRIOS (.DOCX) */}
        {activeTab === 'forms' && (
          <FormsTab
            forms={forms}
            onSaveForm={async form => {
              await DataService.saveForm(form);
              setForms(prev => prev.map(f => f.id === form.id ? form : f));
            }}
          />
        )}

        {/* TAB 6: COLABORADORES & ADESÃO */}
        {activeTab === 'employees' && (
          <EmployeesTab
            employees={employees}
            currentSchool={currentSchool}
            onSaveEmployee={async emp => {
              await DataService.saveEmployee(emp);
              setEmployees(prev => [emp, ...prev.filter(e => e.id !== emp.id)]);
            }}
            onDeleteEmployee={async id => {
              await DataService.deleteEmployee(id);
              setEmployees(prev => prev.filter(e => e.id !== id));
            }}
          />
        )}

        {/* TAB 7: DIAGNÓSTICO EPIDEMIOLÓGICO */}
        {activeTab === 'diagnosis' && (
          <DiagnosisTab
            diagnosis={currentDiagnosis}
            currentSchool={currentSchool}
            onSaveDiagnosis={async diag => {
              await DataService.saveDiagnosis(diag);
              setDiagnoses(prev => [diag, ...prev.filter(d => d.id !== diag.id)]);
            }}
          />
        )}

        {/* TAB 8: ACOLHIMENTO PSICOLÓGICO */}
        {activeTab === 'support' && (
          <SupportTab
            appointments={appointments}
            slots={appointmentSlots}
            currentSchool={currentSchool}
            anonymousHash={anonymousHash}
            onBookAppointment={async item => {
              await DataService.bookAppointment(item);
              setAppointments(prev => [item, ...prev]);
            }}
          />
        )}

        {/* TAB 9: PERMISSÕES RBAC */}
        {activeTab === 'permissions' && (
          <PermissionsTab
            permissions={permissions}
            onSavePermission={async perm => {
              await DataService.saveRolePermission(perm);
              setPermissions(prev => prev.map(p => p.id === perm.id ? perm : p));
            }}
          />
        )}

        {/* TAB 10: NUVEM & BACKUP */}
        {activeTab === 'cloud' && (
          <CloudSyncTab onRefreshData={loadAll} />
        )}

        {/* TAB 11: AUDITORIA */}
        {activeTab === 'audit' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-teal-600" />
                  Trilha de Auditoria e Conformidade NR-1 / LGPD
                </h3>
                <p className="text-xs text-slate-500">
                  Registro imutável de logs para verificação de auditores fiscais do trabalho (AFT) e comprovação de anonimato.
                </p>
              </div>
              <span className="text-xs font-mono text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200 font-semibold">
                {auditLogs.length} Registros Auditados
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {auditLogs.map(log => (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-teal-800">{log.action}</span>
                      <span className="text-slate-500 font-medium">· {log.userRole}</span>
                    </div>
                    <p className="text-slate-700 text-xs">
                      {log.details}
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL: NOVA EMPRESA */}
      {showNewSchoolModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Cadastrar Organização / Estabelecimento</h3>
            <form onSubmit={handleCreateSchool} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 block font-semibold mb-1">Razão Social:</label>
                <input
                  type="text"
                  required
                  value={newSchool.name}
                  onChange={e => setNewSchool({ ...newSchool, name: e.target.value })}
                  placeholder="Ex: Indústria Paulista de Alimentos S.A."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-700 block font-semibold mb-1">CNPJ:</label>
                  <input
                    type="text"
                    value={newSchool.cnpj}
                    onChange={e => setNewSchool({ ...newSchool, cnpj: e.target.value })}
                    placeholder="00.000.000/0001-00"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block font-semibold mb-1">Grau de Risco (NR-4):</label>
                  <select
                    value={newSchool.riskDegree}
                    onChange={e => setNewSchool({ ...newSchool, riskDegree: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 outline-none font-medium"
                  >
                    <option value={1}>Grau 1</option>
                    <option value={2}>Grau 2</option>
                    <option value={3}>Grau 3</option>
                    <option value={4}>Grau 4</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 block font-semibold mb-1">Atividade Econômica / CNAE:</label>
                <input
                  type="text"
                  value={newSchool.cnae}
                  onChange={e => setNewSchool({ ...newSchool, cnae: e.target.value })}
                  placeholder="Ex: 4930-2/02 - Transporte Rodoviário"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-700 block font-semibold mb-1">Cidade:</label>
                  <input
                    type="text"
                    required
                    value={newSchool.city}
                    onChange={e => setNewSchool({ ...newSchool, city: e.target.value })}
                    placeholder="Ex: São Paulo"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block font-semibold mb-1">UF:</label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={newSchool.state}
                    onChange={e => setNewSchool({ ...newSchool, state: e.target.value.toUpperCase() })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 font-mono uppercase outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 block font-semibold mb-1">Total de Colaboradores:</label>
                <input
                  type="number"
                  min={1}
                  value={newSchool.totalEmployees}
                  onChange={e => setNewSchool({ ...newSchool, totalEmployees: Number(e.target.value) })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 font-mono outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewSchoolModal(false)}
                  className="px-3.5 py-2 rounded-lg text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer shadow-xs"
                >
                  Salvar Organização
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-xs text-slate-500 text-center shadow-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>PsicoSafe NR-1 · Gestão Integral de Riscos Psicossociais em Conformidade com a Portaria MTE nº 1.419</span>
          <div className="flex items-center gap-3">
            <span>COPSOQ II-Br</span>
            <span aria-hidden="true">·</span>
            <span>HSE-IT</span>
            <span aria-hidden="true">·</span>
            <span>LGPD Criptografada</span>
            <span aria-hidden="true">·</span>
            <span>PGR 5W2H</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
