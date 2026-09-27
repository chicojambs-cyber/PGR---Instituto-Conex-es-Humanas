import fs from 'fs';

const filePath = './src/index-lkSxDUTb.js';
let code = fs.readFileSync(filePath, 'utf8');

console.log('Original size:', code.length);

// 1. Update re state in iL() to include "collaborators-link"
const targetRe = '"permissions-mgmt":{id:"permissions-mgmt",title:"Gestão de Níveis de Permissão (Exclusivo ADM)",isOpen:!1,isMinimized:!1,zIndex:3}})';
const newRe = '"permissions-mgmt":{id:"permissions-mgmt",title:"Gestão de Níveis de Permissão (Exclusivo ADM)",isOpen:!1,isMinimized:!1,zIndex:3},"collaborators-link":{id:"collaborators-link",title:"Link para Cadastro dos Colaboradores da Empresa",isOpen:!1,isMinimized:!1,zIndex:11}})';

if (!code.includes('"collaborators-link":{id:"collaborators-link"')) {
  code = code.replace(targetRe, newRe);
  console.log('1. Added collaborators-link to re state in iL');
}

// 2. Add Fl window for collaborators-link
const targetFlSchools = 'children:o.jsx(HC,{schools:n,forms:a,responses:c,onSchoolCreated:Re,onSchoolDeleted:ke,onSchoolUpdated:z,onOpenFormToFill:le,onNavigateToDiagnosis:ge})})';
const newFlWithCollab = `children:o.jsx(HC,{schools:n,forms:a,responses:c,onSchoolCreated:Re,onSchoolDeleted:ke,onSchoolUpdated:z,onOpenFormToFill:le,onNavigateToDiagnosis:ge})})
,o.jsx(Fl,{
  id:"collaborators-link",
  title:"Link para Cadastro dos Colaboradores da Empresa",
  subtitle:"Ambiente do Responsável: Compartilhe o link oficial e acompanhe os colaboradores cadastrados",
  icon:Dn,
  isOpen:re["collaborators-link"]?.isOpen,
  isMinimized:re["collaborators-link"]?.isMinimized,
  zIndex:re["collaborators-link"]?.zIndex,
  onFocus:()=>se("collaborators-link"),
  onMinimize:()=>oe("collaborators-link"),
  onClose:()=>ce("collaborators-link"),
  children:o.jsx(CompanyCollaboratorsLinkScreen,{
    company:(n.find(s=>s.id===currentUser?.companyId))||n[0],
    allCompanies:n,
    onNavigateToForm:()=>{F("fill-form")},
    onNavigateToAppointments:()=>{F("appointments")},
    onSelectCompany:P=>{y(P)}
  })
})`;

if (!code.includes('id:"collaborators-link",title:"Link para Cadastro dos Colaboradores da Empresa"')) {
  code = code.replace(targetFlSchools, newFlWithCollab);
  console.log('2. Added Fl window for collaborators-link in iL');
}

// 3. Update BC to filter cards for company_manager and show collaborators-link
const targetBcStart = 'BC=({windows:n,onOpenWindow:t,onToggleWindow:a,schoolsCount:i,responsesCount:c})=>{';
const newBcStart = `BC=({windows:n,onOpenWindow:t,onToggleWindow:a,schoolsCount:i,responsesCount:c})=>{
  const curUser = (() => {
    try {
      const s = localStorage.getItem("psicosafe_current_user");
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  })();
  const isCompanyMgr = curUser?.role === 'company_manager' || curUser?.isCompanyManager;
`;

if (!code.includes('const isCompanyMgr = curUser?.role === \'company_manager\'')) {
  code = code.replace(targetBcStart, newBcStart);
  console.log('3. Injected curUser & isCompanyMgr into BC');
}

