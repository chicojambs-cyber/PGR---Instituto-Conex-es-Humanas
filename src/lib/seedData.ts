import {
  School,
  CompanyDiagnosis,
  Form,
  Response,
  Intervention,
  AuditLog,
  SurveyQuestion,
  Employee,
  RiskInventoryItem,
  AppointmentSlot,
  RolePermission,
  Supervisor
} from '../types';

export const STANDARD_QUESTIONS: SurveyQuestion[] = [
  {
    id: 'q1',
    domain: 'exigencias',
    domainLabel: 'Exigências Quantitativas e Emocionais',
    text: 'Você sente que a quantidade de tarefas que recebe ultrapassa o tempo hábil da sua jornada?',
    options: [
      { label: 'Nunca / Raramente', value: 1 },
      { label: 'Às vezes', value: 2 },
      { label: 'Com frequência', value: 3 },
      { label: 'Muito frequentemente', value: 4 },
      { label: 'Sempre', value: 5 }
    ]
  },
  {
    id: 'q2',
    domain: 'exigencias',
    domainLabel: 'Exigências Quantitativas e Emocionais',
    text: 'Seu trabalho exige que você esconda suas emoções ou lide com situações de alta carga psicológica?',
    options: [
      { label: 'Nunca / Raramente', value: 1 },
      { label: 'Às vezes', value: 2 },
      { label: 'Com frequência', value: 3 },
      { label: 'Muito frequentemente', value: 4 },
      { label: 'Sempre', value: 5 }
    ]
  },
  {
    id: 'q3',
    domain: 'ritmo',
    domainLabel: 'Ritmo e Intensidade de Trabalho',
    text: 'Você precisa trabalhar em ritmo acelerado ou sob pressão de prazos inalcançáveis?',
    options: [
      { label: 'Nunca / Raramente', value: 1 },
      { label: 'Às vezes', value: 2 },
      { label: 'Com frequência', value: 3 },
      { label: 'Muito frequentemente', value: 4 },
      { label: 'Sempre', value: 5 }
    ]
  },
  {
    id: 'q4',
    domain: 'ritmo',
    domainLabel: 'Ritmo e Intensidade de Trabalho',
    text: 'É possível fazer pausas adequadas quando se sente mentalmente ou fisicamente esgotado(a)?',
    options: [
      { label: 'Sempre', value: 1 },
      { label: 'Com frequência', value: 2 },
      { label: 'Às vezes', value: 3 },
      { label: 'Raramente', value: 4 },
      { label: 'Nunca', value: 5 }
    ]
  },
  {
    id: 'q5',
    domain: 'apoio',
    domainLabel: 'Apoio Social e Liderança',
    text: 'Quando surgem dificuldades no trabalho, você pode contar com o suporte de seus colegas e líderes diretos?',
    options: [
      { label: 'Sempre', value: 1 },
      { label: 'Com frequência', value: 2 },
      { label: 'Às vezes', value: 3 },
      { label: 'Raramente', value: 4 },
      { label: 'Nunca', value: 5 }
    ]
  },
  {
    id: 'q6',
    domain: 'apoio',
    domainLabel: 'Apoio Social e Liderança',
    text: 'Você recebe orientações claras sobre as expectativas e responsabilidades do seu cargo?',
    options: [
      { label: 'Sempre', value: 1 },
      { label: 'Com frequência', value: 2 },
      { label: 'Às vezes', value: 3 },
      { label: 'Raramente', value: 4 },
      { label: 'Nunca', value: 5 }
    ]
  },
  {
    id: 'q7',
    domain: 'reconhecimento',
    domainLabel: 'Reconhecimento e Recompensas',
    text: 'Seu esforço e dedicação são valorizados e reconhecidos pela gestão da empresa?',
    options: [
      { label: 'Sempre', value: 1 },
      { label: 'Com frequência', value: 2 },
      { label: 'Às vezes', value: 3 },
      { label: 'Raramente', value: 4 },
      { label: 'Nunca', value: 5 }
    ]
  },
  {
    id: 'q8',
    domain: 'assedio',
    domainLabel: 'Relações Interpessoais e Conflitos',
    text: 'Nos últimos 12 meses, você presenciou ou vivenciou situações de grosseria, desrespeito ou humilhação no ambiente de trabalho?',
    options: [
      { label: 'Nunca', value: 1 },
      { label: 'Raramente', value: 2 },
      { label: 'Às vezes', value: 3 },
      { label: 'Com frequência', value: 4 },
      { label: 'Sistematicamente', value: 5 }
    ]
  },
  {
    id: 'q9',
    domain: 'saude',
    domainLabel: 'Sintomas de Estresse e Burnout',
    text: 'Com que frequência você sente cansaço físico ou esgotamento mental mesmo após o descanso no fim de semana?',
    options: [
      { label: 'Nunca / Raramente', value: 1 },
      { label: 'Às vezes', value: 2 },
      { label: 'Com frequência', value: 3 },
      { label: 'Muito frequentemente', value: 4 },
      { label: 'Constante / Diário', value: 5 }
    ]
  },
  {
    id: 'q10',
    domain: 'saude',
    domainLabel: 'Sintomas de Estresse e Burnout',
    text: 'Você sente ansiedade, taquicardia ou angústia ao pensar no dia seguinte de trabalho?',
    options: [
      { label: 'Nunca', value: 1 },
      { label: 'Raramente', value: 2 },
      { label: 'Às vezes', value: 3 },
      { label: 'Com frequência', value: 4 },
      { label: 'Sempre', value: 5 }
    ]
  }
];

