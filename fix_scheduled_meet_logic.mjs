import fs from 'fs';

const filePath = './src/index-lkSxDUTb.js';
let code = fs.readFileSync(filePath, 'utf8');

console.log('Original size of index-lkSxDUTb.js:', code.length);

// 1. Remover o window.open automático na confirmação do agendamento
const oldOpenInQe = `if(nt.success&&nt.appointment){Y({appointment:nt.appointment,bookingUrl:nt.bookingUrl}),h(Ct=>Ct.map(Je=>Je.id===R.id?{...Je,status:"booked"}:Je)),g(Ct=>[nt.appointment,...Ct]);const at=nt.bookingUrl||R.bookingUrl;if(at)try{window.open(at,"_blank","noopener,noreferrer")}catch(Ct){console.warn("Popup bloqueado pelo navegador, link disponibilizado na tela:",Ct)}}`;
const newQeSuccess = `if(nt.success&&nt.appointment){Y({appointment:nt.appointment,bookingUrl:nt.bookingUrl}),h(Ct=>Ct.map(Je=>Je.id===R.id?{...Je,status:"booked"}:Je)),g(Ct=>[nt.appointment,...Ct]);}`;

if (code.includes(oldOpenInQe)) {
  code = code.replace(oldOpenInQe, newQeSuccess);
  console.log('1. Removed automatic window.open from appointment booking (Qe)!');
} else {
  console.warn('1. Warning: oldOpenInQe not found in code');
}

// 2. Atualizar título e descrição no modal de sucesso
const oldSuccessTitle = `o.jsx("h3",{className:"text-lg sm:text-xl font-black text-slate-900",children:"Atendimento Agendado com Sucesso!"}),o.jsx("p",{className:"text-xs sm:text-sm text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed",children:"O link para o atendimento foi gerado e o lembrete para 10 minutos antes foi configurado com sucesso."})`;
const newSuccessTitle = `o.jsx("h3",{className:"text-lg sm:text-xl font-black text-slate-900",children:"Reunião Agendada com Sucesso!"}),o.jsx("p",{className:"text-xs sm:text-sm text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed",children:"Sua reunião foi programada na Google Agenda para a data e hora estipuladas conforme a disponibilidade (não é uma reunião instantânea)."})`;

if (code.includes(oldSuccessTitle)) {
  code = code.replace(oldSuccessTitle, newSuccessTitle);
  console.log('2. Updated modal success title & description!');
} else {
  console.warn('2. Warning: oldSuccessTitle not found');
}

// 3. Atualizar botões do modal de sucesso: priorizar Adicionar à Google Agenda com Meet
const oldSuccessButtons = `o.jsxs("a",{href:Z.bookingUrl,target:"_blank",rel:"noopener noreferrer",className:"w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors min-h-[44px]",children:[o.jsx("span",{children:"Acessar Link do Atendimento"}),o.jsx(ql,{className:"w-4 h-4"})]}),o.jsxs("a",{href:Xt(Z.appointment),target:"_blank",rel:"noopener noreferrer",className:"w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs sm:text-sm border border-blue-200 min-h-[44px]",children:[o.jsx(N5,{className:"w-4 h-4"}),o.jsx("span",{children:"Salvar na Google Agenda"})]})`;
const newSuccessButtons = `o.jsxs("a",{href:Xt(Z.appointment),target:"_blank",rel:"noopener noreferrer",className:"w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors min-h-[44px]",children:[o.jsx(N5,{className:"w-4 h-4"}),o.jsx("span",{children:"Salvar na Google Agenda (com Meet)"})]}),o.jsxs("a",{href:Z.bookingUrl,target:"_blank",rel:"noopener noreferrer",className:"w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm border border-slate-300 min-h-[44px]",title:"Abrir sala do Meet no dia e horário agendados",children:[o.jsx("span",{children:"Acessar no Horário Marcado"}),o.jsx(ql,{className:"w-4 h-4"})]})`;

if (code.includes(oldSuccessButtons)) {
  code = code.replace(oldSuccessButtons, newSuccessButtons);
  console.log('3. Updated modal buttons to prioritize scheduled Google Calendar & Meet!');
} else {
  console.warn('3. Warning: oldSuccessButtons not found');
}

// 4. Atualizar textos de "aberto instantaneamente" para "reunião agendada na data/hora"
code = code.replaceAll(
  "Ao escolher um horário, o link exclusivo da sessão de acolhimento será aberto instantaneamente e um lembrete sonoro com notificação será enviado 10 minutos antes.",
  "Ao escolher um horário, a reunião é criada na Google Agenda para a data e hora estipuladas. Um lembrete sonoro e visual será enviado 10 minutos antes da sessão."
);

// 5. Atualizar botão de submit do agendamento
const oldSubmitBtn = `children:pe?o.jsxs(o.Fragment,{children:[o.jsx(Xl,{className:"w-4 h-4 animate-spin"}),o.jsx("span",{children:"Abrindo Link..."})]}):o.jsxs(o.Fragment,{children:[o.jsx("span",{children:"Confirmar e Abrir Link"}),o.jsx(ql,{className:"w-4 h-4"})]})`;
const newSubmitBtn = `children:pe?o.jsxs(o.Fragment,{children:[o.jsx(Xl,{className:"w-4 h-4 animate-spin"}),o.jsx("span",{children:"Agendando Reunião..."})]}):o.jsxs(o.Fragment,{children:[o.jsx(N5,{className:"w-4 h-4 text-rose-200"}),o.jsx("span",{children:"Confirmar Reunião na Data/Hora"})]})`;

if (code.includes(oldSubmitBtn)) {
  code = code.replace(oldSubmitBtn, newSubmitBtn);
  console.log('5. Updated booking submit button text to "Confirmar Reunião na Data/Hora"!');
} else {
  console.warn('5. Warning: oldSubmitBtn not found');
}

fs.writeFileSync(filePath, code);
console.log('Finished updating scheduled meeting logic! New size:', code.length);
