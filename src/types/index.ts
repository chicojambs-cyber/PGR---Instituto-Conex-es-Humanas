export interface School {
  id: string;
  name: string;
  mecCode?: string;
  cnpj?: string;
  cnae?: string;
  riskDegree?: number; // Grau de risco NR-4 (1 a 4)
  city: string;
  state: string;
  address?: string;
  totalEmployees: number;
  technicalResponsible?: string;
  hrResponsible?: string;
  createdAt: string;
  formOperacionalId?: string;
  formAdministrativoId?: string;
  formGestaoId?: string;
}

export interface Employee {
  id: string;
  schoolId: string;
  name: string;
  email?: string;
  cpfMasked?: string;
  role: string;
  sector: 'Operacional' | 'Administrativo' | 'Gestão e Liderança' | 'Outro';
  shift: 'Matutino' | 'Vespertino' | 'Noturno' | 'Comercial' | 'Revezamento';
  admissionDate: string;
  status: 'Ativo' | 'Afastado' | 'Férias' | 'Desligado';
  hasRespondedSurvey?: boolean;
}

export interface CompanyDiagnosis {
  id: string;
  schoolId: string;
  schoolName: string;
  period: string;
  absenteeismRate: number; // Taxa de absenteísmo (%)
  turnoverRate: number; // Rotatividade (%)
  frequencyRate?: number; // Taxa de Frequência NBR 14280
  severityRate?: number; // Taxa de Gravidade NBR 14280
  medicalCertificatesCount: number;
  medicalLeavesCount: number; // Afastamentos > 15 dias (INSS B31/B91)
  mentalHealthLeavesCount?: number; // Afastamentos por CID-10 F / Z73
  cidBreakdown?: {
    cid: string;
    description: string;
    count: number;
  }[];
  hasHealthInsurance: boolean;
  healthInsuranceType?: string;
  hasMentalHealthProgram: boolean;
  observations?: string;
  updatedAt: string;
}

export interface SurveyQuestion {
  id: string;
  domain: 'exigencias' | 'ritmo' | 'apoio' | 'reconhecimento' | 'assedio' | 'saude';
  domainLabel: string;
  text: string;
  options: {
    label: string;
    value: number;
  }[];
}

export interface Form {
  id: string;
  title: string;
  targetAudience: string;
  description: string;
  sector: string;
  version?: string;
  questions?: SurveyQuestion[];
}

export interface SurveyScores {
  exigencias: number; // 0-100
  ritmo: number; // 0-100
  apoio: number; // 0-100
  reconhecimento: number; // 0-100
  assedio: number; // 0-100 (inverso: menor é melhor)
  saude: number; // 0-100 (inverso: menor estresse é melhor)
  overallRisk: 'baixo' | 'moderado' | 'alto' | 'critico';
}

export interface Response {
  id: string;
  formId: string;
  formTitle: string;
  segment: string;
  sector: string;
  roleCategory: string;
  tenure: string;
  shift?: string;
  submittedAt: string;
  anonymousHash: string;
  answers?: Record<string, number>;
  scores?: SurveyScores;
}

export interface Intervention {
  id: string;
  schoolId: string;
  sector: string;
  riskLevel: 'Baixo' | 'Moderado' | 'Alto' | 'Crítico';
  title: string;
  description: string;
  priority: 'Baixa' | 'Média' | 'Alta' | 'Urgente';
  deadline: string;
  status: 'Pendente' | 'Em Andamento' | 'Concluído' | 'Em Revisão';
  responsible: string;
  costEstimate?: string;
  methodology5W2H?: {
    what: string;
    why: string;
    where: string;
    when: string;
    who: string;
    how: string;
    howMuch?: string;
  };
  createdAt: string;
}

export interface RiskInventoryItem {
  id: string;
  ghe: string; // Grupo Homogêneo de Exposição
  sector: string;
  dangerFactor: string; // Fator de Risco Psicossocial
  source: string; // Fonte geradora
  exposedWorkers: number;
  probability: number; // 1 a 5
  severity: number; // 1 a 5
  riskScore: number; // prob * sev (1 a 25)
  riskCategory: 'Trivial' | 'Tolerável' | 'Moderado' | 'Substancial' | 'Intolerável';
  existingControls: string;
  proposedControls: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  userEmail: string;
  userRole: string;
  details: string;
}

export interface ScheduledAppointment {
  id: string;
  schoolId: string;
  sector: string;
  preferredDate: string;
  shift: 'Manhã' | 'Tarde' | 'Noite';
  anonymousHash: string;
  reason: string;
  professionalName?: string;
  status: 'Agendado' | 'Em Atendimento' | 'Concluído' | 'Cancelado';
  createdAt: string;
}

export interface AppointmentSlot {
  id: string;
  professionalName: string;
  date: string;
  time: string;
  shift: 'Manhã' | 'Tarde' | 'Noite';
  isAvailable: boolean;
}

export interface RolePermission {
  id: string;
  roleName: string;
  canViewReports: boolean;
  canEditPgr: boolean;
  canManageEmployees: boolean;
  canAccessAppointments: boolean;
  canExportPdf: boolean;
  canAuditLogs: boolean;
}

export interface Supervisor {
  id: string;
  schoolId: string;
  name: string;
  sector: string;
  email: string;
  phone: string;
  trainedInNonViolentComm: boolean;
}