export const INITIAL_SCHOOLS: School[] = [
  {
    id: 'emp-001',
    name: 'TechLog Soluções Logísticas e Corporativas S.A.',
    cnpj: '45.123.890/0001-34',
    cnae: '4930-2/02 - Transporte rodoviário de carga',
    riskDegree: 3,
    city: 'São Paulo',
    state: 'SP',
    address: 'Av. das Nações Unidas, 14200 - Pinheiros',
    totalEmployees: 340,
    technicalResponsible: 'Eng. Marcelo Albuquerque (CREA 506.182-SP)',
    hrResponsible: 'Mariana Duarte (CRP 06/98214)',
    createdAt: '2026-01-15T08:00:00.000Z',
    formOperacionalId: 'form-copsoq-operacional',
    formAdministrativoId: 'form-copsoq-admin',
    formGestaoId: 'form-copsoq-gestao'
  },
  {
    id: 'emp-002',
    name: 'Colégio e Faculdade Horizonte Integrado',
    mecCode: 'MEC-SP-98214',
    cnpj: '12.876.543/0001-90',
    cnae: '8531-7/00 - Educação superior e básica',
    riskDegree: 2,
    city: 'Campinas',
    state: 'SP',
    address: 'Rua Barão de Itapura, 900 - Guanabara',
    totalEmployees: 185,
    technicalResponsible: 'Téc. Fernando Peixoto (MTE 009843/SP)',
    hrResponsible: 'Dra. Camila Toledo (CRP 06/11204)',
    createdAt: '2026-02-01T10:00:00.000Z',
    formOperacionalId: 'form-copsoq-operacional',
    formAdministrativoId: 'form-copsoq-admin',
    formGestaoId: 'form-copsoq-gestao'
  },
  {
    id: 'emp-003',
    name: 'Indústria Metalmecânica Alvorada S.A.',
    cnpj: '67.432.109/0001-78',
    cnae: '2511-0/00 - Fabricação de estruturas metálicas',
    riskDegree: 4,
    city: 'Belo Horizonte',
    state: 'MG',
    address: 'Distrito Industrial, Galpão 4',
    totalEmployees: 520,
    technicalResponsible: 'Eng. Roberto Vasconcellos (CREA 142.990-MG)',
    hrResponsible: 'Juliana Costa',
    createdAt: '2026-02-10T14:30:00.000Z',
    formOperacionalId: 'form-copsoq-operacional',
    formAdministrativoId: 'form-copsoq-admin',
    formGestaoId: 'form-copsoq-gestao'
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-c-001',
    schoolId: 'emp-001',
    name: 'Carlos Eduardo Oliveira',
    role: 'Operador de Empilhadeira',
    sector: 'Operacional',
    shift: 'Noturno',
    admissionDate: '2023-04-10',
    status: 'Ativo',
    hasRespondedSurvey: true
  },
  {
    id: 'emp-c-002',
    schoolId: 'emp-001',
    name: 'Juliana Santos Pereira',
    role: 'Conferente de Carga e Descarga',
    sector: 'Operacional',
    shift: 'Matutino',
    admissionDate: '2022-08-15',
    status: 'Ativo',
    hasRespondedSurvey: true
  },
  {
    id: 'emp-c-003',
    schoolId: 'emp-001',
    name: 'Rodrigo Medeiros Souza',
    role: 'Motorista Carreteiro',
    sector: 'Operacional',
    shift: 'Revezamento',
    admissionDate: '2021-02-01',
    status: 'Afastado',
    hasRespondedSurvey: false
  },
  {
    id: 'emp-c-004',
    schoolId: 'emp-001',
    name: 'Beatriz Almeida Ferreira',
    role: 'Analista de Faturamento',
    sector: 'Administrativo',
    shift: 'Comercial',
    admissionDate: '2024-01-20',
    status: 'Ativo',
    hasRespondedSurvey: true
  },
  {
    id: 'emp-c-005',
    schoolId: 'emp-001',
    name: 'Lucas Martins Prado',
    role: 'Atendente de SAC / Logística Reversa',
    sector: 'Administrativo',
    shift: 'Vespertino',
    admissionDate: '2023-11-05',
    status: 'Ativo',
    hasRespondedSurvey: true
  },
  {
    id: 'emp-c-006',
    schoolId: 'emp-001',
    name: 'Vanessa Gonçalves Lima',
    role: 'Supervisora de Operações Noturnas',
    sector: 'Gestão e Liderança',
    shift: 'Noturno',
    admissionDate: '2019-06-18',
    status: 'Ativo',
    hasRespondedSurvey: true
  }
];

