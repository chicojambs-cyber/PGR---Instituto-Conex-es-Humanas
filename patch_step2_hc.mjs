import fs from 'fs';

const filePath = './src/index-lkSxDUTb.js';
let code = fs.readFileSync(filePath, 'utf8');

console.log('Original size:', code.length);

// 1. Add states to HC
const targetStates = '[be,P]=ee.useState(6),';
const newStates = `[be,P]=ee.useState(6),[mgrName,setMgrName]=ee.useState(""),[mgrEmail,setMgrEmail]=ee.useState(""),[mgrPassword,setMgrPassword]=ee.useState(""),[showMgrPass,setShowMgrPass]=ee.useState(!1),`;

if (!code.includes('[mgrName,setMgrName]')) {
  code = code.replace(targetStates, newStates);
  console.log('1. Added manager states to HC');
}

// 2. Add manager validation and data to os.createSchool inside ot
const targetCreate = 'const et=await os.createSchool({name:Y,city:O,state:se,mecCode:ce,cnpj:he,totalEmployees:de,contractedHours:Le,sickLeaveDays:$e,voluntaryResignations:ut,involuntaryDismissals:Q,hiredEmployees:_e});';
const newCreate = `if(!mgrName.trim()){T("Por favor, informe o Responsável pela empresa.");S(!1);return}
if(!mgrEmail.trim()){T("Por favor, informe o e-mail do Responsável para o primeiro usuário.");S(!1);return}
if(!mgrPassword.trim()||mgrPassword.length<3){T("Por favor, defina a senha do primeiro usuário (mínimo 3 caracteres).");S(!1);return}
const et=await os.createSchool({name:Y,city:O,state:se,mecCode:ce,cnpj:he,totalEmployees:de,contractedHours:Le,sickLeaveDays:$e,voluntaryResignations:ut,involuntaryDismissals:Q,hiredEmployees:_e,managerName:mgrName,managerEmail:mgrEmail,managerPassword:mgrPassword});`;

if (!code.includes('managerName:mgrName')) {
  code = code.replace(targetCreate, newCreate);
  console.log('2. Updated os.createSchool in ot to pass manager fields');
}

// 2b. Clear manager fields in success
const targetReset = 're(""),V(""),oe(""),le(""),Re(60),z(50),k(45),X(3),xe(2),P(6),';
const newReset = 're(""),V(""),oe(""),le(""),setMgrName(""),setMgrEmail(""),setMgrPassword(""),Re(60),z(50),k(45),X(3),xe(2),P(6),';

if (!code.includes('setMgrName("")')) {
  code = code.replace(targetReset, newReset);
  console.log('2b. Added reset of manager fields on success');
}

// 3. Add Section 5 in HC form JSX
const targetFooter = ']})]})]}),o.jsxs("div",{className:"pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100"';
const section5Jsx = `]})]})]})
,o.jsxs("div",{className:"pt-4 border-t border-slate-100",children:[
  o.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[
    o.jsx("span",{className:"w-5 h-5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold flex items-center justify-center",children:"5"}),
    o.jsx("h4",{className:"text-xs font-bold uppercase tracking-wider text-slate-700",children:"Primeiro Usuário & Responsável da Empresa (Acesso ao Sistema)"})
  ]}),
  o.jsx("p",{className:"text-xs text-slate-500 mb-3",children:"Defina os dados do Responsável pela empresa. Ele será o primeiro usuário com acesso ao sistema para preencher o questionário, acompanhar acolhimentos e gerenciar o link de cadastro dos colaboradores."}),
  o.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-3.5",children:[
    o.jsxs("div",{children:[
      o.jsxs("label",{className:"block text-xs font-bold text-slate-800 mb-1",children:["Responsável pela Empresa ",o.jsx("span",{className:"text-rose-500",children:"*"})]}),
      o.jsx("input",{type:"text",required:!0,value:mgrName,onChange:Me=>setMgrName(Me.target.value),placeholder:"Ex: Carlos Silveira (Diretor / RH)",className:"w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"})
    ]}),
    o.jsxs("div",{children:[
      o.jsxs("label",{className:"block text-xs font-bold text-slate-800 mb-1",children:["E-mail Corporativo (Login) ",o.jsx("span",{className:"text-rose-500",children:"*"})]}),
      o.jsx("input",{type:"email",required:!0,value:mgrEmail,onChange:Me=>setMgrEmail(Me.target.value),placeholder:"responsavel@empresa.com.br",className:"w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"})
    ]}),
    o.jsxs("div",{children:[
      o.jsxs("label",{className:"block text-xs font-bold text-slate-800 mb-1",children:["Senha de Acesso ",o.jsx("span",{className:"text-rose-500",children:"*"})]}),
      o.jsxs("div",{className:"relative",children:[
        o.jsx("input",{type:showMgrPass?"text":"password",required:!0,value:mgrPassword,onChange:Me=>setMgrPassword(Me.target.value),placeholder:"Defina a senha de acesso",className:"w-full text-xs px-3.5 py-2.5 pr-9 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"}),
        o.jsx("button",{type:"button",onClick:()=>setShowMgrPass(!showMgrPass),className:"absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs cursor-pointer",children:showMgrPass?"🙈":"👁️"})
      ]})
    ]})
  ]}),
  o.jsxs("div",{className:"mt-2.5 p-2.5 rounded-xl bg-purple-50/70 border border-purple-200 text-[11px] text-purple-900 flex items-center gap-2",children:[
    o.jsx("span",{className:"shrink-0 font-bold",children:"🔒"}),
    o.jsx("span",{children:"Conformidade NR-1 & LGPD: O primeiro usuário da empresa terá acesso às telas do colaborador e a uma tela exclusiva com o link para cadastro dos colaboradores."})
  ]})
]}),o.jsxs("div",{className:"pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100"`;

if (!code.includes('Primeiro Usuário & Responsável da Empresa')) {
  code = code.replace(targetFooter, section5Jsx);
  console.log('3. Added Section 5 to HC form JSX');
}

fs.writeFileSync(filePath, code);
console.log('Saved step 2. New size:', fs.statSync(filePath).size);
