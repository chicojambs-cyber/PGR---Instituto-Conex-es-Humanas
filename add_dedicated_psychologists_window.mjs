import fs from 'fs';

const filePath = './src/index-lkSxDUTb.js';
let code = fs.readFileSync(filePath, 'utf8');

console.log('Original size of index-lkSxDUTb.js:', code.length);

// 1. ATUALIZAR allCards DENTRO DE BC PARA ADICIONAR O CARD "Cadastro de Psicólogos"
const cardSearch = `{id:"schools",title:"Cadastrar Empresa & Links Exclusivos"`;
const psychologistCard = `{id:"psychologists",title:"Cadastro de Psicólogos & Agendas Integradas",badge:"Google Calendar & Meet",description:"Cadastre psicólogos credenciados com sincronização automática na conta do Administrador (chicojambs@gmail.com) e acesso co-host no Meet.",icon:Yl,color:"text-indigo-600 bg-indigo-50 border-indigo-100",bgHover:"hover:border-indigo-300 hover:shadow-md"},`;

if (code.includes(cardSearch)) {
  code = code.replace(cardSearch, `${psychologistCard}${cardSearch}`);
  console.log('1. Added "Cadastro de Psicólogos" card to BC allCards!');
} else {
  console.warn('1. Warning: cardSearch not found in code');
}

// 2. ATUALIZAR ESTADO re DE JANELAS EM iL PARA INCLUIR A JANELA psychologists
const reSearch = `appointments:{id:"appointments",title:"Agendamento de Atendimentos Psicológicos & NR-1",isOpen:!1,isMinimized:!1,zIndex:5},`;
const rePsychologist = `psychologists:{id:"psychologists",title:"Cadastro de Psicólogos & Agendas Integradas",isOpen:!1,isMinimized:!1,zIndex:12},`;

if (code.includes(reSearch)) {
  code = code.replace(reSearch, `${rePsychologist}${reSearch}`);
  console.log('2. Added psychologists window state to re in iL!');
} else {
  console.warn('2. Warning: reSearch not found in code');
}

// 3. ADICIONAR BOTÃO NO CABEÇALHO PARA ACESSO DIRETO AO CADASTRO DE PSICÓLOGOS
const headerSearch = `o.jsxs("button",{onClick:()=>F("appointments"),className:"inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs sm:text-sm font-bold border border-rose-200 transition-colors cursor-pointer"`;
const headerPsychologistBtn = `o.jsxs("button",{onClick:()=>F("psychologists"),className:"inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs sm:text-sm font-bold border border-indigo-200 transition-colors cursor-pointer",title:"Cadastrar e gerenciar psicólogos com integração à Google Agenda",children:[o.jsx("span",{children:"🧠"}),o.jsx("span",{className:"hidden md:inline",children:"Cadastrar Psicólogos"}),o.jsx("span",{className:"md:hidden",children:"Psicólogos"})]}),`;

if (code.includes(headerSearch)) {
  code = code.replace(headerSearch, `${headerPsychologistBtn}${headerSearch}`);
  console.log('3. Added direct "Cadastrar Psicólogos" button to header!');
} else {
  console.warn('3. Warning: headerSearch not found in code');
}

// 4. ADICIONAR RENDERIZAÇÃO DA JANELA Fl PARA psychologists
const flSearch = `o.jsx(Fl,{id:"appointments",title:"Agendamento de Atendimentos Psicológicos & NR-1"`;
const flPsychologist = `o.jsx(Fl,{id:"psychologists",title:"Cadastro de Psicólogos & Agendas Integradas",subtitle:"Credenciamento de profissionais, sincronização automática com a conta chicojambs@gmail.com e acesso de host",icon:Yl,isOpen:re["psychologists"]?.isOpen,isMinimized:re["psychologists"]?.isMinimized,zIndex:re["psychologists"]?.zIndex,onFocus:()=>se("psychologists"),onMinimize:()=>oe("psychologists"),onClose:()=>ce("psychologists"),children:o.jsx(PsychologistsManagement,{schools:n,appointments:[],currentSlots:[],onRefreshSlots:()=>{}})}),`;

if (code.includes(flSearch)) {
  code = code.replace(flSearch, `${flPsychologist}${flSearch}`);
  console.log('4. Added dedicated Fl window rendering for psychologists!');
} else {
  console.warn('4. Warning: flSearch not found in code');
}

// 5. ATUALIZAR PsychologistsManagement PARA CARREGAR SESSÕES SE appointments ESTIVER VAZIO
const psiApptsSearch = `  const selectedPsi = psychologists.find(p => p.id === selectedPsiId) || psychologists[0];

  // Sessões atribuídas ao psicólogo selecionado
  const psiAppointments = appointments.filter(a =>`;

const psiApptsReplacement = `  const [activeAppts, setActiveAppts] = ee.useState(appointments || []);
  ee.useEffect(() => {
    if (appointments && appointments.length > 0) {
      setActiveAppts(appointments);
    } else {
      fetch('/api/appointments/scheduled')
        .then(r => r.json())
        .then(d => { if (Array.isArray(d)) setActiveAppts(d); })
        .catch(() => {});
    }
  }, [appointments]);

  const selectedPsi = psychologists.find(p => p.id === selectedPsiId) || psychologists[0];

  // Sessões atribuídas ao psicólogo selecionado
  const psiAppointments = activeAppts.filter(a =>`;

if (code.includes(psiApptsSearch)) {
  code = code.replace(psiApptsSearch, psiApptsReplacement);
  console.log('5. Added auto-fetch of activeAppts inside PsychologistsManagement!');
} else {
  console.warn('5. Warning: psiApptsSearch not found in code');
}

// Também substituir appointments. por activeAppts. em PsychologistsManagement
const admApptSearch = `appointments.slice(0, 3)`;
if (code.includes(admApptSearch)) {
  code = code.replaceAll(admApptSearch, `activeAppts.slice(0, 3)`);
  code = code.replace(`Total Compartilhadas: ", appointments.length`, `Total Compartilhadas: ", activeAppts.length`);
  code = code.replace(`appointments.length === 0 ? o.jsxs("div",`, `activeAppts.length === 0 ? o.jsxs("div",`);
  code = code.replace(`children: appointments.map(appt =>`, `children: activeAppts.map(appt =>`);
  code = code.replace(`children: [appointments.length, " sessões"]`, `children: [activeAppts.length, " sessões"]`);
  console.log('6. Replaced appointments references with activeAppts in PsychologistsManagement!');
}

fs.writeFileSync(filePath, code);
console.log('Finished updating index-lkSxDUTb.js! New size:', code.length);
