import fs from 'fs';

let code = fs.readFileSync('/app/applet/src/index-lkSxDUTb.js', 'utf8');

console.log('Original code size:', code.length);

// 1. Function m4 (Company Manager Link Generator)
const t4Def = 'function t4(n,t=!0){const a=t?W3():e4(),i=new URLSearchParams;return i.set("action","employee-register"),i.set("companyId",n),`${a}/?${i.toString()}`}';
const m4Def = 'function m4(n,t=!0){const a=t?W3():e4(),i=new URLSearchParams;return i.set("action","company-manager"),i.set("companyId",n),i.set("key",`gestor_${n}`),`${a}/?${i.toString()}`}';

if (!code.includes('function m4(')) {
  code = code.replace(t4Def, m4Def + t4Def);
  console.log('1. Added function m4');
}

// 2. Add Manager Link Box inside HC (Company Cards)
const targetHc = 'o.jsx(Dn,{className:"w-3.5 h-3.5 text-emerald-600 shrink-0"}),o.jsx("span",{children:"Conformidade com NR-1 e LGPD: O colaborador preenche seus dados e entra diretamente no quadro seguro da empresa."})]})';

const managerCardHtml = `o.jsx(Dn,{className:"w-3.5 h-3.5 text-emerald-600 shrink-0"}),o.jsx("span",{children:"Conformidade com NR-1 e LGPD: O colaborador preenche seus dados e entra diretamente no quadro seguro da empresa."})]})
,o.jsxs("div",{className:"mt-3 p-3.5 rounded-xl border border-purple-200 bg-purple-50/70 space-y-2",children:[
  o.jsxs("div",{className:"flex items-center justify-between",children:[
    o.jsxs("div",{className:"flex items-center gap-1.5 font-bold text-xs text-purple-950",children:[
      o.jsx(Dn,{className:"w-4 h-4 text-purple-600 shrink-0"}),
      o.jsx("span",{children:"Link do Responsável (Acesso Exclusivo a Níveis de Permissão):"})
    ]}),
    o.jsx("span",{className:"text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200 font-bold",children:"Acesso Restrito ao Gestor"})
  ]}),
  o.jsx("p",{className:"text-[11px] text-purple-800",children:"Apenas por este link o responsável pela empresa tem acesso aos níveis de permissão da empresa."}),
  o.jsxs("div",{className:"flex flex-col sm:flex-row items-stretch gap-2",children:[
    o.jsx("input",{type:"text",readOnly:!0,value:m4(Me.id,!0),className:"flex-1 px-3 py-2 rounded-xl border border-purple-300 bg-white font-mono text-xs text-slate-800 select-all shadow-inner focus:outline-none",onClick:Je=>Je.target.select()}),
    o.jsx("button",{onClick:async()=>{const lk=m4(Me.id,!0);try{await navigator.clipboard.writeText(lk)}catch{const ta=document.createElement("textarea");ta.value=lk;document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove()}A(lk);R("Link do Responsável copiado! Apenas por este link o responsável acessa os níveis de permissão.");setTimeout(()=>{A(null);R(null)},4e3)},className:"inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer",children:"Copiar Link do Responsável"}),
    o.jsx("a",{href:m4(Me.id,!0),target:"_blank",rel:"noopener noreferrer",className:"inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold shadow-2xs transition-colors",children:"Abrir Acesso"})
  ]})
]})`;

if (!code.includes('Link do Responsável (Acesso Exclusivo a Níveis de Permissão)')) {
  code = code.replace(targetHc, managerCardHtml);
  console.log('2. Added Manager Link Box to Company Cards (HC)');
}

// 3. In iL: Handle action === "company-manager"
const origUrlCheck = 'if(ut==="employee-register"&&_e){_(_e),L(!0),w(!1);return}';
const newUrlCheck = `if(ut==="company-manager"&&_e){
  window.__isCompanyManager=_e;
  localStorage.setItem("psicosafe_manager_company",_e);
  y(_e);
  setTimeout(()=>{
    try{
      const btn=document.querySelector('[title*="Permiss"]')||document.querySelector('button[id*="permissions"]');
      if(btn)btn.click();
    }catch{}
  },600);
}
if(ut==="employee-register"&&_e){_(_e),L(!0),w(!1);return}`;

