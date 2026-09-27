import fs from 'fs';
import esbuild from 'esbuild';

const filePath = './src/index-lkSxDUTb.js';
let code = fs.readFileSync(filePath, 'utf8');

console.log('Original code length:', code.length);

// 1. Add state variables to function iL()
const stateTarget = 'const[n,t]=ee.useState([])';
const stateAddition = `const [currentUser, setCurrentUser] = ee.useState(() => {
  try {
    const s = localStorage.getItem("psicosafe_current_user");
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
});
const [isLoggedIn, setIsLoggedIn] = ee.useState(() => {
  const params = new URLSearchParams(window.location.search);
  const action = params.get("action");
  if (action === "employee-register" || action === "company-manager" || action === "fill-form") return true;
  return !!localStorage.getItem("psicosafe_current_user");
});
const [showCloudModal, setShowCloudModal] = ee.useState(false);
const [activeUsersCount, setActiveUsersCount] = ee.useState(1);

ee.useEffect(() => {
  const checkPresence = () => {
    fetch('/api/auth/active-sessions')
      .then(r => r.json())
      .then(d => {
        if (d && d.totalActive) setActiveUsersCount(d.totalActive);
      })
      .catch(() => {});
  };
  checkPresence();
  const iv = setInterval(checkPresence, 12000);
  return () => clearInterval(iv);
}, []);
const[n,t]=ee.useState([])`;

if (!code.includes('const [currentUser, setCurrentUser] = ee.useState')) {
  code = code.replace(stateTarget, stateAddition);
  console.log('1. Added currentUser and isLoggedIn states to iL');
}

// 2. Add LoginScreen rendering condition in iL return
const origReturnTarget = 'v?o.jsx(nL,{forms:a,targetFormId:U,companyId:S,onResponseSubmitted:ae,onNavigateToEmployeeRegistration:P=>{w(!1),_(P),L(!0)},onExitSurveyMode:()=>{w(!1),J(void 0),y(void 0);try{const P=window.location.pathname;window.history.replaceState({},document.title,P)}catch{}}}):';

const newReturnTarget = `v?o.jsx(nL,{forms:a,targetFormId:U,companyId:S,onResponseSubmitted:ae,onNavigateToEmployeeRegistration:P=>{w(!1),_(P),L(!0)},onExitSurveyMode:()=>{w(!1),J(void 0),y(void 0);try{const P=window.location.pathname;window.history.replaceState({},document.title,P)}catch{}}}):!isLoggedIn?o.jsx(LoginScreen,{onLoginSuccess:(usr)=>{setCurrentUser(usr);setIsLoggedIn(true);localStorage.setItem("psicosafe_current_user",JSON.stringify(usr));},onAnonymousSurvey:()=>{w(!0);}}):`;

if (!code.includes('!isLoggedIn?o.jsx(LoginScreen')) {
  code = code.replace(origReturnTarget, newReturnTarget);
  console.log('2. Added LoginScreen conditional rendering to iL return');
}

// 3. Add User and Cloud buttons to desktop header in iL
const headerButtonsTarget = 'o.jsxs("button",{onClick:()=>F("security-audit"),className:"inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer",title:"Inspecionar persistência em nuvem, integridade SHA-256 e segurança exclusiva do Administrador",children:[o.jsx("span",{className:"w-2 h-2 rounded-full bg-emerald-500 animate-pulse"}),o.jsx("span",{className:"hidden md:inline",children:"Servidor Cloud Seguro"}),o.jsx("span",{className:"md:hidden",children:"Nuvem OK"})]}),';

const headerButtonsAddition = `o.jsxs("button",{onClick:()=>setShowCloudModal(true),className:"hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold transition-colors cursor-pointer",title:"Múltiplos usuários simultâneos ativos no sistema",children:[o.jsx("span",{children:"👥"}),o.jsxs("span",{children:[activeUsersCount," Conectados"]})]}),o.jsxs("button",{onClick:()=>setShowCloudModal(true),className:"inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer",title:"Verificar conexão em nuvem Google Cloud Firestore em tempo real",children:[o.jsx("span",{className:"w-2 h-2 rounded-full bg-emerald-500 animate-pulse"}),o.jsx("span",{className:"hidden sm:inline",children:"Nuvem Firestore Ativa"}),o.jsx("span",{className:"sm:hidden",children:"Nuvem OK"})]}),o.jsxs("div",{className:"flex items-center gap-2 pl-2 border-l border-slate-200 text-xs",children:[o.jsx("div",{className:"w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs",children:currentUser?.avatar||currentUser?.name?.[0]||"U"}),o.jsxs("div",{className:"hidden lg:block text-left leading-tight",children:[o.jsx("p",{className:"font-bold text-slate-800 text-[11px] truncate max-w-[130px]",children:currentUser?.name||"Administrador Geral"}),o.jsx("p",{className:"text-[10px] text-blue-700 font-semibold truncate",children:currentUser?.roleName||"Admin"})]}),o.jsx("button",{onClick:()=>{localStorage.removeItem("psicosafe_current_user");setIsLoggedIn(!1);setCurrentUser(null);},className:"px-2 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 border border-slate-200 text-[11px] font-bold transition-colors cursor-pointer",title:"Trocar usuário ou sair do sistema",children:"Trocar / Sair"})]}),`;

if (!code.includes('Múltiplos usuários simultâneos ativos no sistema')) {
  code = code.replace(headerButtonsTarget, headerButtonsAddition);
  console.log('3. Added user pill and cloud triggers to desktop header');
}

// 4. Inject CloudStatusModal modal into desktop root
const desktopEndTarget = 'onExitSurveyMode:()=>{w(!1),J(void 0),y(void 0);try{const P=window.location.pathname;window.history.replaceState({},document.title,P)}catch{}}})]})';

// Let's find where the main desktop div closes
const mainDivPos = code.lastIndexOf('children:[o.jsx(BC,{windows:re');
if (mainDivPos !== -1) {
  // Find where main desktop element closes
  const bcStr = 'o.jsx(BC,{windows:re,onOpenWindow:F,onToggleWindow:he,schoolsCount:n.length,responsesCount:c.length}),';
  const bcAddition = `o.jsx(CloudStatusModal,{isOpen:showCloudModal,onClose:()=>setShowCloudModal(false)}),` + bcStr;
  if (!code.includes('o.jsx(CloudStatusModal,{isOpen:showCloudModal')) {
    code = code.replace(bcStr, bcAddition);
    console.log('4. Added CloudStatusModal to main desktop');
  }
}

// Validate entire bundle with esbuild
console.log('Validating full bundle syntax with esbuild...');
try {
  esbuild.transformSync(code, { loader: 'js' });
  console.log('FULL BUNDLE SYNTAX VALIDATION SUCCEEDED! 🚀');
  fs.writeFileSync(filePath, code);
  // Also copy to public/assets
  fs.copyFileSync(filePath, './public/assets/index-lkSxDUTb.js');
  console.log('Successfully written and synced bundle!');
} catch (err) {
  console.error('esbuild validation error:', err);
  process.exit(1);
}
