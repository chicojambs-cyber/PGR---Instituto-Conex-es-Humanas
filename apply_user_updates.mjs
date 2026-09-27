import fs from 'fs';

const filePath = './src/index-lkSxDUTb.js';
let code = fs.readFileSync(filePath, 'utf8');

console.log('Original size of index-lkSxDUTb.js:', code.length);

// =========================================================================
// 1. ATUALIZAR BOTÃO DE LOGOUT: DEVE CONSTAR APENAS O "SAIR"
// =========================================================================
const oldLogoutBtn = `o.jsx("button",{onClick:()=>{localStorage.removeItem("psicosafe_current_user");setIsLoggedIn(!1);setCurrentUser(null);},className:"px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs",title:"Sair e voltar para a Tela de Login",children:[o.jsx("span",{children:"🚪"}),"Tela de Login / Sair"]})`;
const newLogoutBtn = `o.jsx("button",{onClick:()=>{localStorage.removeItem("psicosafe_current_user");setIsLoggedIn(!1);setCurrentUser(null);},className:"px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer shadow-2xs",title:"Sair do sistema",children:"SAIR"})`;

if (code.includes(oldLogoutBtn)) {
  code = code.replace(oldLogoutBtn, newLogoutBtn);
  console.log('1. Updated logout button to display exclusively "SAIR"!');
} else {
  // Try pattern replacement if slightly different
  const logoutMatch = code.match(/o\.jsx\("button",\{onClick:\(\)=>\{localStorage\.removeItem\("psicosafe_current_user"\);setIsLoggedIn\(!1\);setCurrentUser\(null\);\},[^}]+children:(\[[^\]]+\]|"[^"]+")\}\)/);
  if (logoutMatch) {
    code = code.replace(logoutMatch[0], newLogoutBtn);
    console.log('1. Updated logout button via regex pattern!');
  } else {
    console.warn('1. Warning: Could not find exact logout button pattern.');
  }
}

// =========================================================================
// 2. RETIRAR AS INFORMAÇÕES DE HOST DA REUNIÃO NO MEET
// =========================================================================
const hostBadgeInSlots = `o.jsx("span",{className:"px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-mono text-[10px]",children:"Organizador: chicojambs@gmail.com"})`;
if (code.includes(hostBadgeInSlots)) {
  code = code.replace(hostBadgeInSlots, `null`);
  console.log('2a. Removed host badge from appointment slot cards!');
}

const hostLineInSuccess = `o.jsx("span",{className:"text-[11px] text-blue-700 block font-semibold mt-0.5",children:"✓ Sala Google Meet vinculada à conta proprietária: chicojambs@gmail.com"})`;
if (code.includes(hostLineInSuccess)) {
  code = code.replace(hostLineInSuccess, `null`);
  console.log('2b. Removed host line from appointment success modal!');
}

// General host string removals in UI
code = code.replace(/ \(Organizador: chicojambs@gmail\.com\)/g, '');
code = code.replace(/Organizador: chicojambs@gmail\.com/g, '');

// =========================================================================
// 3. RETIRAR DA TELA DE LOGIN OS PERFIS DIFERENTES
// =========================================================================
const oldLoginSubtitle = `Selecione seu perfil profissional para acesso multi-usuário simultâneo ou insira suas credenciais.`;
const newLoginSubtitle = `Acesse com sua conta Google ou informe seu e-mail e senha corporativos.`;
if (code.includes(oldLoginSubtitle)) {
  code = code.replace(oldLoginSubtitle, newLoginSubtitle);
  console.log('3a. Replaced login subtitle with clean description!');
}

const roleProfilesStart = `// Quick Role Profiles Selector`;
const credentialsFormStart = `// Credentials Form`;

if (code.includes(roleProfilesStart) && code.includes(credentialsFormStart)) {
  const p1 = code.indexOf(roleProfilesStart);
  const p2 = code.indexOf(credentialsFormStart);
  if (p1 !== -1 && p2 !== -1 && p2 > p1) {
    code = code.substring(0, p1) + code.substring(p2);
    console.log('3b. Completely removed different profiles selector from LoginScreen!');
  }
} else {
  console.warn('3b. Warning: Quick Role Profiles markers not found.');
}

// =========================================================================
// 4. CADASTRO DE NOVOS PSICÓLOGOS & INTEGRAÇÃO GOOGLE CALENDAR
// =========================================================================
// Add tab button in Q4 navigation
const navAdminTab = `o.jsxs("button",{onClick:()=>_("admin"),className:\`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 \${T==="admin"?"bg-white text-rose-700 shadow-sm":"bg-white/10 text-white hover:bg-white/20"}\`,children:[o.jsx(my,{className:"w-4 h-4"}),o.jsx("span",{className:"hidden sm:inline",children:"Cadastrar Horários"}),o.jsx("span",{className:"sm:hidden",children:"Grade"})]})`;

const psychologistsTabButton = `o.jsxs("button",{onClick:()=>_("psychologists"),className:\`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 \${T==="psychologists"?"bg-white text-indigo-700 shadow-sm":"bg-white/10 text-white hover:bg-white/20"}\`,children:[o.jsx("span",{children:"👥"}),o.jsx("span",{children:"Psicólogos & Agenda Integrada"}),o.jsx("span",{className:"text-[10px] bg-indigo-500/40 text-indigo-100 px-1.5 py-0.5 rounded font-extrabold uppercase hidden sm:inline",children:"Adm + Psi"})]})`;

if (code.includes(navAdminTab)) {
  code = code.replace(navAdminTab, `${psychologistsTabButton},${navAdminTab}`);
  console.log('4a. Added "Psicólogos & Agenda Integrada" tab button in Q4!');
} else {
  console.warn('4a. Could not find navAdminTab in Q4.');
}

fs.writeFileSync(filePath, code);
console.log('Saved preliminary changes to index-lkSxDUTb.js. Length:', code.length);