// 4. Update const g in BC to include collaborators-link and filter if isCompanyMgr
const targetGDef = 'const g=[{id:"schools",title:"Cadastrar Empresa & Links Exclusivos"';
const newGDef = `const allCards=[{id:"collaborators-link",title:"Link para Cadastro dos Colaboradores",badge:"Portal do Responsável",description:"Exiba e compartilhe o link oficial e QR Code para que os colaboradores da sua organização se cadastrem e respondam.",icon:Dn,color:"text-purple-600 bg-purple-50 border-purple-100",bgHover:"hover:border-purple-300 hover:shadow-md"},{id:"schools",title:"Cadastrar Empresa & Links Exclusivos"`;

if (!code.includes('const allCards=[')) {
  code = code.replace(targetGDef, newGDef);
  console.log('4. Added collaborators-link to allCards');
}

const targetGFilter = 'color:"text-violet-600 bg-violet-50 border-violet-100",bgHover:"hover:border-violet-300 hover:shadow-md"}];';
const newGFilter = `color:"text-violet-600 bg-violet-50 border-violet-100",bgHover:"hover:border-violet-300 hover:shadow-md"}];
const g = isCompanyMgr ? allCards.filter(cd => cd.id === "collaborators-link" || cd.id === "fill-form" || cd.id === "appointments") : allCards;`;

if (!code.includes('const g = isCompanyMgr ? allCards.filter')) {
  code = code.replace(targetGFilter, newGFilter);
  console.log('5. Filtered cards in BC for company_manager');
}

// 6. Update Header in iL: show "Link dos Colaboradores" button for company_manager
const targetHeaderEmpresas = 'o.jsxs("button",{onClick:()=>F("schools"),className:"inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer",children:[o.jsx(ta,{className:"w-3.5 h-3.5"}),o.jsxs("span",{children:["Empresas (",n.length,")"]})]})';
const newHeaderEmpresas = `(currentUser?.role === "company_manager" || currentUser?.isCompanyManager) ? o.jsxs("button",{onClick:()=>F("collaborators-link"),className:"inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer",children:[o.jsx("span",{children:"👥"}),o.jsx("span",{children:"Link dos Colaboradores"})]}) : o.jsxs("button",{onClick:()=>F("schools"),className:"inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer",children:[o.jsx(ta,{className:"w-3.5 h-3.5"}),o.jsxs("span",{children:["Empresas (",n.length,")"]})]})`;

if (!code.includes('currentUser?.role === "company_manager" || currentUser?.isCompanyManager) ? o.jsxs("button",{onClick:()=>F("collaborators-link")')) {
  code = code.replace(targetHeaderEmpresas, newHeaderEmpresas);
  console.log('6. Updated header button in iL for company_manager');
}

// 7. Update LoginScreen quick select for Responsável da Empresa
const targetLoginSupervisor = `onClick: () => handleQuickSelect("supervisor", "gestor@empresa.com.br"),`;
const newLoginSupervisor = `onClick: () => handleQuickSelect("company_manager", "gestor@empresamodelo.com.br", "empresa123"),`;

if (code.includes(targetLoginSupervisor)) {
  code = code.replace(targetLoginSupervisor, newLoginSupervisor);
  console.log('7. Updated LoginScreen supervisor button to company_manager with gestor@empresamodelo.com.br');
}

// 8. Auto open collaborators-link if company_manager logs in
const targetAutoCheck = 'const Ye=Q||Ke;(Ye||_e)&&(Ye&&J(Ye),_e&&y(_e),w(!0),L(!1))}catch{}};';
const newAutoCheck = `const Ye=Q||Ke;(Ye||_e)&&(Ye&&J(Ye),_e&&y(_e),w(!0),L(!1));
try {
  const cu = localStorage.getItem("psicosafe_current_user");
  if (cu) {
    const parsed = JSON.parse(cu);
    if (parsed.role === "company_manager" || parsed.isCompanyManager) {
      setTimeout(() => F("collaborators-link"), 400);
    }
  }
} catch {}
}catch{}};`;

if (!code.includes('if (parsed.role === "company_manager" || parsed.isCompanyManager)')) {
  code = code.replace(targetAutoCheck, newAutoCheck);
  console.log('8. Added auto-open collaborators-link for company_manager in iL');
}

fs.writeFileSync(filePath, code);
console.log('Saved step 3. New size:', fs.statSync(filePath).size);