export const INITIAL_DIAGNOSES: CompanyDiagnosis[] = [
  {
    id: 'diag-001',
    schoolId: 'emp-001',
    schoolName: 'TechLog Soluções Logísticas e Corporativas S.A.',
    period: '2026 - 1º Trimestre',
    absenteeismRate: 4.8,
    turnoverRate: 14.2,
    frequencyRate: 18.5,
    severityRate: 142.0,
    medicalCertificatesCount: 42,
    medicalLeavesCount: 9,
    mentalHealthLeavesCount: 6,
    cidBreakdown: [
      { cid: 'F41.1', description: 'Ansiedade Generalizada', count: 18 },
      { cid: 'F32.2', description: 'Episódio Depressivo Grave', count: 11 },
      { cid: 'Z73.0', description: 'Síndrome de Burnout (Esgotamento)', count: 8 },
      { cid: 'F43.2', description: 'Transtorno de Adaptação / Estresse Agudo', count: 5 }
    ],
    hasHealthInsurance: true,
    healthInsuranceType: 'Bradesco Saúde Empresarial (Apartamento)',
    hasMentalHealthProgram: true,
    observations: 'Concentração de atestados psiquiátricos e queixas de fadiga extrema no turno noturno da expedição.',
    updatedAt: '2026-03-10T16:00:00.000Z'
  },
  {
    id: 'diag-002',
    schoolId: 'emp-002',
    schoolName: 'Colégio e Faculdade Horizonte Integrado',
    period: '2026 - 1º Trimestre',
    absenteeismRate: 3.1,
    turnoverRate: 6.5,
    frequencyRate: 8.2,
    severityRate: 45.0,
    medicalCertificatesCount: 18,
    medicalLeavesCount: 3,
    mentalHealthLeavesCount: 2,
    cidBreakdown: [
      { cid: 'F41.0', description: 'Transtorno de Pânico', count: 9 },
      { cid: 'Z73.0', description: 'Esgotamento de Professores', count: 6 },
      { cid: 'F32.1', description: 'Depressão Moderada', count: 3 }
    ],
    hasHealthInsurance: true,
    healthInsuranceType: 'Unimed Nacional',
    hasMentalHealthProgram: false,
    observations: 'Sobrecarga de correção de avaliações em plataformas virtuais gerando sintomas de insônia.',
    updatedAt: '2026-03-15T11:00:00.000Z'
  }
];