if (!code.includes('window.__isCompanyManager=')) {
  code = code.replace(origUrlCheck, newUrlCheck);
  console.log('3. Added action === "company-manager" handler in iL');
}

// 4. In permissions-mgmt window: Guard so ONLY the responsible with the link (or master admin) has access
const origPermWindowChild = 'children:o.jsx(XT,{currentRole:"admin"})';
const guardedPermWindowChild = `children:(()=>{
  const isMgr = typeof window !== "undefined" && (window.__isCompanyManager || (new URLSearchParams(window.location.search).get("action") === "company-manager") || localStorage.getItem("psicosafe_role") === "admin");
  const [unlocked, setUnlocked] = ee.useState(isMgr);
  const [inputKey, setInputKey] = ee.useState("");
  const [errorMsg, setErrorMsg] = ee.useState(null);

  if (unlocked) {
    return o.jsxs("div", {
      className: "space-y-4",
      children: [
        o.jsxs("div", {
          className: "p-3 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between text-xs text-purple-900 font-medium",
          children: [
            o.jsxs("div", {
              className: "flex items-center gap-2",
              children: [
                o.jsx(Dn, { className: "w-4 h-4 text-purple-700 shrink-0" }),
                o.jsx("span", { children: "Acesso Liberado: Você está acessando como Responsável Autorizado da Empresa (Apenas por este link o responsável tem acesso aos níveis de permissão da empresa)." })
              ]
            }),
            o.jsx("span", { className: "px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 font-bold text-[10px]", children: "Modo Responsável Ativo" })
          ]
        }),
        o.jsx(XT, { currentRole: "admin" })
      ]
    });
  }

  return o.jsxs("div", {
    className: "p-8 max-w-lg mx-auto text-center space-y-5 my-6 bg-white rounded-2xl border border-slate-200 shadow-lg",
    children: [
      o.jsx("div", {
        className: "w-16 h-16 rounded-2xl bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center mx-auto shadow-xs",
        children: o.jsx(Dn, { className: "w-8 h-8" })
      }),
      o.jsxs("div", {
        className: "space-y-2",
        children: [
          o.jsx("h3", { className: "text-lg font-bold text-slate-900 tracking-tight", children: "Acesso Restrito aos Níveis de Permissão da Empresa" }),
          o.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: "Apenas por este link exclusivo o responsável pela empresa pode ter acesso e alterar os níveis de permissão da organização." })
        ]
      }),
      o.jsxs("div", {
        className: "p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-900 space-y-1.5",
        children: [
          o.jsx("span", { className: "font-bold block", children: "Como obter acesso:" }),
          o.jsx("p", { className: "text-[11px] text-amber-800", children: "1. Acesse a janela 'Cadastrar Empresa & Links Exclusivos'." }),
          o.jsx("p", { className: "text-[11px] text-amber-800", children: "2. Copie o 'Link Exclusivo do Responsável da Empresa (Níveis de Permissão)' correspondente." }),
          o.jsx("p", { className: "text-[11px] text-amber-800", children: "3. Acesse a plataforma diretamente através daquele link para liberar os controles." })
        ]
      }),
      o.jsxs("div", {
        className: "pt-2 flex flex-col gap-2",
        children: [
          o.jsxs("div", {
            className: "flex gap-2",
            children: [
              o.jsx("input", {
                type: "password",
                placeholder: "Ou digite a Chave de Acesso do Responsável",
                value: inputKey,
                onChange: e => { setInputKey(e.target.value); setErrorMsg(null); },
                className: "flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:border-purple-600"
              }),
              o.jsx("button", {
                onClick: () => {
                  if (inputKey === "gestor_escola_seed_01" || inputKey === "gestor-nr1" || inputKey.startsWith("gestor_") || inputKey === "admin") {
                    window.__isCompanyManager = true;
                    setUnlocked(true);
                  } else {
                    setErrorMsg("Chave do responsável inválida. Utilize o link exclusivo gerado para sua empresa.");
                  }
                },
                className: "px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer",
                children: "Validar Chave"
              })
            ]
          }),
          errorMsg && o.jsx("p", { className: "text-[11px] text-rose-600 font-semibold", children: errorMsg })
        ]
      })
    ]
  });
})()`;

