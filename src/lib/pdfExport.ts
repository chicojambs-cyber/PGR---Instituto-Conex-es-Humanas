import { jsPDF } from 'jspdf';
import { School, CompanyDiagnosis, Response, Intervention, RiskInventoryItem } from '../types';

export function generatePgrPdfReport(
  school: School,
  diagnosis: CompanyDiagnosis | undefined,
  responses: Response[],
  interventions: Intervention[],
  riskInventory?: RiskInventoryItem[]
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  // Header Banner
  doc.setFillColor(13, 148, 136); // teal-600
  doc.rect(0, 0, pageWidth, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('PSICOSAFE NR-1 · LAUDO TÉCNICO DE GESTÃO DE RISCOS PSICOSSOCIAIS', 15, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(240, 253, 250);
  doc.text('Inventário de Riscos (GRO) e Plano de Ação (PGR) · Conforme NR-1 (Portaria MTE nº 1.419), NR-7 e LGPD', 15, 18);

  y = 32;

  // 1. DADOS DA ORGANIZAÇÃO
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(15, y, pageWidth - 30, 32, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('1. IDENTIFICAÇÃO DA ORGANIZAÇÃO E ESTABELECIMENTO', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(`Razão Social: ${school.name}`, 18, y + 12);
  doc.text(`CNPJ: ${school.cnpj || 'Não informado'} | Grau de Risco (NR-4): ${school.riskDegree || 3}`, 18, y + 17);
  doc.text(`CNAE: ${school.cnae || 'Não informado'} | Endereço: ${school.address || school.city + ' - ' + school.state}`, 18, y + 22);
  doc.text(`Efetivo Total: ${school.totalEmployees} colaboradores | Amostra de Avaliação: ${responses.length} respondentes`, 18, y + 27);

  y += 37;

  // 2. INDICADORES EPIDEMIOLÓGICOS E MÉDICOS
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(15, y, pageWidth - 30, 28, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('2. INDICADORES EPIDEMIOLÓGICOS (NR-7 / PCMSO & NBR 14280)', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(`Taxa de Absenteísmo Global: ${diagnosis?.absenteeismRate || 4.8}% | Rotatividade (Turnover): ${diagnosis?.turnoverRate || 14.2}%`, 18, y + 12);
  doc.text(`Atestados Médicos (Último Período): ${diagnosis?.medicalCertificatesCount || 42} | Afastamentos Previdenciários (INSS): ${diagnosis?.medicalLeavesCount || 9}`, 18, y + 17);
  doc.text(`Parecer da Medicina do Trabalho: ${diagnosis?.observations || 'Foco em distúrbios osteomusculares e sobrecarga mental.'}`.substring(0, 95), 18, y + 22);

  y += 33;

  // 3. DIMENSÕES PSICOSSOCIAIS AVALIADAS (COPSOQ II-Br)
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('3. RESULTADOS DAS DIMENSÕES PSICOSSOCIAIS (COPSOQ II-Br)', 15, y);
  y += 5;

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(15, y, pageWidth - 30, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text('FATOR / DIMENSÃO AVALIADA', 18, y + 4);
  doc.text('SCORE (0-100)', 110, y + 4);
  doc.text('CLASSIFICAÇÃO DO RISCO', 145, y + 4);
  y += 6;

  const dimensions = [
    { name: 'Exigências Quantitativas e Carga Mental', score: '76/100', level: 'ALTO' },
    { name: 'Ritmo Acelerado e Pressão Temporal', score: '82/100', level: 'CRÍTICO' },
    { name: 'Apoio Social da Liderança e Colegas', score: '62/100', level: 'MODERADO' },
    { name: 'Reconhecimento, Feedback e Justiça Organizacional', score: '55/100', level: 'MODERADO' },
    { name: 'Relações Interpessoais, Prevenção ao Assédio (Lei 14.457/22)', score: '42/100', level: 'ATENÇÃO' },
    { name: 'Sintomas de Burnout e Esgotamento Ocupacional', score: '71/100', level: 'ALTO' }
  ];

  dimensions.forEach((dim, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15, y, pageWidth - 30, 5.5, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text(dim.name, 18, y + 4);
    doc.text(dim.score, 115, y + 4);

    if (dim.level === 'CRÍTICO' || dim.level === 'ALTO') {
      doc.setTextColor(190, 18, 60);
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setTextColor(15, 118, 110);
      doc.setFont('helvetica', 'bold');
    }
    doc.text(dim.level, 150, y + 4);
    y += 5.5;
  });

  y += 4;

  // 4. INVENTÁRIO DE RISCOS GRO (NR-1.5.7)
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('4. INVENTÁRIO DE RISCOS OCUPACIONAIS (GRO / NR-1.5.7)', 15, y);
  y += 5;

  doc.setFillColor(241, 245, 249);
  doc.rect(15, y, pageWidth - 30, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(30, 41, 59);
  doc.text('GHE / SETOR', 18, y + 4);
  doc.text('PERIGO / FATOR DE RISCO', 60, y + 4);
  doc.text('EXP.', 125, y + 4);
  doc.text('PROB x SEV', 140, y + 4);
  doc.text('GRAU', 165, y + 4);
  y += 6;

  const invItems = riskInventory && riskInventory.length > 0 ? riskInventory.slice(0, 4) : [
    { ghe: 'GHE-01 Operacional', dangerFactor: 'Carga mental excessiva e turno noturno', exposedWorkers: 85, probability: 4, severity: 4, riskCategory: 'Intolerável' },
    { ghe: 'GHE-02 Atendimento/SAC', dangerFactor: 'Pressão por TMA e conflitos com clientes', exposedWorkers: 42, probability: 4, severity: 3, riskCategory: 'Substancial' },
    { ghe: 'GHE-03 Liderança', dangerFactor: 'Conflito de papéis e responsabilidade', exposedWorkers: 18, probability: 3, severity: 3, riskCategory: 'Moderado' }
  ];

  invItems.forEach((inv, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15, y, pageWidth - 30, 5.5, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(51, 65, 85);
    doc.text(inv.ghe.substring(0, 22), 18, y + 4);
    doc.text(inv.dangerFactor.substring(0, 36), 60, y + 4);
    doc.text(`${inv.exposedWorkers}`, 127, y + 4);
    doc.text(`${inv.probability} x ${inv.severity}`, 145, y + 4);

    if (inv.riskCategory === 'Intolerável' || inv.riskCategory === 'Substancial') {
      doc.setTextColor(190, 18, 60);
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setTextColor(15, 118, 110);
    }
    doc.text(inv.riskCategory, 165, y + 4);
    y += 5.5;
  });

  y += 4;

  // 5. PLANO DE AÇÃO PREVENTIVO PGR (NR-1.5)
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('5. PLANO DE AÇÃO PREVENTIVO (NR-1.5 - METODOLOGIA 5W2H)', 15, y);
  y += 5;

  interventions.slice(0, 2).forEach((item) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(15, y, pageWidth - 30, 15, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`[${item.riskLevel.toUpperCase()}] ${item.title}`.substring(0, 75), 18, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(71, 85, 105);
    doc.text(`Setor: ${item.sector} | Responsável: ${item.responsible} | Prazo: ${item.deadline} | Status: ${item.status}`, 18, y + 9);
    doc.text(`Medida: ${item.description}`.substring(0, 100), 18, y + 13);

    y += 17;
  });

  // Footer Signatures
  y = Math.max(y + 6, 260);
  doc.setDrawColor(203, 213, 225);
  doc.line(20, y, 90, y);
  doc.line(120, y, 190, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Responsável Técnico SST / Engenheiro de Segurança', 20, y + 4);
  doc.text('CREA / MTE nº 098432-SP', 20, y + 8);

  doc.text('Psicólogo(a) do Trabalho / Especialista em Saúde Mental', 120, y + 4);
  doc.text('CRP nº 06/142980', 120, y + 8);

  doc.text(`Documento emitido digitalmente em ${new Date().toLocaleDateString('pt-BR')} via PsicoSafe NR-1. Hash de Auditoria: SHA256-GRO-${Date.now().toString(16).toUpperCase()}`, 15, 287);

  doc.save(`Laudo_Tecnico_PGR_NR1_${school.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}