export const INITIAL_RISK_INVENTORY: RiskInventoryItem[] = [
  {
    id: 'inv-001',
    ghe: 'GHE-01 - Operações e Logística Noturna',
    sector: 'Operacional',
    dangerFactor: 'Sobrecarga Quantitativa e Trabalho em Turno Noturno',
    source: 'Demandas ininterruptas de expedição com tempo de descanso insuficiente',
    exposedWorkers: 85,
    probability: 4,
    severity: 4,
    riskScore: 16,
    riskCategory: 'Intolerável',
    existingControls: 'Pausas esporádicas não estruturadas',
    proposedControls: 'Escala 4x2 com pausas obrigatórias de 15 min a cada 2h e rotação de postos de trabalho'
  },
  {
    id: 'inv-002',
    ghe: 'GHE-02 - Atendimento ao Cliente e SAC',
    sector: 'Administrativo',
    dangerFactor: 'Assédio Moral, Cobrança Hostil de Metas e Conflitos com Usuários',
    source: 'Pressão excessiva por TMA (Tempo Médio de Atendimento) e clientes exaltados',
    exposedWorkers: 42,
    probability: 4,
    severity: 3,
    riskScore: 12,
    riskCategory: 'Substancial',
    existingControls: 'Manual de conduta institucional genérico',
    proposedControls: 'Capacitação em Comunicação Não-Violenta e revisão do algoritmo de metas do SAC'
  },
  {
    id: 'inv-003',
    ghe: 'GHE-03 - Liderança e Supervisão Operacional',
    sector: 'Gestão e Liderança',
    dangerFactor: 'Conflito de Papéis e Responsabilidade por Resultados Críticos',
    source: 'Pressão mútua entre diretoria e equipe operacional em caso de atrasos',
    exposedWorkers: 18,
    probability: 3,
    severity: 3,
    riskScore: 9,
    riskCategory: 'Moderado',
    existingControls: 'Reunião semanal de alinhamento',
    proposedControls: 'Mentoria executiva e programa de apoio emocional para lideranças'
  },
  {
    id: 'inv-004',
    ghe: 'GHE-04 - Administrativo e Financeiro',
    sector: 'Administrativo',
    dangerFactor: 'Falta de Reconhecimento e Feedback',
    source: 'Comunicação unilateral sem devolutivas sobre o desempenho individual',
    exposedWorkers: 35,
    probability: 3,
    severity: 2,
    riskScore: 6,
    riskCategory: 'Tolerável',
    existingControls: 'Avaliação de desempenho anual',
    proposedControls: 'Implementação de ciclos trimestrais de 1:1 e plano de desenvolvimento individual (PDI)'
  }
];

export const INITIAL_FORMS: Form[] = [
  {
    id: 'form-copsoq-operacional',
    title: 'Questionário Psicossocial NR-1 / COPSOQ II-Br (Operacional)',
    targetAudience: 'Operadores, Motoristas, Técnicos e Chão de Fábrica',
    description: 'Diagnóstico focado em exigências físicas e emocionais, ritmo, segurança, pausas e fadiga no ambiente produtivo.',
    sector: 'Operacional',
    version: '2.4 Validada MTE',
    questions: STANDARD_QUESTIONS
  },
  {
    id: 'form-copsoq-admin',
    title: 'Questionário Psicossocial NR-1 / COPSOQ II-Br (Administrativo)',
    targetAudience: 'Analistas, Atendimento, Financeiro, TI e RH',
    description: 'Avaliação de sobrecarga cognitiva, metas de produtividade, relações interpessoais e equilíbrio trabalho-vida.',
    sector: 'Administrativo',
    version: '2.4 Validada MTE',
    questions: STANDARD_QUESTIONS
  },
  {
    id: 'form-copsoq-gestao',
    title: 'Questionário Psicossocial NR-1 / COPSOQ II-Br (Liderança e Gestão)',
    targetAudience: 'Coordenadores, Gerentes e Diretores',
    description: 'Mapeamento de pressão por metas, responsabilidade decisória, conflito de papéis e autonomia gerencial.',
    sector: 'Gestão e Liderança',
    version: '2.4 Validada MTE',
    questions: STANDARD_QUESTIONS
  }
];

