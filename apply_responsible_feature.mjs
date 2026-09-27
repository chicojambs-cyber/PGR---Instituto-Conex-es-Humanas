import fs from 'fs';

const filePath = './src/index-lkSxDUTb.js';
let code = fs.readFileSync(filePath, 'utf8');

console.log('Original index-lkSxDUTb.js size:', code.length);

// -------------------------------------------------------------
// STEP 1: Add CompanyCollaboratorsLinkScreen Component
// -------------------------------------------------------------
const collaboratorsScreenComponent = `
const CompanyCollaboratorsLinkScreen = ({ company, allCompanies = [], onNavigateToForm, onNavigateToAppointments, onSelectCompany }) => {
  const [copied, setCopied] = ee.useState(false);
  const [employees, setEmployees] = ee.useState([]);
  const [loadingEmps, setLoadingEmps] = ee.useState(false);
  const [searchTerm, setSearchTerm] = ee.useState("");
  const [selectedCompId, setSelectedCompId] = ee.useState(company?.id || (allCompanies[0]?.id || ""));

  const activeCompany = (allCompanies.find(c => c.id === selectedCompId)) || company || allCompanies[0] || {
    id: "escola_01",
    name: "Empresa Modelo Industrial & Corporativa S.A.",
    cnpj: "12.345.678/0001-90",
    city: "São Paulo",
    state: "SP",
    managerName: "Carlos Eduardo Silva",
    managerEmail: "gestor@empresamodelo.com.br"
  };

  const regLink = typeof t4 === "function" ? t4(activeCompany.id, true) : (window.location.origin + "/?action=employee-register&companyId=" + activeCompany.id);

  // Load real employees from backend
  const loadEmployees = ee.useCallback(async () => {
    if (!activeCompany?.id) return;
    setLoadingEmps(true);
    try {
      const res = await fetch('/api/companies/' + activeCompany.id + '/employees');
      const data = await res.json();
      if (Array.isArray(data)) {
        setEmployees(data);
      }
    } catch (e) {
      console.warn("Erro ao buscar colaboradores da empresa:", e);
    } finally {
      setLoadingEmps(false);
    }
  }, [activeCompany?.id]);

  ee.useEffect(() => {
    loadEmployees();
    const iv = setInterval(loadEmployees, 15000);
    return () => clearInterval(iv);
  }, [loadEmployees]);

  const handleCopyLink = async () => {
    let ok = false;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(regLink);
        ok = true;
      }
    } catch {}
    if (!ok) {
      try {
        const ta = document.createElement("textarea");
        ta.value = regLink;
        ta.style.position = "fixed";
        ta.style.left = "-999999px";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        ok = document.execCommand("copy");
        ta.remove();
      } catch {}
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3500);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      "Olá, colaborador(a)! Segue o link oficial e confidencial para seu cadastro no Programa de Gestão de Riscos Psicossociais (NR-1) da empresa " +
      activeCompany.name + ":\\n\\n" + regLink + "\\n\\nSeus dados estão protegidos com total sigilo pela LGPD."
    );
    window.open("https://api.whatsapp.com/send?text=" + text, "_blank");
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent("Cadastro Confidencial no Programa NR-1 - " + activeCompany.name);
    const body = encodeURIComponent(
      "Prezado(a) colaborador(a),\\n\\nSolicitamos seu cadastro no sistema seguro da empresa " + activeCompany.name +
      " para participação no Programa de Mapeamento de Riscos Psicossociais (NR-1).\\n\\nAcesse o link exclusivo abaixo:\\n" +
      regLink + "\\n\\nSeus dados e respostas são 100% confidenciais e protegidos sob a LGPD.\\n\\nAtenciosamente,\\n" +
      (activeCompany.managerName || "Responsável pela Empresa")
    );
    window.open("mailto:?subject=" + subject + "&body=" + body, "_blank");
  };

  const filteredEmps = employees.filter(e => {
    const s = searchTerm.toLowerCase();
    return !s || e.name?.toLowerCase().includes(s) || e.department?.toLowerCase().includes(s) || e.roleCategory?.toLowerCase().includes(s);
  });

  const totalAnswered = employees.filter(e => e.surveyFilled).length;

  return o.jsxs("div", {
    className: "space-y-6 max-w-5xl mx-auto p-2 sm:p-4 text-slate-800",
    children: [
      // Top Header Card
      o.jsxs("div", {
        className: "bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10 relative overflow-hidden",
        children: [
          o.jsx("div", { className: "absolute -right-12 -top-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" }),
          o.jsxs("div", {
            className: "flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10",
            children: [
              o.jsxs("div", {
                className: "space-y-2",
                children: [
                  o.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [
                      o.jsx("span", { className: "px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider", children: "Portal do Responsável" }),
                      o.jsx("span", { className: "px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold", children: "Conformidade NR-1 & LGPD" })
                    ]
                  }),
                  o.jsx("h2", { className: "text-2xl sm:text-3xl font-extrabold tracking-tight text-white", children: "Link para Cadastro dos Colaboradores da Empresa" }),
                  o.jsxs("p", {
                    className: "text-sm text-slate-300 max-w-2xl leading-relaxed",
                    children: [
                      "Central oficial de convite da empresa ",
                      o.jsx("strong", { className: "text-white font-bold", children: activeCompany.name }),
                      ". Compartilhe o link exclusivo com os colaboradores para que realizem o autocadastro seguro no sistema."
                    ]
                  })
                ]
              }),
              allCompanies.length > 1 && o.jsxs("div", {
                className: "bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 space-y-1.5 self-start md:self-auto",
                children: [
                  o.jsx("label", { className: "block text-[11px] font-bold text-blue-200 uppercase tracking-wider", children: "Selecionar Empresa:" }),
                  o.jsx("select", {
                    value: selectedCompId,
                    onChange: e => {
                      setSelectedCompId(e.target.value);
                      if (onSelectCompany) onSelectCompany(e.target.value);
                    },
                    className: "bg-slate-900/90 text-white text-xs font-semibold rounded-xl px-3 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400",
                    children: allCompanies.map(c => o.jsx("option", { key: c.id, value: c.id, className: "bg-slate-900 text-white", children: c.name }))
                  })
                ]
              })
            ]
          }),
          // Company Manager Meta Footer inside Banner
          o.jsxs("div", {
            className: "mt-6 pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs",
            children: [
              o.jsxs("div", {
                className: "flex items-center gap-2.5",
                children: [
                  o.jsx("div", { className: "w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold", children: "🏢" }),
                  o.jsxs("div", {
                    children: [
                      o.jsx("span", { className: "text-[10px] text-slate-400 block", children: "Empresa / Unidade:" }),
                      o.jsx("span", { className: "font-bold text-white truncate block", children: activeCompany.name })
                    ]
                  })
                ]
              }),
              o.jsxs("div", {
                className: "flex items-center gap-2.5",
                children: [
                  o.jsx("div", { className: "w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold", children: "👤" }),
                  o.jsxs("div", {
                    children: [
                      o.jsx("span", { className: "text-[10px] text-slate-400 block", children: "Responsável Cadastrado:" }),
                      o.jsx("span", { className: "font-bold text-white truncate block", children: activeCompany.managerName || "Responsável Oficial" })
                    ]
                  })
                ]
              }),
              o.jsxs("div", {
                className: "flex items-center gap-2.5",
                children: [
                  o.jsx("div", { className: "w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold", children: "✉" }),
                  o.jsxs("div", {
                    children: [
                      o.jsx("span", { className: "text-[10px] text-slate-400 block", children: "E-mail de Login do Responsável:" }),
                      o.jsx("span", { className: "font-bold text-emerald-300 truncate block", children: activeCompany.managerEmail || "gestor@empresa.com.br" })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      }),

      // Main Shareable Link Card
      o.jsxs("div", {
        className: "bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 space-y-6",
        children: [
          o.jsxs("div", {
            className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100",
            children: [
              o.jsxs("div", {
                children: [
                  o.jsxs("h3", {
                    className: "text-lg font-extrabold text-slate-900 flex items-center gap-2",
                    children: [
                      o.jsx("span", { className: "w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold", children: "🔗" }),
                      "Link Exclusivo de Cadastro dos Colaboradores"
                    ]
                  }),
                  o.jsx("p", { className: "text-xs text-slate-500 mt-1", children: "Este link direciona diretamente o colaborador para o formulário de autocadastro vinculado a esta empresa." })
                ]
              }),
              o.jsx("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold", children: [o.jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }), "Link Ativo"] })
            ]
          }),

          // Link Input & Copy Actions
          o.jsxs("div", {
            className: "space-y-3",
            children: [
              o.jsxs("div", {
                className: "flex flex-col sm:flex-row items-stretch gap-2.5",
                children: [
                  o.jsx("input", {
                    type: "text",
                    readOnly: true,
                    value: regLink,
                    onClick: e => e.target.select(),
                    className: "flex-1 px-4 py-3 rounded-2xl border-2 border-blue-200 bg-blue-50/40 text-blue-950 font-mono text-xs font-semibold select-all focus:outline-none focus:border-blue-500 shadow-inner"
                  }),
                  o.jsxs("button", {
                    type: "button",
                    onClick: handleCopyLink,
                    className: "px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95",
                    children: [
                      o.jsx("span", { children: copied ? "✓" : "📋" }),
                      o.jsx("span", { children: copied ? "Copiado com Sucesso!" : "Copiar Link" })
                    ]
                  })
                ]
              }),
              copied && o.jsx("p", {
                className: "text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-fadeIn",
                children: "Link copiado para a área de transferência! Cole no e-mail ou grupo de WhatsApp da sua equipe."
              })
            ]
          }),

          // Quick Share Buttons
          o.jsxs("div", {
            className: "grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2",
            children: [
              o.jsxs("button", {
                type: "button",
                onClick: handleWhatsAppShare,
                className: "p-3.5 rounded-2xl border border-emerald-300 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs",
                children: [
                  o.jsx("span", { className: "text-base", children: "💬" }),
                  o.jsx("span", { children: "Compartilhar no WhatsApp" })
                ]
              }),
              o.jsxs("button", {
                type: "button",
                onClick: handleEmailShare,
                className: "p-3.5 rounded-2xl border border-blue-300 bg-blue-50/80 hover:bg-blue-100 text-blue-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs",
                children: [
                  o.jsx("span", { className: "text-base", children: "✉" }),
                  o.jsx("span", { children: "Enviar por E-mail Corporativo" })
                ]
              }),
              o.jsxs("a", {
                href: regLink,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "p-3.5 rounded-2xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs text-center",
                children: [
                  o.jsx("span", { className: "text-base", children: "↗" }),
                  o.jsx("span", { children: "Testar Abertura do Formulário" })
                ]
              })
            ]
          })
        ]
      }),

      // QR Code Card & 3-Step Guide Grid
      o.jsxs("div", {
        className: "grid grid-cols-1 md:grid-cols-3 gap-6",
        children: [
          // QR Code Card
          o.jsxs("div", {
            className: "bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 text-center flex flex-col items-center justify-between space-y-4",
            children: [
              o.jsxs("div", {
                className: "space-y-1",
                children: [
                  o.jsx("span", { className: "w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm mx-auto mb-2", children: "📱" }),
                  o.jsx("h4", { className: "font-extrabold text-sm text-slate-900", children: "QR Code para Murais e Cartazes" }),
                  o.jsx("p", { className: "text-[11px] text-slate-500", children: "Os colaboradores podem escanear diretamente com a câmera do celular." })
                ]
              }),
              // Visual High-Resolution QR Code Graphic
              o.jsxs("div", {
                className: "p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-md inline-block my-2",
                children: [
                  o.jsxs("svg", {
                    className: "w-36 h-36 mx-auto",
                    viewBox: "0 0 100 100",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg",
                    children: [
                      o.jsx("rect", { width: "100", height: "100", fill: "white" }),
                      o.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M10 10h30v30H10V10zm6 6v18h18V16H16zm4 4h10v10H20V20zM60 10h30v30H60V10zm6 6v18h18V16H66zm4 4h10v10H70V20zM10 60h30v30H10V60zm6 6v18h18V66H16zm4 4h10v10H20V70z", fill: "#1e293b" }),
                      o.jsx("rect", { x: "46", y: "10", width: "8", height: "8", fill: "#2563eb" }),
                      o.jsx("rect", { x: "46", y: "24", width: "8", height: "14", fill: "#1e293b" }),
                      o.jsx("rect", { x: "46", y: "44", width: "8", height: "8", fill: "#2563eb" }),
                      o.jsx("rect", { x: "10", y: "46", width: "8", height: "8", fill: "#1e293b" }),
                      o.jsx("rect", { x: "24", y: "46", width: "14", height: "8", fill: "#1e293b" }),
                      o.jsx("rect", { x: "60", y: "46", width: "12", height: "8", fill: "#2563eb" }),
                      o.jsx("rect", { x: "78", y: "46", width: "12", height: "8", fill: "#1e293b" }),
                      o.jsx("rect", { x: "46", y: "60", width: "8", height: "14", fill: "#1e293b" }),
                      o.jsx("rect", { x: "60", y: "60", width: "14", height: "8", fill: "#1e293b" }),
                      o.jsx("rect", { x: "60", y: "74", width: "8", height: "16", fill: "#2563eb" }),
                      o.jsx("rect", { x: "74", y: "74", width: "16", height: "16", fill: "#1e293b" }),
                      o.jsx("rect", { x: "46", y: "80", width: "8", height: "10", fill: "#1e293b" })
                    ]
                  }),
                  o.jsx("span", { className: "text-[9px] font-mono text-slate-500 uppercase tracking-wider block mt-1", children: activeCompany.id })
                ]
              }),
              o.jsxs("button", {
                type: "button",
                onClick: () => window.print(),
                className: "w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer",
                children: ["🖨️ ", "Imprimir Cartaz com QR Code"]
              })
            ]
          }),

          // 3-Step Guide Card (takes 2 columns)
          o.jsxs("div", {
            className: "md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 flex flex-col justify-between space-y-6",
            children: [
              o.jsxs("div", {
                className: "space-y-1.5",
                children: [
                  o.jsx("h4", { className: "text-base font-extrabold text-slate-900", children: "Como Funciona o Fluxo de Cadastro e Avaliação (NR-1)?" }),
                  o.jsx("p", { className: "text-xs text-slate-500", children: "Procedimento estruturado conforme a Portaria MTE nº 1.419 e padrões éticos de sigilo do CFP." })
                ]
              }),
              o.jsxs("div", {
                className: "space-y-4",
                children: [
                  o.jsxs("div", {
                    className: "flex items-start gap-3.5 p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200",
                    children: [
                      o.jsx("div", { className: "w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs", children: "1" }),
                      o.jsxs("div", {
                        className: "space-y-0.5",
                        children: [
                          o.jsx("h5", { className: "text-xs font-bold text-blue-950", children: "Envio do Link aos Colaboradores" }),
                          o.jsx("p", { className: "text-[11px] text-blue-900 leading-relaxed", children: "O responsável ou RH encaminha o link aos funcionários por WhatsApp, e-mail corporativo ou disponibiliza o QR Code em áreas comuns." })
                        ]
                      })
                    ]
                  }),
                  o.jsxs("div", {
                    className: "flex items-start gap-3.5 p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200",
                    children: [
                      o.jsx("div", { className: "w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs", children: "2" }),
                      o.jsxs("div", {
                        className: "space-y-0.5",
                        children: [
                          o.jsx("h5", { className: "text-xs font-bold text-purple-950", children: "Autocadastro Seguro com Sigilo Blindado" }),
                          o.jsx("p", { className: "text-[11px] text-purple-900 leading-relaxed", children: "O colaborador preenche seus dados (nome, cargo, setor e identificador). Os dados individuais de saúde mental permanecem blindados sob a LGPD (Art. 12/13)." })
                        ]
                      })
                    ]
                  }),
                  o.jsxs("div", {
                    className: "flex items-start gap-3.5 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200",
                    children: [
                      o.jsx("div", { className: "w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs", children: "3" }),
                      o.jsxs("div", {
                        className: "space-y-0.5",
                        children: [
                          o.jsx("h5", { className: "text-xs font-bold text-emerald-950", children: "Acesso Imediato ao Questionário e Acolhimento" }),
                          o.jsx("p", { className: "text-[11px] text-emerald-900 leading-relaxed", children: "Assim que conclui o cadastro, o funcionário responde à pesquisa COPSOQ II-Br e tem acesso livre ao agendamento de atendimentos psicológicos preventivos." })
                        ]
                      })
                    ]
                  })
                ]
              }),
              // Responsible Employee Screens Actions
              o.jsxs("div", {
                className: "pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2",
                children: [
                  o.jsx("span", { className: "text-xs font-bold text-slate-700 mr-2", children: "Seu acesso como colaborador:" }),
                  o.jsxs("button", {
                    type: "button",
                    onClick: onNavigateToForm,
                    className: "px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs border border-purple-200 transition-colors flex items-center gap-1.5 cursor-pointer",
                    children: [o.jsx("span", { children: "📝" }), "Preencher Questionário"]
                  }),
                  o.jsxs("button", {
                    type: "button",
                    onClick: onNavigateToAppointments,
                    className: "px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer",
                    children: [o.jsx("span", { children: "📅" }), "Agendar Atendimento Psicológico"]
                  })
                ]
              })
            ]
          })
        ]
      }),

      // Registered Collaborators Real-Time Table
      o.jsxs("div", {
        className: "bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 space-y-4",
        children: [
          o.jsxs("div", {
            className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100",
            children: [
              o.jsxs("div", {
                children: [
                  o.jsxs("h4", {
                    className: "text-base font-extrabold text-slate-900 flex items-center gap-2",
                    children: [
                      o.jsx("span", { className: "w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold", children: "👥" }),
                      "Colaboradores Cadastrados Nesta Empresa"
                    ]
                  }),
                  o.jsx("p", { className: "text-xs text-slate-500", children: "Quadro de funcionários vinculados via link oficial que já podem participar das avaliações." })
                ]
              }),
              o.jsxs("div", {
                className: "flex items-center gap-2 text-xs",
                children: [
                  o.jsxs("span", { className: "px-3 py-1 rounded-xl bg-blue-50 text-blue-800 font-bold border border-blue-200", children: ["Total: ", employees.length] }),
                  o.jsxs("span", { className: "px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200", children: ["Respondidos: ", totalAnswered] }),
                  o.jsxs("button", {
                    type: "button",
                    onClick: loadEmployees,
                    disabled: loadingEmps,
                    className: "p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer",
                    title: "Atualizar lista agora",
                    children: loadingEmps ? "⏳" : "🔄"
                  })
                ]
              })
            ]
          }),

          // Search Bar
          o.jsxs("div", {
            className: "flex items-center gap-2",
            children: [
              o.jsx("input", {
                type: "text",
                value: searchTerm,
                onChange: e => setSearchTerm(e.target.value),
                placeholder: "Buscar colaborador por nome, cargo ou setor...",
                className: "w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              })
            ]
          }),

          // Employees Table
          filteredEmps.length === 0 ? o.jsxs("div", {
            className: "text-center py-10 px-4 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200 text-slate-500 space-y-2",
            children: [
              o.jsx("div", { className: "text-3xl", children: "👥" }),
              o.jsx("p", { className: "text-xs font-semibold", children: employees.length === 0 ? "Nenhum colaborador cadastrado ainda nesta empresa." : "Nenhum colaborador encontrado para a busca." }),
              o.jsx("p", { className: "text-[11px] text-slate-400 max-w-sm mx-auto", children: "Copie o link acima e envie para seus funcionários. Conforme eles se cadastrarem, aparecerão listados aqui automaticamente." }),
              o.jsx("button", {
                type: "button",
                onClick: handleCopyLink,
                className: "mt-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer",
                children: "Copiar Link para Começar"
              })
            ]
          }) : o.jsx("div", {
            className: "overflow-x-auto",
            children: o.jsxs("table", {
              className: "w-full text-left text-xs border-collapse",
              children: [
                o.jsx("thead", {
                  children: o.jsxs("tr", {
                    className: "border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider",
                    children: [
                      o.jsx("th", { className: "py-2.5 px-3", children: "Colaborador" }),
                      o.jsx("th", { className: "py-2.5 px-3", children: "Cargo / Função" }),
                      o.jsx("th", { className: "py-2.5 px-3", children: "Setor / Área" }),
                      o.jsx("th", { className: "py-2.5 px-3", children: "Status Questionário" }),
                      o.jsx("th", { className: "py-2.5 px-3", children: "Data do Cadastro" })
                    ]
                  })
                }),
                o.jsx("tbody", {
                  className: "divide-y divide-slate-100",
                  children: filteredEmps.map(emp => o.jsxs("tr", {
                    key: emp.id,
                    className: "hover:bg-blue-50/30 transition-colors",
                    children: [
                      o.jsxs("td", {
                        className: "py-2.5 px-3 font-semibold text-slate-900 flex items-center gap-2",
                        children: [
                          o.jsx("span", { className: "w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]", children: (emp.name || "C")[0] }),
                          emp.name
                        ]
                      }),
                      o.jsx("td", { className: "py-2.5 px-3 text-slate-600", children: emp.roleCategory || "Colaborador" }),
                      o.jsx("td", { className: "py-2.5 px-3 text-slate-600", children: emp.department || "Geral" }),
                      o.jsx("td", {
                        className: "py-2.5 px-3",
                        children: emp.surveyFilled ? o.jsx("span", { className: "px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]", children: "✓ Respondido" }) : o.jsx("span", { className: "px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]", children: "⏳ Pendente" })
                      }),
                      o.jsx("td", { className: "py-2.5 px-3 text-slate-400 text-[11px]", children: emp.registeredAt ? new Date(emp.registeredAt).toLocaleDateString("pt-BR") : "Hoje" })
                    ]
                  }))
                })
              ]
            })
          })
        ]
      })
    ]
  });
};
`;

if (!code.includes('const CompanyCollaboratorsLinkScreen =')) {
  // Inject component right before function iL()
  code = code.replace('function iL()', collaboratorsScreenComponent + '\nfunction iL()');
  console.log('1. Added CompanyCollaboratorsLinkScreen component');
} else {
  console.log('1. CompanyCollaboratorsLinkScreen already present');
}

fs.writeFileSync(filePath, code);
console.log('Saved step 1. New size:', fs.statSync(filePath).size);