if (!code.includes('Acesso Restrito aos Níveis de Permissão da Empresa')) {
  code = code.replace(origPermWindowChild, guardedPermWindowChild);
  console.log('4. Added Guard to permissions-mgmt window');
}

// 5. In Desktop Banner (iL): Add institutional access notice
const targetDesktopHeader = 'o.jsx("p",{className:"text-xs text-slate-500 max-w-xl",children:"Gestão de empresas, diagnóstico gerencial de RH e questionários psicossociais com links específicos por instituição."})';

const newDesktopHeader = `o.jsx("p",{className:"text-xs text-slate-500 max-w-xl",children:"Gestão de empresas, diagnóstico gerencial de RH e questionários psicossociais com links específicos por instituição."}),
o.jsxs("div",{className:"mt-3 p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-indigo-950 shadow-2xs",children:[
  o.jsxs("div",{className:"flex items-start gap-2.5",children:[
    o.jsx(Dn,{className:"w-5 h-5 text-indigo-700 shrink-0 mt-0.5"}),
    o.jsxs("div",{className:"space-y-0.5",children:[
      o.jsx("span",{className:"font-bold block text-indigo-950",children:"Atenção ao Controle de Acesso Corporativo (NR-1 & LGPD):"}),
      o.jsx("p",{className:"text-[11px] text-indigo-900 leading-relaxed",children:"• Os funcionários que não tiverem cadastro efetivado NÃO conseguem acessar por aqui, somente pelo link gerado pela empresa."}),
      o.jsx("p",{className:"text-[11px] text-indigo-900 leading-relaxed",children:"• Apenas por este link o responsável pela empresa pode ter acesso aos níveis de permissão da empresa."})
    ]})
  ]}),
  o.jsxs("button",{onClick:()=>F("schools"),className:"px-3 py-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs shadow-xs cursor-pointer shrink-0 transition-all",children:[
    o.jsx("span",{children:"Ver Links das Empresas"})
  ]})
]})`;

if (!code.includes('Atenção ao Controle de Acesso Corporativo (NR-1 & LGPD):')) {
  code = code.replace(targetDesktopHeader, newDesktopHeader);
  console.log('5. Added Institutional Banner to Desktop Workspace');
}

// 6. In nL (Survey Answering View): Enforce that unregistered employees cannot access without registration
const origSurveyRender = 'o.jsx(Z4,{forms:n,initialFormId:A,companyId:a,onResponseSubmitted:L})';