export const INITIAL_RESPONSES: Response[] = [
  {
    id: 'resp-001',
    formId: 'form-copsoq-operacional',
    formTitle: 'COPSOQ II-Br (Operacional)',
    segment: 'Operações',
    sector: 'Operacional',
    roleCategory: 'Operador de Empilhadeira',
    tenure: '1 a 3 anos',
    shift: 'Noturno',
    submittedAt: '2026-03-01T09:12:00.000Z',
    anonymousHash: 'LGPD-A49F8B129C3E0011',
    scores: {
      exigencias: 85,
      ritmo: 90,
      apoio: 45,
      reconhecimento: 40,
      assedio: 65,
      saude: 80,
      overallRisk: 'critico'
    }
  },
  {
    id: 'resp-002',
    formId: 'form-copsoq-operacional',
    formTitle: 'COPSOQ II-Br (Operacional)',
    segment: 'Operações',
    sector: 'Operacional',
    roleCategory: 'Conferente de Carga',
    tenure: 'Mais de 3 anos',
    shift: 'Matutino',
    submittedAt: '2026-03-02T10:45:00.000Z',
    anonymousHash: 'LGPD-C82D7102AB491022',
    scores: {
      exigencias: 75,
      ritmo: 80,
      apoio: 60,
      reconhecimento: 55,
      assedio: 35,
      saude: 65,
      overallRisk: 'alto'
    }
  },
  {
    id: 'resp-003',
    formId: 'form-copsoq-admin',
    formTitle: 'COPSOQ II-Br (Administrativo)',
    segment: 'Financeiro',
    sector: 'Administrativo',
    roleCategory: 'Analista Fiscal',
    tenure: 'Menos de 1 ano',
    shift: 'Comercial',
    submittedAt: '2026-03-03T14:20:00.000Z',
    anonymousHash: 'LGPD-7E90B4231FA23033',
    scores: {
      exigencias: 60,
      ritmo: 65,
      apoio: 80,
      reconhecimento: 75,
      assedio: 20,
      saude: 45,
      overallRisk: 'moderado'
    }
  },
  {
    id: 'resp-004',
    formId: 'form-copsoq-admin',
    formTitle: 'COPSOQ II-Br (Administrativo)',
    segment: 'Atendimento / SAC',
    sector: 'Administrativo',
    roleCategory: 'Operador de SAC',
    tenure: '1 a 3 anos',
    shift: 'Vespertino',
    submittedAt: '2026-03-04T16:15:00.000Z',
    anonymousHash: 'LGPD-319BC788DF41044',
    scores: {
      exigencias: 88,
      ritmo: 85,
      apoio: 50,
      reconhecimento: 35,
      assedio: 70,
      saude: 85,
      overallRisk: 'critico'
    }
  },
  {
    id: 'resp-005',
    formId: 'form-copsoq-gestao',
    formTitle: 'COPSOQ II-Br (Liderança)',
    segment: 'Supervisão',
    sector: 'Gestão e Liderança',
    roleCategory: 'Supervisor de Logística',
    tenure: 'Mais de 5 anos',
    shift: 'Noturno',
    submittedAt: '2026-03-05T11:30:00.000Z',
    anonymousHash: 'LGPD-F18A3290ED77055',
    scores: {
      exigencias: 70,
      ritmo: 75,
      apoio: 70,
      reconhecimento: 65,
      assedio: 25,
      saude: 55,
      overallRisk: 'moderado'
    }
  }
];

