import fs from 'fs';

const filePath = './src/index-lkSxDUTb.js';
let code = fs.readFileSync(filePath, 'utf8');

console.log('Current size:', code.length);

const psychologistsComponentCode = `
const PsychologistsManagement = ({ schools = [], appointments = [], currentSlots = [], onRefreshSlots }) => {
  const [psychologists, setPsychologists] = ee.useState([]);
  const [loading, setLoading] = ee.useState(true);
  const [selectedPsiId, setSelectedPsiId] = ee.useState("");
  const [showAddModal, setShowAddModal] = ee.useState(false);
  const [successMsg, setSuccessMsg] = ee.useState(null);
  const [errorMsg, setErrorMsg] = ee.useState(null);
  const [submitting, setSubmitting] = ee.useState(false);

  // Formulário de novo psicólogo
  const [formData, setFormData] = ee.useState({
    name: "",
    email: "",
    crp: "",
    specialty: "Psicologia Organizacional & Saúde Mental do Trabalho",
    phone: "",
    color: "#818cf8"
  });

  const loadPsychologists = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/psychologists');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPsychologists(data);
        if (data.length > 0 && !selectedPsiId) {
          setSelectedPsiId(data[0].id);
        }
      }
    } catch (e) {
      console.warn("Erro ao carregar psicólogos:", e);
    } finally {
      setLoading(false);
    }
  };

  ee.useEffect(() => {
    loadPsychologists();
  }, []);

  const handleCreate = async (e) => {
    if (e) e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.crp.trim()) {
      setErrorMsg("Nome completo, e-mail Google e CRP são obrigatórios.");
      return;
    }
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/psychologists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(data.message || "Psicólogo cadastrado e integrado com sucesso!");
        setShowAddModal(false);
        setFormData({
          name: "",
          email: "",
          crp: "",
          specialty: "Psicologia Organizacional & Saúde Mental do Trabalho",
          phone: "",
          color: "#818cf8"
        });
        await loadPsychologists();
        if (data.psychologist && data.psychologist.id) {
          setSelectedPsiId(data.psychologist.id);
        }
        setTimeout(() => setSuccessMsg(null), 6000);
      } else {
        setErrorMsg(data.error || "Erro ao cadastrar psicólogo.");
      }
    } catch (err) {
      setErrorMsg("Erro de comunicação com o servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(\`Deseja realmente remover o credenciamento de \${name}?\`)) return;
    try {
      const res = await fetch(\`/api/psychologists/\${id}\`, { method: 'DELETE' });
      if (res.ok) {
        await loadPsychologists();
        if (selectedPsiId === id) setSelectedPsiId("");
      }
    } catch (e) {
      alert("Erro ao remover psicólogo.");
    }
  };

  const selectedPsi = psychologists.find(p => p.id === selectedPsiId) || psychologists[0];

  // Sessões atribuídas ao psicólogo selecionado
  const psiAppointments = appointments.filter(a =>
    selectedPsi && (
      (a.specialistName && a.specialistName.toLowerCase().includes(selectedPsi.name.toLowerCase())) ||
      (selectedPsi.name.toLowerCase().includes((a.specialistName || '').toLowerCase())) ||
      (a.psychologistEmail && a.psychologistEmail.toLowerCase() === selectedPsi.email.toLowerCase())
    )
  );

  // Sessões da agenda do Administrador (chicojambs@gmail.com)
  const admEmail = "chicojambs@gmail.com";

  return o.jsxs("div", {
    className: "space-y-6 text-slate-900",
    children: [
      // Notificação de feedback de sucesso
      successMsg && o.jsxs("div", {
        className: "p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 animate-in fade-in shadow-xs",
        children: [
          o.jsxs("div", {
            className: "flex items-center gap-2.5",
            children: [
              o.jsx("span", { className: "text-lg", children: "✅" }),
              o.jsx("span", { children: successMsg })
            ]
          }),
          o.jsx("button", {
            onClick: () => setSuccessMsg(null),
            className: "text-emerald-700 hover:text-emerald-900 text-xs font-bold cursor-pointer",
            children: "✕"
          })
        ]
      }),

      // Banner Principal em Tons Pastéis
      o.jsxs("div", {
        className: "p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-indigo-50/90 via-purple-50/70 to-pink-50/60 border border-purple-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
        children: [
          o.jsxs("div", {
            className: "space-y-1.5",
            children: [
              o.jsxs("div", {
                className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-purple-200 text-purple-900 text-[11px] font-bold uppercase tracking-wider",
                children: [
                  o.jsx("span", { children: "🧠" }),
                  o.jsx("span", { children: "Corpo Clínico & Google Calendar Integrado" })
                ]
              }),
              o.jsx("h3", {
                className: "text-xl sm:text-2xl font-black text-slate-900 tracking-tight",
                children: "Cadastro de Psicólogos & Agendas Integradas"
              }),
              o.jsxs("p", {
                className: "text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed",
                children: [
                  "Ao cadastrar um novo psicólogo, o sistema envia e sincroniza automaticamente a integração com o ",
                  o.jsx("strong", { className: "text-slate-800", children: "Google Calendário da conta do Administrador (chicojambs@gmail.com)" }),
                  ". As sessões no Google Meet são compartilhadas entre ambos com ",
                  o.jsx("strong", { className: "text-slate-800", children: "acesso simultâneo de Host / Co-Organizador" }),
                  "."
                ]
              })
            ]
          }),
          o.jsxs("button", {
            type: "button",
            onClick: () => { setErrorMsg(null); setShowAddModal(true); },
            className: "px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer min-h-[44px]",
            children: [
              o.jsx("span", { className: "text-base", children: "➕" }),
              o.jsx("span", { children: "Cadastrar Novo Psicólogo" })
            ]
          })
        ]
      }),

      // Cartões de Psicólogos Cadastrados
      o.jsxs("div", {
        className: "bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-4",
        children: [
          o.jsxs("div", {
            className: "flex items-center justify-between pb-3 border-b border-slate-100",
            children: [
              o.jsxs("div", {
                className: "flex items-center gap-2",
                children: [
                  o.jsx("span", { className: "text-base", children: "👥" }),
                  o.jsx("h4", { className: "text-sm sm:text-base font-bold text-slate-900", children: "Psicólogos Credenciados & Ativos" }),
                  o.jsxs("span", { className: "px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-black", children: [psychologists.length] })
                ]
              }),
              o.jsx("span", { className: "text-xs text-slate-500 hidden sm:inline font-medium", children: "Integração automática com Google Calendar & Meet" })
            ]
          }),

          loading ? o.jsxs("div", {
            className: "py-10 text-center text-slate-400 text-xs font-semibold",
            children: [
              o.jsx("span", { className: "inline-block animate-spin text-xl mb-2", children: "⏳" }),
              o.jsx("p", { children: "Carregando psicólogos credenciados..." })
            ]
          }) : psychologists.length === 0 ? o.jsxs("div", {
            className: "py-10 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2",
            children: [
              o.jsx("p", { className: "text-sm font-bold text-slate-700", children: "Nenhum psicólogo cadastrado ainda" }),
              o.jsx("p", { className: "text-xs text-slate-500", children: "Clique no botão acima para cadastrar o primeiro profissional." })
            ]
          }) : o.jsx("div", {
            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5",
            children: psychologists.map(p => {
              const isSelected = selectedPsi && selectedPsi.id === p.id;
              return o.jsxs("div", {
                className: \`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 \${isSelected ? "bg-purple-50/80 border-purple-300 ring-2 ring-purple-300/40 shadow-xs" : "bg-white border-slate-200 hover:border-purple-200 hover:shadow-xs"}\`,
                children: [
                  o.jsxs("div", {
                    className: "space-y-1.5",
                    children: [
                      o.jsxs("div", {
                        className: "flex items-start justify-between gap-2",
                        children: [
                          o.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [
                              o.jsx("div", {
                                className: "w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-slate-900 border shrink-0",
                                style: { backgroundColor: p.color || "#e0e7ff", borderColor: "#c7d2fe" },
                                children: "Ψ"
                              }),
                              o.jsxs("div", {
                                children: [
                                  o.jsx("h5", { className: "text-sm font-bold text-slate-900 leading-tight", children: p.name }),
                                  o.jsx("span", { className: "text-[11px] text-purple-700 font-bold", children: p.crp })
                                ]
                              })
                            ]
                          }),
                          o.jsx("span", {
                            className: "px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider shrink-0",
                            children: "Ativo"
                          })
                        ]
                      }),
                      o.jsx("p", { className: "text-xs text-slate-600 line-clamp-2", children: p.specialty }),
                      o.jsxs("div", {
                        className: "pt-1 text-[11px] text-slate-500 font-mono truncate",
                        children: ["📧 ", p.email]
                      })
                    ]
                  }),

                  o.jsxs("div", {
                    className: "pt-2 border-t border-slate-100 flex items-center justify-between gap-2",
                    children: [
                      o.jsxs("button", {
                        type: "button",
                        onClick: () => setSelectedPsiId(p.id),
                        className: \`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer \${isSelected ? "bg-purple-700 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}\`,
                        children: [isSelected ? "✓ Visualizando Agenda" : "Comparar Agenda"]
                      }),
                      o.jsxs("div", {
                        className: "flex items-center gap-1.5",
                        children: [
                          o.jsx("a", {
                            href: \`https://calendar.google.com/calendar/render?action=TEMPLATE&text=\${encodeURIComponent("Acolhimento NR-1 • " + p.name)}&add=\${encodeURIComponent(admEmail)},\${encodeURIComponent(p.email)}\`,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors cursor-pointer",
                            title: "Abrir Google Calendar sincronizado (Adm + Psicólogo)",
                            children: "📅"
                          }),
                          o.jsx("button", {
                            type: "button",
                            onClick: () => handleDelete(p.id, p.name),
                            className: "p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs transition-colors cursor-pointer",
                            title: "Remover Psicólogo",
                            children: "🗑️"
                          })
                        ]
                      })
                    ]
                  })
                ]
              }, p.id);
            })
          })
        ]
      }),

      // =========================================================================
      // SEÇÃO: VISUALIZAÇÃO EXCLUSIVA DAS DUAS AGENDAS (ADM & PSICÓLOGO)
      // =========================================================================
      selectedPsi && o.jsxs("div", {
        className: "bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6",
        children: [
          // Cabeçalho da visualização dual
          o.jsxs("div", {
            className: "flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100",
            children: [
              o.jsxs("div", {
                className: "space-y-1",
                children: [
                  o.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [
                      o.jsx("span", { className: "text-base", children: "⚖️" }),
                      o.jsx("h4", { className: "text-base sm:text-lg font-black text-slate-900 tracking-tight", children: "Visualização Exclusiva das Duas Agendas" }),
                      o.jsx("span", { className: "px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 text-[11px] font-bold", children: "Adm + Psicólogo" })
                    ]
                  }),
                  o.jsxs("p", {
                    className: "text-xs text-slate-500",
                    children: [
                      "Exibindo lado a lado a agenda do Administrador (",
                      o.jsx("strong", { className: "text-slate-800", children: admEmail }),
                      ") e do Psicólogo credenciado (",
                      o.jsx("strong", { className: "text-purple-700", children: selectedPsi.name }),
                      " - ",
                      selectedPsi.email,
                      ")."
                    ]
                  })
                ]
              }),

              // Seletor de qual psicólogo exibir
              o.jsxs("div", {
                className: "flex items-center gap-2 shrink-0",
                children: [
                  o.jsx("span", { className: "text-xs font-semibold text-slate-600", children: "Alternar Psicólogo:" }),
                  o.jsx("select", {
                    value: selectedPsi.id,
                    onChange: e => setSelectedPsiId(e.target.value),
                    className: "text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-purple-200 bg-purple-50/50 font-bold text-purple-950 outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer",
                    children: psychologists.map(p => o.jsx("option", { value: p.id, children: \`\${p.name} (\${p.crp})\` }, p.id))
                  })
                ]
              })
            ]
          }),

          // As Duas Agendas Lado a Lado
          o.jsxs("div", {
            className: "grid grid-cols-1 lg:grid-cols-2 gap-5",
            children: [
              // AGENDA 1: ADMINISTRADOR (chicojambs@gmail.com)
              o.jsxs("div", {
                className: "p-4 sm:p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 space-y-4 flex flex-col justify-between",
                children: [
                  o.jsxs("div", {
                    className: "space-y-3",
                    children: [
                      o.jsxs("div", {
                        className: "flex items-center justify-between",
                        children: [
                          o.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [
                              o.jsx("div", { className: "w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs", children: "ADM" }),
                              o.jsxs("div", {
                                children: [
                                  o.jsx("h5", { className: "text-sm font-bold text-slate-900", children: "Agenda do Administrador Geral" }),
                                  o.jsx("span", { className: "text-[11px] font-mono text-indigo-700 font-semibold", children: admEmail })
                                ]
                              })
                            ]
                          }),
                          o.jsx("span", { className: "px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-bold uppercase", children: "Host Principal" })
                        ]
                      }),

                      o.jsxs("div", {
                        className: "p-3 rounded-xl bg-white border border-indigo-100 text-xs space-y-1.5 text-slate-700",
                        children: [
                          o.jsxs("div", { className: "flex justify-between", children: [o.jsx("span", { className: "text-slate-500", children: "Status Google Calendar:" }), o.jsx("span", { className: "font-bold text-emerald-700", children: "✓ Sincronizado em Nuvem" })] }),
                          o.jsxs("div", { className: "flex justify-between", children: [o.jsx("span", { className: "text-slate-500", children: "Total de Atendimentos Supervisionados:" }), o.jsxs("span", { className: "font-bold text-slate-900", children: [appointments.length, " sessões"] })] }),
                          o.jsxs("div", { className: "flex justify-between", children: [o.jsx("span", { className: "text-slate-500", children: "Permissão Meet:" }), o.jsx("span", { className: "font-bold text-indigo-700", children: "Acesso de Host Integral" })] })
                        ]
                      }),

                      // Lista compacta dos próximos atendimentos supervisionados
                      o.jsxs("div", {
                        className: "space-y-2",
                        children: [
                          o.jsx("span", { className: "text-[11px] font-bold text-slate-600 uppercase tracking-wider block", children: "Próximos Acolhimentos sob Supervisão do Adm:" }),
                          appointments.slice(0, 3).length === 0 ? o.jsx("p", { className: "text-xs text-slate-400 italic py-2", children: "Nenhuma sessão agendada no momento." }) : appointments.slice(0, 3).map(a => o.jsxs("div", {
                            className: "p-2.5 rounded-xl bg-white/90 border border-indigo-100 flex items-center justify-between text-xs",
                            children: [
                              o.jsxs("div", {
                                children: [
                                  o.jsxs("span", { className: "font-bold text-slate-900 block", children: [\`\${a.date} às \${a.time}\`] }),
                                  o.jsxs("span", { className: "text-[11px] text-slate-500", children: [a.specialistName, " • ", a.companyName || "Empresa"] })
                                ]
                              }),
                              o.jsx("span", { className: "px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono", children: "Host: Adm" })
                            ]
                          }, a.id))
                        ]
                      })
                    ]
                  }),

                  o.jsxs("a", {
                    href: "https://calendar.google.com/calendar",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer",
                    children: [
                      o.jsx("span", { children: "📅" }),
                      o.jsx("span", { children: "Abrir Google Agenda do Administrador" })
                    ]
                  })
                ]
              }),

              // AGENDA 2: PSICÓLOGO SELECIONADO
              o.jsxs("div", {
                className: "p-4 sm:p-5 rounded-2xl bg-purple-50/50 border border-purple-200/80 space-y-4 flex flex-col justify-between",
                children: [
                  o.jsxs("div", {
                    className: "space-y-3",
                    children: [
                      o.jsxs("div", {
                        className: "flex items-center justify-between",
                        children: [
                          o.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [
                              o.jsx("div", {
                                className: "w-8 h-8 rounded-xl text-slate-900 font-bold flex items-center justify-center text-xs shadow-xs border",
                                style: { backgroundColor: selectedPsi.color || "#f3e8ff", borderColor: "#d8b4fe" },
                                children: "PSI"
                              }),
                              o.jsxs("div", {
                                children: [
                                  o.jsx("h5", { className: "text-sm font-bold text-slate-900", children: selectedPsi.name }),
                                  o.jsxs("span", { className: "text-[11px] font-mono text-purple-700 font-semibold", children: [selectedPsi.crp, " • ", selectedPsi.email] })
                                ]
                              })
                            ]
                          }),
                          o.jsx("span", { className: "px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold uppercase", children: "Co-Host Meet" })
                        ]
                      }),

                      o.jsxs("div", {
                        className: "p-3 rounded-xl bg-white border border-purple-100 text-xs space-y-1.5 text-slate-700",
                        children: [
                          o.jsxs("div", { className: "flex justify-between", children: [o.jsx("span", { className: "text-slate-500", children: "Integração com Google Calendar do Adm:" }), o.jsx("span", { className: "font-bold text-emerald-700", children: "✓ Sincronizada" })] }),
                          o.jsxs("div", { className: "flex justify-between", children: [o.jsx("span", { className: "text-slate-500", children: "Sessões Atribuídas ao Psicólogo:" }), o.jsxs("span", { className: "font-bold text-purple-950", children: [psiAppointments.length, " sessões"] })] }),
                          o.jsxs("div", { className: "flex justify-between", children: [o.jsx("span", { className: "text-slate-500", children: "Permissão Meet:" }), o.jsx("span", { className: "font-bold text-purple-800", children: "Acesso de Host Compartilhado" })] })
                        ]
                      }),

                      // Lista compacta dos acolhimentos deste psicólogo
                      o.jsxs("div", {
                        className: "space-y-2",
                        children: [
                          o.jsxs("span", { className: "text-[11px] font-bold text-slate-600 uppercase tracking-wider block", children: ["Sessões da Agenda de ", selectedPsi.name, ":"] }),
                          psiAppointments.length === 0 ? o.jsx("p", { className: "text-xs text-slate-400 italic py-2", children: "Nenhum atendimento agendado para este psicólogo ainda." }) : psiAppointments.slice(0, 3).map(a => o.jsxs("div", {
                            className: "p-2.5 rounded-xl bg-white/90 border border-purple-100 flex items-center justify-between text-xs",
                            children: [
                              o.jsxs("div", {
                                children: [
                                  o.jsxs("span", { className: "font-bold text-slate-900 block", children: [\`\${a.date} às \${a.time}\`] }),
                                  o.jsxs("span", { className: "text-[11px] text-slate-500", children: ["Colaborador: ", a.employeeName || "Confidencial"] })
                                ]
                              }),
                              o.jsx("span", { className: "px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 font-mono", children: "Co-Host Ativo" })
                            ]
                          }, a.id))
                        ]
                      })
                    ]
                  }),

                  o.jsxs("a", {
                    href: \`https://calendar.google.com/calendar/render?action=TEMPLATE&text=\${encodeURIComponent("Acolhimento NR-1 • " + selectedPsi.name)}&add=\${encodeURIComponent(admEmail)},\${encodeURIComponent(selectedPsi.email)}\`,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "w-full py-2.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer",
                    children: [
                      o.jsx("span", { children: "📅" }),
                      o.jsx("span", { children: "Abrir Google Agenda do Psicólogo" })
                    ]
                  })
                ]
              })
            ]
          }),

          // SESSÕES COMPARTILHADAS NO GOOGLE MEET COM ACESSO DE HOST
          o.jsxs("div", {
            className: "p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3.5",
            children: [
              o.jsxs("div", {
                className: "flex items-center justify-between",
                children: [
                  o.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [
                      o.jsx("span", { className: "text-base", children: "🎥" }),
                      o.jsx("h5", { className: "text-sm sm:text-base font-bold text-slate-900", children: "Sessões no Google Meet Compartilhadas com Acesso de Host" })
                    ]
                  }),
                  o.jsxs("span", { className: "text-xs font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200", children: ["Total Compartilhadas: ", appointments.length] })
                ]
              }),

              appointments.length === 0 ? o.jsxs("div", {
                className: "py-8 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-200",
                children: [
                  o.jsx("p", { className: "text-xs font-semibold", children: "Nenhuma sessão agendada no Google Meet ainda." }),
                  o.jsx("p", { className: "text-[11px] text-slate-400 mt-1", children: "Quando um colaborador agendar, o link do Meet será gerado com acesso de Host para o Adm e o Psicólogo." })
                ]
              }) : o.jsx("div", {
                className: "space-y-3",
                children: appointments.map(appt => {
                  const psi = psychologists.find(p => (appt.specialistName && p.name && (p.name.includes(appt.specialistName) || appt.specialistName.includes(p.name)))) || selectedPsi;
                  const meetUrl = appt.bookingUrl || "https://meet.google.com/new";
                  const calendarAddUrl = \`https://calendar.google.com/calendar/render?action=TEMPLATE&text=\${encodeURIComponent("Sessão Teleacolhimento NR-1 • " + appt.specialistName)}&details=\${encodeURIComponent("Acolhimento individual confidencial (NR-1 / PGR).\\nLink Meet: " + meetUrl + "\\nAnfitriões com acesso de Host:\\n- " + admEmail + "\\n- " + (psi ? psi.email : selectedPsi.email))}&location=\${encodeURIComponent(meetUrl)}&add=\${encodeURIComponent(admEmail)},\${encodeURIComponent(psi ? psi.email : selectedPsi.email)}\`;

                  return o.jsxs("div", {
                    className: "p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-3 flex flex-col md:flex-row md:items-center justify-between gap-3",
                    children: [
                      o.jsxs("div", {
                        className: "space-y-1",
                        children: [
                          o.jsxs("div", {
                            className: "flex flex-wrap items-center gap-2",
                            children: [
                              o.jsxs("span", { className: "font-bold text-slate-900 text-sm", children: [appt.date, " às ", appt.time] }),
                              o.jsx("span", { className: "text-xs text-slate-500", children: \`(\${appt.durationMinutes || 50} min)\` }),
                              o.jsx("span", { className: "px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase", children: "Confirmado" })
                            ]
                          }),
                          o.jsxs("p", {
                            className: "text-xs text-slate-700",
                            children: [
                              "Especialista: ",
                              o.jsx("strong", { className: "text-slate-900", children: appt.specialistName }),
                              " • Colaborador: ",
                              o.jsx("span", { className: "font-mono text-slate-600", children: appt.employeeName || "Confidencial LGPD" })
                            ]
                          }),
                          o.jsxs("div", {
                            className: "flex flex-wrap items-center gap-1.5 pt-1 text-[11px]",
                            children: [
                              o.jsx("span", { className: "font-bold text-slate-600", children: "Acesso de Host Compartilhado:" }),
                              o.jsxs("span", { className: "px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-900 font-mono font-bold", children: ["👑 Host 1: ", admEmail] }),
                              o.jsxs("span", { className: "px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-purple-900 font-mono font-bold", children: ["👑 Host 2: ", psi ? psi.email : selectedPsi.email] })
                            ]
                          })
                        ]
                      }),

                      o.jsxs("div", {
                        className: "flex items-center gap-2 shrink-0 pt-2 md:pt-0",
                        children: [
                          o.jsxs("a", {
                            href: calendarAddUrl,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 flex items-center gap-1.5 transition-colors cursor-pointer",
                            title: "Adicionar aos dois Google Calendários (Adm + Psicólogo)",
                            children: [
                              o.jsx("span", { children: "📅" }),
                              o.jsx("span", { className: "hidden sm:inline", children: "Google Agenda (Adm + Psi)" })
                            ]
                          }),
                          o.jsxs("a", {
                            href: meetUrl,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer",
                            title: "Entrar na sala de acolhimento do Google Meet com acesso de Host",
                            children: [
                              o.jsx("span", { children: "🎥" }),
                              o.jsx("span", { children: "Entrar no Meet (Host)" })
                            ]
                          })
                        ]
                      })
                    ]
                  }, appt.id);
                })
              })
            ]
          })
        ]
      }),

      // =========================================================================
      // MODAL: CADASTRO DE NOVO PSICÓLOGO
      // =========================================================================
      showAddModal && o.jsx("div", {
        className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto",
        children: o.jsxs("div", {
          className: "bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-purple-200 relative my-auto animate-in fade-in zoom-in-95 duration-150 space-y-5",
          children: [
            o.jsxs("div", {
              className: "flex items-start justify-between pb-3 border-b border-slate-100",
              children: [
                o.jsxs("div", {
                  children: [
                    o.jsxs("div", {
                      className: "flex items-center gap-2",
                      children: [
                        o.jsx("span", { className: "text-lg", children: "🧠" }),
                        o.jsx("h3", { className: "text-lg font-black text-slate-900 tracking-tight", children: "Cadastrar Novo Psicólogo" })
                      ]
                    }),
                    o.jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: "Integração automática com o Google Calendário da conta do Adm." })
                  ]
                }),
                o.jsx("button", {
                  type: "button",
                  onClick: () => setShowAddModal(false),
                  className: "p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer",
                  children: "✕"
                })
              ]
            }),

            o.jsxs("form", {
              onSubmit: handleCreate,
              className: "space-y-4",
              children: [
                o.jsxs("div", {
                  className: "space-y-1 text-left",
                  children: [
                    o.jsx("label", { className: "text-xs font-semibold text-slate-700", children: "Nome Completo com Titulação:" }),
                    o.jsx("input", {
                      type: "text",
                      required: true,
                      placeholder: "Ex: Dra. Mariana Vasconcelos",
                      value: formData.name,
                      onChange: e => setFormData({ ...formData, name: e.target.value }),
                      className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 text-xs text-slate-900 outline-none"
                    })
                  ]
                }),

                o.jsxs("div", {
                  className: "space-y-1 text-left",
                  children: [
                    o.jsx("label", { className: "text-xs font-semibold text-slate-700", children: "E-mail Google do Psicólogo (Gmail / Workspace):" }),
                    o.jsx("input", {
                      type: "email",
                      required: true,
                      placeholder: "exemplo.psicologo@gmail.com",
                      value: formData.email,
                      onChange: e => setFormData({ ...formData, email: e.target.value }),
                      className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 text-xs text-slate-900 outline-none font-mono"
                    }),
                    o.jsx("span", { className: "text-[11px] text-slate-500", children: "* Necessário conta Google para recebimento automático do convite de agenda e acesso co-host no Meet." })
                  ]
                }),

                o.jsxs("div", {
                  className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
                  children: [
                    o.jsxs("div", {
                      className: "space-y-1 text-left",
                      children: [
                        o.jsx("label", { className: "text-xs font-semibold text-slate-700", children: "Registro CRP:" }),
                        o.jsx("input", {
                          type: "text",
                          required: true,
                          placeholder: "Ex: CRP 06/184920",
                          value: formData.crp,
                          onChange: e => setFormData({ ...formData, crp: e.target.value }),
                          className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 text-xs text-slate-900 outline-none font-semibold"
                        })
                      ]
                    }),
                    o.jsxs("div", {
                      className: "space-y-1 text-left",
                      children: [
                        o.jsx("label", { className: "text-xs font-semibold text-slate-700", children: "Telefone / WhatsApp:" }),
                        o.jsx("input", {
                          type: "text",
                          placeholder: "(11) 98765-4321",
                          value: formData.phone,
                          onChange: e => setFormData({ ...formData, phone: e.target.value }),
                          className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 text-xs text-slate-900 outline-none"
                        })
                      ]
                    })
                  ]
                }),

                o.jsxs("div", {
                  className: "space-y-1 text-left",
                  children: [
                    o.jsx("label", { className: "text-xs font-semibold text-slate-700", children: "Especialidade / Abordagem Clínica:" }),
                    o.jsx("input", {
                      type: "text",
                      placeholder: "Ex: TCC, Saúde Mental no Trabalho, Estresse Ocupacional",
                      value: formData.specialty,
                      onChange: e => setFormData({ ...formData, specialty: e.target.value }),
                      className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 text-xs text-slate-900 outline-none"
                    })
                  ]
                }),

                // Caixa explicativa do envio automático
                o.jsxs("div", {
                  className: "p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs space-y-1",
                  children: [
                    o.jsxs("div", {
                      className: "flex items-center gap-1.5 font-bold text-indigo-900",
                      children: [
                        o.jsx("span", { children: "⚡" }),
                        o.jsx("span", { children: "Sincronização Automática com a Conta do Adm:" })
                      ]
                    }),
                    o.jsxs("p", {
                      className: "text-[11px] text-indigo-800 leading-relaxed",
                      children: [
                        "Ao salvar, a plataforma envia automaticamente a integração para o ",
                        o.jsx("strong", { children: "Google Calendário da conta chicojambs@gmail.com" }),
                        ". Todas as sessões agendadas no Google Meet passarão a contar com ",
                        o.jsx("strong", { children: "acesso de host para ambos" }),
                        "."
                      ]
                    })
                  ]
                }),

                errorMsg && o.jsx("div", {
                  className: "p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center",
                  children: errorMsg
                }),

                o.jsxs("div", {
                  className: "pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100",
                  children: [
                    o.jsx("button", {
                      type: "button",
                      onClick: () => setShowAddModal(false),
                      className: "px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer",
                      children: "Cancelar"
                    }),
                    o.jsxs("button", {
                      type: "submit",
                      disabled: submitting,
                      className: "px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50",
                      children: [
                        o.jsx("span", { children: submitting ? "Integrando..." : "Salvar e Sincronizar Google Agenda" })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        })
      })
    ]
  });
};
`;

// Inserir PsychologistsManagement antes de Q4
const q4Start = "Q4=({schools:n,defaultCompanyId:t})=>";
if (code.includes(q4Start)) {
  code = code.replace(q4Start, `${psychologistsComponentCode}\n${q4Start}`);
  console.log('Successfully injected PsychologistsManagement component before Q4!');
} else {
  console.error('Error: Could not find Q4 definition');
  process.exit(1);
}

// Inserir renderização da aba T==="psychologists" dentro de Q4
const controlTabRender = 'T==="control"&&o.jsx("div",{className:"bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden",children:o.jsx(K4,{schools:n})}),';
const psychologistsTabRender = 'T==="psychologists"&&o.jsx("div",{className:"bg-white rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-6",children:o.jsx(PsychologistsManagement,{schools:n,appointments:x,currentSlots:d,onRefreshSlots:_e})}),';

if (code.includes(controlTabRender)) {
  code = code.replace(controlTabRender, `${psychologistsTabRender}${controlTabRender}`);
  console.log('Successfully connected T==="psychologists" tab inside Q4!');
} else {
  console.error('Error: Could not find controlTabRender inside Q4');
  process.exit(1);
}

fs.writeFileSync(filePath, code);
console.log('Finished injection! New size:', code.length);