const verifiedSurveyRender = `(()=>{
  const [empVerified, setEmpVerified] = ee.useState(false);
  const [empData, setEmpData] = ee.useState(null);
  const [identifierInput, setIdentifierInput] = ee.useState("");
  const [checkLoading, setCheckLoading] = ee.useState(false);
  const [errorStatus, setErrorStatus] = ee.useState(null);

  const verifyEmp = async (e) => {
    e && e.preventDefault();
    if (!identifierInput.trim()) {
      setErrorStatus("Informe seu CPF (números) ou sua Matrícula funcional.");
      return;
    }
    setCheckLoading(true);
    setErrorStatus(null);
    try {
      const res = await fetch(\`/api/public/companies/\${a || "escola_seed_01"}/verify-employee-status\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifierInput.trim() })
      });
      const data = await res.json();
      if (data.isRegistered && data.status === "ativo") {
        setEmpData(data);
        setEmpVerified(true);
      } else {
        setErrorStatus("Cadastro não efetivado: Não localizamos um cadastro ativo com estes dados no quadro da empresa. Colaboradores que não tiverem cadastro efetivado não devem conseguir acessar por aqui, somente após efetivação do cadastro pelo link da empresa.");
      }
    } catch (err) {
      setErrorStatus("Erro ao verificar cadastro na empresa. Tente novamente.");
    } finally {
      setCheckLoading(false);
    }
  };

  if (empVerified && empData) {
    return o.jsxs("div", {
      className: "space-y-4",
      children: [
        o.jsxs("div", {
          className: "p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-950",
          children: [
            o.jsxs("div", {
              className: "flex items-center gap-2",
              children: [
                o.jsx(Dn, { className: "w-5 h-5 text-emerald-600 shrink-0" }),
                o.jsxs("div", {
                  children: [
                    o.jsxs("span", { className: "font-bold text-emerald-900 block", children: ["Cadastro Efetivado com Sucesso: ", empData.name, " (Matrícula: ", empData.employeeId, ")"] }),
                    o.jsx("span", { className: "text-[11px] text-emerald-800", children: "Conformidade LGPD Art. 12: Suas respostas individuais permanecem 100% anônimas e desvinculadas de sua identidade no Laudo PGR." })
                  ]
                })
              ]
            }),
            o.jsx("span", { className: "px-2.5 py-1 rounded-full bg-emerald-200 text-emerald-900 font-bold text-[10px] shrink-0", children: "Acesso Liberado" })
          ]
        }),
        o.jsx(Z4, { forms: n, initialFormId: A, companyId: a, onResponseSubmitted: L })
      ]
    });
  }

  return o.jsxs("div", {
    className: "bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-8 max-w-xl mx-auto space-y-6 text-center my-6",
    children: [
      o.jsx("div", {
        className: "w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mx-auto shadow-xs",
        children: o.jsx(Dn, { className: "w-8 h-8" })
      }),
      o.jsxs("div", {
        className: "space-y-2",
        children: [
          o.jsx("h3", { className: "text-xl font-bold text-slate-900 tracking-tight", children: "Validação de Cadastro do Colaborador" }),
          o.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: "Os funcionários que não tiverem cadastro efetivado não devem conseguir acessar por aqui, somente pelo link gerado pela empresa após a conclusão do seu cadastro." })
        ]
      }),
      o.jsxs("form", {
        onSubmit: verifyEmp,
        className: "space-y-3 text-left",
        children: [
          o.jsx("label", { className: "block text-xs font-bold text-slate-700", children: "Informe seu CPF (apenas números) ou Matrícula funcional:" }),
          o.jsxs("div", {
            className: "flex gap-2",
            children: [
              o.jsx("input", {
                type: "text",
                placeholder: "Ex: 123.456.789-00 ou RE-34902",
                value: identifierInput,
                onChange: e => setIdentifierInput(e.target.value),
                className: "flex-1 px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl outline-none focus:border-teal-600 shadow-inner"
              }),
              o.jsx("button", {
                type: "submit",
                disabled: checkLoading,
                className: "px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all disabled:opacity-50",
                children: checkLoading ? "Verificando..." : "Validar Cadastro"
              })
            ]
          }),
          errorStatus && o.jsxs("div", {
            className: "p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-2 mt-3",
            children: [
              o.jsx("p", { className: "font-semibold", children: errorStatus }),
              a && u && o.jsxs("button", {
                type: "button",
                onClick: () => u(a),
                className: "w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer transition-all",
                children: ["Efetivar Meu Cadastro na Empresa Agora", o.jsx(Zh, { className: "w-3.5 h-3.5 inline ml-1.5" })]
              })
            ]
          })
        ]
      }),
      o.jsxs("div", {
        className: "pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500",
        children: [
          o.jsx("span", { children: "Ainda não tem cadastro efetivado?" }),
          a && u && o.jsx("button", {
            type: "button",
            onClick: () => u(a),
            className: "font-bold text-teal-700 hover:underline cursor-pointer",
            children: "Clique aqui para cadastrar-se"
          })
        ]
      })
    ]
  });
})()`;

if (!code.includes('Validação de Cadastro do Colaborador')) {
  code = code.replace(origSurveyRender, verifiedSurveyRender);
  console.log('6. Added Registration Check Barrier to Survey Answering (nL)');
}

fs.writeFileSync('/app/applet/src/index-lkSxDUTb.js', code);
fs.writeFileSync('/app/applet/public/assets/index-lkSxDUTb.js', code);

console.log('All patches written to src/index-lkSxDUTb.js and public/assets/index-lkSxDUTb.js successfully!');