export const INITIAL_INTERVENTIONS: Intervention[] = [
  {
    id: 'int-001',
    schoolId: 'emp-001',
    sector: 'Operacional / Logística',
    riskLevel: 'Crítico',
    title: 'Redistribuição de Carga e Escalas do Turno Noturno',
    description: 'Implementar pausa ergonômica de 15 minutos a cada 2 horas de trabalho contínuo e revisar o limite de horas extras no setor de expedição para mitigação do estresse ocupacional e fadiga.',
    priority: 'Urgente',
    deadline: '2026-04-15',
    status: 'Em Andamento',
    responsible: 'Coordenação de SST & Gerência de Operações',
    costEstimate: 'R$ 12.000,00',
    methodology5W2H: {
      what: 'Adequação da jornada e intervalos térmicos/ergonômicos no turno noturno',
      why: 'Altos índices de insônia e atestados médicos de estresse (CID F41 e Z73)',
      where: 'Galpão Principal de Expedição e Cross-docking',
      when: 'Início imediato com conclusão em 15/04/2026',
      who: 'Eng. Marcelo Albuquerque e Coordenação de Turno',
      how: 'Automatização de esteiras de triagem e instituição formal de pausas de 15min',
      howMuch: 'R$ 12.000,00'
    },
    createdAt: '2026-03-05T10:00:00.000Z'
  },
  {
    id: 'int-002',
    schoolId: 'emp-001',
    sector: 'Administrativo / Atendimento',
    riskLevel: 'Alto',
    title: 'Programa de Prevenção ao Assédio e Comunicação Não-Violenta',
    description: 'Capacitar líderes e supervisores de atendimento ao cliente em liderança positiva, prevenção de assédio moral e gestão de conflitos interpessoais conforme a Lei 14.457/2022 (CIPA+A).',
    priority: 'Alta',
    deadline: '2026-04-30',
    status: 'Em Andamento',
    responsible: 'Recursos Humanos & Psicologia Organizacional',
    costEstimate: 'R$ 8.500,00',
    methodology5W2H: {
      what: 'Treinamento de 16 horas sobre liderança empática e prevenção ao assédio',
      why: 'Adequação à Lei 14.457/22 e redução de atritos interpessoais no SAC',
      where: 'Auditório Central e Plataforma EAD Corporativa',
      when: 'Abril de 2026',
      who: 'Psicóloga Mariana Duarte',
      how: 'Workshops práticos vivenciais com simulação de casos reais',
      howMuch: 'R$ 8.500,00'
    },
    createdAt: '2026-03-08T14:30:00.000Z'
  },
  {
    id: 'int-003',
    schoolId: 'emp-001',
    sector: 'Todos os Setores',
    riskLevel: 'Moderado',
    title: 'Implantação de Canal Confidencial de Apoio Psicológico (EAP)',
    description: 'Contratar serviço credenciado de atendimento e acolhimento psicológico telepresencial gratuito aos colaboradores e dependentes com garantia de sigilo de prontuário (CFP).',
    priority: 'Média',
    deadline: '2026-05-15',
    status: 'Pendente',
    responsible: 'Diretoria de Gente & Gestão',
    costEstimate: 'R$ 4.200,00 / mês',
    createdAt: '2026-03-12T09:00:00.000Z'
  },
  {
    id: 'int-004',
    schoolId: 'emp-001',
    sector: 'Gestão e Liderança',
    riskLevel: 'Baixo',
    title: 'Revisão e Alinhamento Periódico de Metas de Produtividade',
    description: 'Estabelecer reuniões mensais de calibragem de metas comerciais para evitar metas inatingíveis que gerem pânico e ansiedade sistêmica.',
    priority: 'Baixa',
    deadline: '2026-06-30',
    status: 'Concluído',
    responsible: 'Comitê Executivo',
    createdAt: '2026-02-20T11:15:00.000Z'
  }
];

export const INITIAL_APPOINTMENT_SLOTS: AppointmentSlot[] = [
  { id: 'slot-1', professionalName: 'Dra. Mariana Duarte (CRP 06/98214)', date: '2026-03-25', time: '09:00 - 09:50', shift: 'Manhã', isAvailable: true },
  { id: 'slot-2', professionalName: 'Dra. Mariana Duarte (CRP 06/98214)', date: '2026-03-25', time: '14:30 - 15:20', shift: 'Tarde', isAvailable: true },
  { id: 'slot-3', professionalName: 'Dr. Lucas Viana (CRP 06/104822)', date: '2026-03-26', time: '19:00 - 19:50', shift: 'Noite', isAvailable: true },
  { id: 'slot-4', professionalName: 'Dr. Lucas Viana (CRP 06/104822)', date: '2026-03-27', time: '10:00 - 10:50', shift: 'Manhã', isAvailable: true }
];

export const INITIAL_ROLE_PERMISSIONS: RolePermission[] = [
  {
    id: 'perm-admin',
    roleName: 'Administrador Geral / Diretoria',
    canViewReports: true,
    canEditPgr: true,
    canManageEmployees: true,
    canAccessAppointments: true,
    canExportPdf: true,
    canAuditLogs: true
  },
  {
    id: 'perm-sst',
    roleName: 'Engenheiro / Técnico de SST',
    canViewReports: true,
    canEditPgr: true,
    canManageEmployees: true,
    canAccessAppointments: false, // Sigilo ético
    canExportPdf: true,
    canAuditLogs: true
  },
  {
    id: 'perm-psico',
    roleName: 'Psicólogo do Trabalho / Médico do Trabalho',
    canViewReports: true,
    canEditPgr: true,
    canManageEmployees: false,
    canAccessAppointments: true,
    canExportPdf: true,
    canAuditLogs: true
  },
  {
    id: 'perm-cipa',
    roleName: 'Comissão CIPA+A (Lei 14.457/22)',
    canViewReports: true,
    canEditPgr: false,
    canManageEmployees: false,
    canAccessAppointments: false,
    canExportPdf: true,
    canAuditLogs: false
  },
  {
    id: 'perm-colab',
    roleName: 'Colaborador (Acesso Pessoal)',
    canViewReports: false,
    canEditPgr: false,
    canManageEmployees: false,
    canAccessAppointments: true, // Auto-agendamento anônimo
    canExportPdf: false,
    canAuditLogs: false
  }
];

export const INITIAL_SUPERVISORS: Supervisor[] = [
  { id: 'sup-1', schoolId: 'emp-001', name: 'Vanessa Gonçalves Lima', sector: 'Operações e Logística', email: 'vanessa.lima@techlog.com.br', phone: '(11) 98123-4567', trainedInNonViolentComm: true },
  { id: 'sup-2', schoolId: 'emp-001', name: 'Renato Silveira Pinto', sector: 'Atendimento e SAC', email: 'renato.silveira@techlog.com.br', phone: '(11) 99876-5432', trainedInNonViolentComm: true },
  { id: 'sup-3', schoolId: 'emp-001', name: 'Claudia Meirelles', sector: 'Financeiro e Controladoria', email: 'claudia.m@techlog.com.br', phone: '(11) 97654-3210', trainedInNonViolentComm: false }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    timestamp: '2026-03-24T08:30:00.000Z',
    action: 'INSPEÇÃO_DE_CONFORMIDADE_NR1',
    userEmail: 'dr.marcelo.sst@psicosafe.com.br',
    userRole: 'Engenheiro de Segurança do Trabalho',
    details: 'Auditoria do Inventário de Riscos Psicossociais realizada com sucesso. Conformidade com item 1.5.7 da NR-1 confirmada.'
  },
  {
    id: 'log-002',
    timestamp: '2026-03-22T14:10:00.000Z',
    action: 'SUBMISSAO_ANONIMA_LGPD',
    userEmail: 'ANONIMO@LGPD-HASH',
    userRole: 'Colaborador',
    details: 'Resposta criptografada recebida com hash LGPD-319BC788DF41044. Nenhum dado pessoal identificável foi armazenado.'
  },
  {
    id: 'log-003',
    timestamp: '2026-03-20T17:45:00.000Z',
    action: 'CRIACAO_PLANO_PGR',
    userEmail: 'luciana.rh@techlog.com.br',
    userRole: 'Gestor de RH',
    details: 'Plano de intervenção "Redistribuição de Carga do Turno Noturno" cadastrado e vinculado ao setor Operacional.'
  }
];
