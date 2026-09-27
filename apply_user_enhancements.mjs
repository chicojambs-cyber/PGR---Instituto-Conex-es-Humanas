import fs from 'fs';
import esbuild from 'esbuild';

const filePath = './src/index-lkSxDUTb.js';
let code = fs.readFileSync(filePath, 'utf8');

console.log('Original code size:', code.length);

// =========================================================================
// 1. FIX NOTIFICATION BANNER TOGGLE (Immediate, non-blocking sync activation)
// =========================================================================
const origKe = `const Ke=async()=>{  try {    if (Xi && typeof Xi.requestPermission === "function") {      await Xi.requestPermission();    }    if (Xi && typeof Xi.playChime === "function") {      Xi.playChime();    }    localStorage.setItem("psicosafe_notifications_enabled", "true");  } catch {}  se("granted");  setNotifActive(true);  ge("Notificações Ativadas com sucesso! Você receberá um aviso sonoro e notificação 10 min antes.");  setTimeout(()=>ge(null), 4000);};`;

const newKe = `const Ke=()=>{  try {    localStorage.setItem("psicosafe_notifications_enabled", "true");  } catch {}  setNotifActive(true);  se("granted");  ge("Notificações Ativadas com sucesso! Você receberá um aviso sonoro e notificação 10 min antes.");  setTimeout(()=>ge(null), 4000);  try {    if (Xi && typeof Xi.playChime === "function") Xi.playChime();    if (typeof Notification !== "undefined" && typeof Notification.requestPermission === "function") {      Notification.requestPermission().catch(()=>{});    }  } catch {} };`;

if (code.includes('const Ke=async()=>{')) {
  code = code.replace(origKe, newKe);
  console.log('1. Applied instant sync notification activation in Ke');
}

// =========================================================================
// 2. INSERT CLOSE BUTTONS IN WINDOWS/MODALS THAT LACKED THEM
// =========================================================================

// 2a. Confirm Appointment Modal (Confirmar Horário de Atendimento)
const origBookingFormHeader = `o.jsxs("div",{className:"flex items-center gap-3 pb-3 border-b border-slate-100",children:[o.jsx("div",{className:"w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0",children:o.jsx(Yl,{className:"w-5 h-5"})}),o.jsxs("div",{children:[o.jsx("h3",{className:"text-base sm:text-lg font-bold text-slate-900",children:"Confirmar Horário de Atendimento"}),o.jsx("p",{className:"text-xs text-slate-500",children:"O link oficial será aberto e um lembrete será enviado 10 min antes"})]})]})`;

const newBookingFormHeader = `o.jsxs("div",{className:"flex items-center justify-between pb-3 border-b border-slate-100",children:[o.jsxs("div",{className:"flex items-center gap-3",children:[o.jsx("div",{className:"w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0",children:o.jsx(Yl,{className:"w-5 h-5"})}),o.jsxs("div",{children:[o.jsx("h3",{className:"text-base sm:text-lg font-bold text-slate-900",children:"Confirmar Horário de Atendimento"}),o.jsx("p",{className:"text-xs text-slate-500",children:"O link oficial será aberto e um lembrete será enviado 10 min antes"})]})]}),o.jsx("button",{type:"button",onClick:async()=>{if(R&&R.id){try{await os.unlockSlot(R.id,window.__currentSlotSession);h(Ct=>Ct.map(Je=>Je.id===R.id?{...Je,status:"available"}:Je));}catch{}}J(!1);G(null);_e();},className:"p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer","aria-label":"Fechar",title:"Fechar Janela",children:o.jsx(Zl,{className:"w-5 h-5"})})]})`;

if (code.includes(origBookingFormHeader)) {
  code = code.replace(origBookingFormHeader, newBookingFormHeader);
  console.log('2a. Inserted close button into Confirmar Horário de Atendimento modal');
}

// 2b. Appointment Success Modal (Reunião Agendada com Sucesso!)
const origSuccessModalHeader = `children:Z?o.jsxs("div",{className:"space-y-5 text-center py-2",children:[o.jsx("div",{className:"w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200",children:o.jsx(nn,{className:"w-8 h-8"})}),o.jsxs("div",{children:[o.jsx("h3",{className:"text-lg sm:text-xl font-black text-slate-900",children:"Reunião Agendada com Sucesso!"})`;

const newSuccessModalHeader = `children:Z?o.jsxs("div",{className:"space-y-5 text-center py-2 relative",children:[o.jsx("button",{type:"button",onClick:()=>{J(!1);Y(null);},className:"absolute -top-2 -right-2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer","aria-label":"Fechar",title:"Fechar",children:o.jsx(Zl,{className:"w-5 h-5"})}),o.jsx("div",{className:"w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200",children:o.jsx(nn,{className:"w-8 h-8"})}),o.jsxs("div",{children:[o.jsx("h3",{className:"text-lg sm:text-xl font-black text-slate-900",children:"Reunião Agendada com Sucesso!"})`;

if (code.includes(origSuccessModalHeader)) {
  code = code.replace(origSuccessModalHeader, newSuccessModalHeader);
  console.log('2b. Inserted close button into Reunião Agendada com Sucesso modal');
}

// 2c. Delete Confirmation Modal (Confirmar Exclusão)
const origDeleteModalHeader = `o.jsxs("div",{className:"flex items-center gap-3 text-rose-600",children:[o.jsx("div",{className:"w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100",children:o.jsx(Hp,{className:"w-5 h-5"})}),o.jsxs("div",{children:[o.jsx("h4",{className:"text-base font-bold text-slate-900",children:"Confirmar Exclusão"}),o.jsx("p",{className:"text-xs text-slate-500",children:"Ação irreversível"})]})]})`;

const newDeleteModalHeader = `o.jsxs("div",{className:"flex items-center justify-between text-rose-600",children:[o.jsxs("div",{className:"flex items-center gap-3",children:[o.jsx("div",{className:"w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100",children:o.jsx(Hp,{className:"w-5 h-5"})}),o.jsxs("div",{children:[o.jsx("h4",{className:"text-base font-bold text-slate-900",children:"Confirmar Exclusão"}),o.jsx("p",{className:"text-xs text-slate-500",children:"Ação irreversível"})]})]}),o.jsx("button",{type:"button",onClick:()=>bt(null),className:"p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer","aria-label":"Fechar",title:"Fechar",children:o.jsx(Zl,{className:"w-5 h-5"})})]})`;

if (code.includes(origDeleteModalHeader)) {
  code = code.replace(origDeleteModalHeader, newDeleteModalHeader);
  console.log('2c. Inserted close button into Confirmar Exclusão modal');
}

// =========================================================================
// 3. REMOVE QR CODE GENERATION FOR EMPLOYEE REGISTRATION
// "Retire a função de criar o qr code para cadastro de funcionários. Vamos imprimir por fora, já que a aplicação não funcionou."
// =========================================================================

// 3a. In CompanyCollaboratorsLinkScreen: Replace the QR Code Card
const origManagerQrBlock = `// QR Code Card
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
          })`;

const newManagerQrBlock = `// Link Sharing & External Print Info Card
          o.jsxs("div", {
            className: "bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 text-center flex flex-col items-center justify-between space-y-4",
            children: [
              o.jsxs("div", {
                className: "space-y-1.5",
                children: [
                  o.jsx("span", { className: "w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-base mx-auto mb-2", children: "📋" }),
                  o.jsx("h4", { className: "font-extrabold text-sm text-slate-900", children: "Envio Direto aos Colaboradores" }),
                  o.jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: "Compartilhe o link exclusivo diretamente aos colaboradores por WhatsApp, E-mail corporativo ou Intranet da empresa." })
                ]
              }),
              o.jsxs("div", {
                className: "p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 w-full",
                children: [
                  o.jsxs("div", {
                    className: "flex items-center gap-1.5 text-slate-700 font-bold text-xs",
                    children: [
                      o.jsx("span", { children: "ℹ️" }),
                      o.jsx("span", { children: "Impressão Externa de Materiais" })
                    ]
                  }),
                  o.jsx("p", {
                    className: "text-[11px] text-slate-500 leading-relaxed",
                    children: "Conforme diretriz operacional, a impressão de cartazes físicos e confecção gráfica de QR Codes serão realizadas externamente pelo setor de RH."
                  })
                ]
              }),
              o.jsxs("button", {
                type: "button",
                onClick: handleCopyLink,
                className: "w-full py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5",
                children: [
                  o.jsx("span", { children: "🔗" }),
                  o.jsx("span", { children: copied ? "Link Copiado com Sucesso!" : "Copiar Link para Envio Externo" })
                ]
              })
            ]
          })`;

if (code.includes(origManagerQrBlock)) {
  code = code.replace(origManagerQrBlock, newManagerQrBlock);
  console.log('3a. Replaced QR Code generator in CompanyCollaboratorsLinkScreen with external printing notice');
}

// 3b. In aL (Collaborator Access screen): Remove the QR code SVG and print button
const origAlQrSnippet = `// -------------------------------------------------------------
        // QR CODE ENTRY POINT COMPONENT (#qr-entry-point)
        // -------------------------------------------------------------
        o.jsxs("div", {
          id: "qr-entry-point",
          "data-testid": "collaborator-qr-entry",
          className: "p-5 sm:p-6 border-b border-slate-100 bg-white space-y-4 text-center",
          children: [
            o.jsxs("div", {
              className: "space-y-1",
              children: [
                o.jsx("span", { className: "w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm mx-auto mb-1", children: "📱" }),
                o.jsx("h4", { className: "font-extrabold text-sm text-slate-900", children: "Acesso Rápido via QR Code no Celular" }),
                o.jsx("p", { className: "text-xs text-slate-500", children: "Aponte a câmera do celular para responder em seu próprio dispositivo com total privacidade." })
              ]
            }),
            // Graphic QR Code Box
            o.jsxs("div", {
              className: "p-3.5 bg-white rounded-2xl border-2 border-slate-200 shadow-sm inline-block my-1",
              children: [
                o.jsxs("svg", {
                  className: "w-32 h-32 mx-auto",
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
            // Interactive QR Entry Buttons
            o.jsxs("div", {
              className: "flex flex-col sm:flex-row items-center justify-center gap-2 pt-1 max-w-md mx-auto",
              children: [
                o.jsxs("button", {
                  type: "button",
                  onClick: handleStartAnonymous,
                  className: "w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5",
                  children: [o.jsx("span", { children: "🚀" }), o.jsx("span", { children: "Acessar via QR Code" })]
                }),
                o.jsxs("button", {
                  type: "button",
                  onClick: () => window.print(),
                  className: "w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5",
                  children: [o.jsx("span", { children: "🖨️" }), o.jsx("span", { children: "Imprimir Cartaz com QR Code" })]
                })
              ]
            })
          ]
        })`;

const newAlQrSnippet = `// -------------------------------------------------------------
        // COLLABORATOR ACCESS ENTRY POINT (#qr-entry-point)
        // -------------------------------------------------------------
        o.jsxs("div", {
          id: "qr-entry-point",
          "data-testid": "collaborator-qr-entry",
          className: "p-5 sm:p-6 border-b border-slate-100 bg-white space-y-4 text-center",
          children: [
            o.jsxs("div", {
              className: "space-y-1.5",
              children: [
                o.jsx("span", { className: "w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm mx-auto mb-1", children: "📱" }),
                o.jsx("h4", { className: "font-extrabold text-sm text-slate-900", children: "Acesso Direto ao Questionário Psicossocial" }),
                o.jsx("p", { className: "text-xs text-slate-500 max-w-md mx-auto leading-relaxed", children: "Acesse em seu celular ou computador com sigilo ético absoluto (Art. 12 da LGPD). Os materiais físicos de impressão e QR Code são gerados externamente pelo RH." })
              ]
            }),
            o.jsxs("div", {
              className: "flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1 max-w-md mx-auto",
              children: [
                o.jsxs("button", {
                  type: "button",
                  onClick: handleStartAnonymous,
                  className: "w-full sm:flex-1 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2",
                  children: [o.jsx("span", { children: "📋" }), o.jsx("span", { children: "Acessar Questionário Oficial" })]
                }),
                o.jsxs("button", {
                  type: "button",
                  onClick: () => {
                    try {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link de acesso copiado com sucesso!");
                    } catch {}
                  },
                  className: "w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5",
                  children: [o.jsx("span", { children: "🔗" }), o.jsx("span", { children: "Copiar Link de Acesso" })]
                })
              ]
            })
          ]
        })`;

if (code.includes(origAlQrSnippet)) {
  code = code.replace(origAlQrSnippet, newAlQrSnippet);
  console.log('3b. Replaced QR Code generator in aL with direct access card');
}

// =========================================================================
// 4. DISPLAY COMPANIES AS A CLEAN LIST, AND CLICK TO VIEW COMPLETE DATA
// "ao clicar para visualizar empresas, exiba em lista e, ao clicar nela, abra os dados completos."
// =========================================================================

// Let's add selectedCompanyDetails state to HC
const hcStateTarget = `const x=n||[],g=t||[],v=a||[],[w,S]=ee.useState(!1),[y,A]=ee.useState(null)`;
const hcStateReplacement = `const x=n||[],g=t||[],v=a||[],[w,S]=ee.useState(!1),[y,A]=ee.useState(null),[selectedCompanyDetails,setSelectedCompanyDetails]=ee.useState(null)`;

if (code.includes(hcStateTarget) && !code.includes('selectedCompanyDetails')) {
  code = code.replace(hcStateTarget, hcStateReplacement);
  console.log('4a. Added selectedCompanyDetails state to HC');
}

// Find the entire company rendering section in HC:
// Starts at: o.jsxs("div",{className:"space-y-4",children:[o.jsxs("div",{className:"flex items-center justify-between",children:[o.jsxs("h3",{className:"text-sm font-semibold text-slate-700 uppercase tracking-wider",children:["Empresas Cadastradas (",x.length,")"]})
// and ends before: o.jsx(UC,{isOpen:!!G,onClose:()=>U(null),company:G})

const listStartMark = `o.jsxs("div",{className:"space-y-4",children:[o.jsxs("div",{className:"flex items-center justify-between",children:[o.jsxs("h3",{className:"text-sm font-semibold text-slate-700 uppercase tracking-wider",children:["Empresas Cadastradas (",x.length,")"]})`;
const listEndMark = `,o.jsx(UC,{isOpen:!!G,onClose:()=>U(null),company:G})`;

const startIdx = code.indexOf(listStartMark);
const endIdx = code.indexOf(listEndMark, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  console.log(`Found company list section: start ${startIdx}, end ${endIdx}, length ${endIdx - startIdx}`);
  
  // The new replacement will render:
  // 1. Clean list of companies (table/cards)
  // 2. The Complete Data Modal when selectedCompanyDetails is active (with CLOSE buttons!)
  const newCompaniesListAndDetailsModal = `o.jsxs("div",{className:"space-y-4",children:[
    // Header for Companies List
    o.jsxs("div",{className:"flex items-center justify-between pb-1",children:[
      o.jsxs("div",{className:"flex items-center gap-2",children:[
        o.jsx("div",{className:"w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm",children:o.jsx(ta,{className:"w-4 h-4"})}),
        o.jsxs("h3",{className:"text-sm font-bold text-slate-900 uppercase tracking-wider",children:["Empresas Cadastradas (",x.length,")"]})
      ]}),
      o.jsxs("span",{className:"text-xs text-slate-500 hidden sm:flex items-center gap-1",children:[
        o.jsx(Dn,{className:"w-3.5 h-3.5 text-emerald-600"}),
        "Clique na empresa para abrir os dados completos"
      ]})
    ]}),
    
    // Empty state or List of companies
    x.length===0?o.jsxs("div",{className:"text-center py-10 bg-white rounded-2xl border border-dashed border-slate-300 p-6",children:[
      o.jsx(ta,{className:"w-10 h-10 text-slate-400 mx-auto mb-2 opacity-60"}),
      o.jsx("p",{className:"text-sm font-medium text-slate-700",children:"Nenhuma organização cadastrada no momento."}),
      o.jsx("p",{className:"text-xs text-slate-500 mt-1",children:"Utilize o formulário acima para cadastrar a primeira empresa."})
    ]}):o.jsx("div",{className:"bg-white rounded-2xl border border-slate-200/90 shadow-sm divide-y divide-slate-100 overflow-hidden",children:x.map(Me=>{
      const totalEmp = Me.totalEmployees || 0;
      const availH = Me.availableHours !== void 0 ? Me.availableHours : Math.max(0, (Me.contractedHours || 50) + (Me.extraHoursApproved || 0) - (Me.usedHours || 0));
      return o.jsxs("div",{
        key: Me.id,
        onClick: () => setSelectedCompanyDetails(Me),
        className: "p-4 sm:p-5 hover:bg-blue-50/50 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group",
        title: "Clique para abrir os dados completos de " + Me.name,
        children: [
          // Left: Icon + Info
          o.jsxs("div",{className:"flex items-start sm:items-center gap-3.5 min-w-0 flex-1",children:[
            o.jsx("div",{className:"w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-xs",children:o.jsx(ta,{className:"w-5 h-5"})}),
            o.jsxs("div",{className:"min-w-0 space-y-1",children:[
              o.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[
                o.jsx("h4",{className:"text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate",children:Me.name}),
                Me.cnpj && o.jsxs("span",{className:"text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200",children:["CNPJ: ",Me.cnpj]})
              ]}),
              o.jsxs("div",{className:"flex items-center gap-3 text-xs text-slate-500 flex-wrap",children:[
                o.jsxs("span",{className:"flex items-center gap-1",children:[o.jsx(fy,{className:"w-3.5 h-3.5 text-slate-400"}),Me.city," - ",Me.state]}),
                o.jsx("span",{children:"•"}),
                o.jsxs("span",{className:"flex items-center gap-1 font-semibold text-slate-700",children:[o.jsx(Xo,{className:"w-3.5 h-3.5 text-slate-400"}),totalEmp," colaboradores"]}),
                o.jsx("span",{children:"•"}),
                o.jsxs("span",{className:"text-emerald-700 font-bold",children:[availH,"h disponíveis (Plano)"]}),
                Me.calculatedAbsenteeismRate && o.jsxs("span",{className:"hidden md:inline-flex text-indigo-700 font-medium",children:["• Absenteísmo: ",Me.calculatedAbsenteeismRate,"%"]})
              ]})
            ]})
          ]}),
          // Right: Button to open complete details
          o.jsxs("div",{className:"flex items-center gap-2 shrink-0 self-end sm:self-center",children:[
            o.jsxs("button",{
              type: "button",
              onClick: (e) => { e.stopPropagation(); setSelectedCompanyDetails(Me); },
              className: "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-700 group-hover:text-white text-xs font-bold border border-blue-200 group-hover:border-blue-600 transition-all shadow-xs cursor-pointer",
              children: [
                o.jsx("span",{children:"Ver Dados Completos"}),
                o.jsx("span",{className:"text-xs",children:"→"})
              ]
            })
          ]})
        ]
      });
    })}),

    // Complete Company Data Modal
    selectedCompanyDetails && o.jsx("div",{
      className: "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto",
      onClick: () => setSelectedCompanyDetails(null),
      children: (() => {
        const Me = selectedCompanyDetails;
        const et = g.filter(ft => ft.schoolId === Me.id || ft.id === Me.formOperacionalId || ft.id === Me.formAdministrativoId || ft.id === Me.formGestaoId || ft.id === Me.formPedagogicoId || ft.id === Me.formApoioId);
        const availH = Me.availableHours !== void 0 ? Me.availableHours : Math.max(0, (Me.contractedHours || 50) + (Me.extraHoursApproved || 0) - (Me.usedHours || 0));
        const officialLink = Ft(Me.id, (et[0]?.id), !0);
        const colabLink = Rt(Me.id, !0);
        const managerLnk = mgrLink(Me.id, !0);

        return o.jsxs("div",{
          className: "bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in zoom-in-95 duration-150",
          onClick: e => e.stopPropagation(),
          children: [
            // Modal Header with Title & Close Button
            o.jsxs("div",{className:"px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/80 sticky top-0 z-20 backdrop-blur-md",children:[
              o.jsxs("div",{className:"flex items-center gap-3 min-w-0",children:[
                o.jsx("div",{className:"w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0",children:o.jsx(ta,{className:"w-5 h-5"})}),
                o.jsxs("div",{className:"min-w-0",children:[
                  o.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[
                    o.jsx("h3",{className:"text-base sm:text-lg font-bold text-slate-900 truncate",children:Me.name}),
                    o.jsx("span",{className:"text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200",children:"Dados Completos"})
                  ]}),
                  o.jsxs("p",{className:"text-xs text-slate-500 mt-0.5 truncate",children:[Me.city," - ",Me.state, Me.cnpj ? (" • CNPJ: " + Me.cnpj) : ""]})
                ]})
              ]}),
              o.jsx("button",{
                type:"button",
                onClick:()=>setSelectedCompanyDetails(null),
                className:"p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer",
                title:"Fechar Janela",
                "aria-label":"Fechar",
                children:o.jsx(Zl,{className:"w-5 h-5"})
              })
            ]}),

            // Modal Scrollable Content
            o.jsxs("div",{className:"p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800",children:[
              // Section 1: Overview and Indicators
              o.jsxs("div",{className:"grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs",children:[
                o.jsxs("div",{className:"p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1",children:[
                  o.jsx("span",{className:"text-[10px] text-slate-500 font-bold uppercase block",children:"Colaboradores"}),
                  o.jsxs("strong",{className:"text-base sm:text-lg font-black text-slate-900",children:[Me.totalEmployees||0]})
                ]}),
                o.jsxs("div",{className:"p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1",children:[
                  o.jsx("span",{className:"text-[10px] text-slate-500 font-bold uppercase block",children:"Atestados Médicos"}),
                  o.jsxs("strong",{className:"text-base sm:text-lg font-black text-slate-900",children:[Me.sickLeaveDays??0," dias"]})
                ]}),
                o.jsxs("div",{className:"p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1",children:[
                  o.jsx("span",{className:"text-[10px] text-emerald-800 font-bold uppercase block",children:"Taxa Absenteísmo"}),
                  o.jsxs("strong",{className:"text-base sm:text-lg font-black text-emerald-700",children:[Me.calculatedAbsenteeismRate??Me.absenteeismRate??"0","%"]})
                ]}),
                o.jsxs("div",{className:"p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-1",children:[
                  o.jsx("span",{className:"text-[10px] text-indigo-800 font-bold uppercase block",children:"Taxa Turnover"}),
                  o.jsxs("strong",{className:"text-base sm:text-lg font-black text-indigo-700",children:[Me.calculatedTurnoverRate??Me.turnoverRate??"0","%"]})
                ]})
              ]}),

              // Section 2: Hours Management (Plano Contratado)
              o.jsxs("div",{className:"p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white border border-slate-200 flex flex-wrap items-center justify-between gap-4",children:[
                o.jsxs("div",{className:"flex flex-wrap items-center gap-5 text-xs",children:[
                  o.jsxs("div",{className:"flex items-center gap-2.5",children:[
                    o.jsx("div",{className:"w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0",children:o.jsx(Zo,{className:"w-4 h-4"})}),
                    o.jsxs("div",{children:[
                      o.jsx("span",{className:"text-[10px] text-slate-500 font-bold uppercase tracking-wider block",children:"Horas de Atendimento (Plano)"}),
                      o.jsxs("span",{className:"font-bold text-slate-800",children:[Me.contractedHours??50,"h contratadas ",(Me.extraHoursApproved??0)>0&&("(+" + Me.extraHoursApproved + "h adicionais)")]})
                    ]})
                  ]}),
                  o.jsxs("div",{className:"flex items-center gap-4 border-l border-slate-200 pl-4",children:[
                    o.jsxs("div",{children:[
                      o.jsx("span",{className:"text-[10px] text-slate-500 font-semibold block",children:"Horas Utilizadas:"}),
                      o.jsxs("span",{className:"font-bold text-rose-600 text-sm",children:[Me.usedHours??0,"h"]})
                    ]}),
                    o.jsxs("div",{children:[
                      o.jsx("span",{className:"text-[10px] text-emerald-800 font-bold block",children:"Saldo Disponível:"}),
                      o.jsxs("span",{className:"font-black text-emerald-700 text-base",children:[availH,"h"]})
                    ]})
                  ]})
                ]}),
                o.jsxs("button",{
                  onClick:()=>{pe(Me)},
                  className:"inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer",
                  title:"Solicitar horas adicionais para acolhimento psicológico",
                  children:[o.jsx(cf,{className:"w-3.5 h-3.5"}),o.jsx("span",{children:"Solicitar Horas Adicionais"})]
                })
              ]}),

              // Section 3: Official Exclusive Links
              o.jsxs("div",{className:"space-y-4",children:[
                o.jsx("h4",{className:"text-xs font-extrabold uppercase tracking-wider text-slate-500",children:"Links Oficiais da Organização"}),

                // Link 1: Official Unique Survey Link
                o.jsxs("div",{className:"p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2 text-xs",children:[
                  o.jsxs("div",{className:"flex items-center justify-between",children:[
                    o.jsxs("strong",{className:"text-blue-950 font-bold flex items-center gap-1.5",children:[o.jsx(Zu,{className:"w-4 h-4 text-blue-600"}),"Link Único Oficial para Toda a Organização (NR-1):"]}),
                    o.jsx("span",{className:"text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800",children:"100% Anônimo (LGPD)"})
                  ]}),
                  o.jsxs("div",{className:"flex flex-col sm:flex-row items-stretch gap-2",children:[
                    o.jsx("input",{type:"text",readOnly:!0,value:officialLink,className:"flex-1 px-3 py-2 rounded-xl border border-blue-300 bg-white font-mono text-xs text-slate-800 select-all shadow-inner focus:outline-none",onClick:Je=>Je.target.select()}),
                    o.jsx("button",{
                      onClick:()=>Ie(Me.id,et[0]?.id,!0),
                      className:"inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer",
                      children:y===officialLink?o.jsxs(o.Fragment,{children:[o.jsx(of,{className:"w-4 h-4 text-white"}),o.jsx("span",{children:"Copiado!"})]}):o.jsxs(o.Fragment,{children:[o.jsx(Pc,{className:"w-4 h-4"}),o.jsx("span",{children:"Copiar Link"})]})
                    }),
                    o.jsxs("a",{href:officialLink,target:"_blank",rel:"noopener noreferrer",className:"inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold shadow-2xs transition-colors",children:[o.jsx(ql,{className:"w-3.5 h-3.5 text-slate-500"}),o.jsx("span",{children:"Abrir"})]})
                  ]})
                ]}),

                // Link 2: Specific Collaborator Register Link
                o.jsxs("div",{className:"p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2 text-xs",children:[
                  o.jsxs("div",{className:"flex items-center justify-between",children:[
                    o.jsxs("strong",{className:"text-emerald-950 font-bold flex items-center gap-1.5",children:[o.jsx(Zh,{className:"w-4 h-4 text-emerald-600"}),"Link Específico para Cadastro de Colaboradores:"]}),
                    o.jsx("span",{className:"text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800",children:"Vínculo Direto"})
                  ]}),
                  o.jsxs("div",{className:"flex flex-col sm:flex-row items-stretch gap-2",children:[
                    o.jsx("input",{type:"text",readOnly:!0,value:colabLink,className:"flex-1 px-3 py-2 rounded-xl border border-emerald-300 bg-white font-mono text-xs text-slate-800 select-all shadow-inner focus:outline-none",onClick:Je=>Je.target.select()}),
                    o.jsx("button",{
                      onClick:()=>lt(Me.id,Me.name),
                      className:"inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer",
                      children:y===("emp_reg_" + Me.id)?o.jsxs(o.Fragment,{children:[o.jsx(of,{className:"w-4 h-4 text-white"}),o.jsx("span",{children:"Copiado!"})]}):o.jsxs(o.Fragment,{children:[o.jsx(Pc,{className:"w-4 h-4"}),o.jsx("span",{children:"Copiar Link"})]})
                    }),
                    o.jsxs("a",{href:colabLink,target:"_blank",rel:"noopener noreferrer",className:"inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold shadow-2xs transition-colors",children:[o.jsx(ql,{className:"w-3.5 h-3.5 text-slate-500"}),o.jsx("span",{children:"Abrir"})]})
                  ]})
                ]}),

                // Link 3: Manager Exclusive Link
                o.jsxs("div",{className:"p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-2 text-xs",children:[
                  o.jsxs("div",{className:"flex items-center justify-between",children:[
                    o.jsxs("strong",{className:"text-purple-950 font-bold flex items-center gap-1.5",children:[o.jsx(Dn,{className:"w-4 h-4 text-purple-600"}),"Link do Responsável (Acesso Exclusivo Gestão & Permissões):"]}),
                    o.jsx("span",{className:"text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800",children:"Acesso Restrito"})
                  ]}),
                  o.jsxs("div",{className:"flex flex-col sm:flex-row items-stretch gap-2",children:[
                    o.jsx("input",{type:"text",readOnly:!0,value:managerLnk,className:"flex-1 px-3 py-2 rounded-xl border border-purple-300 bg-white font-mono text-xs text-slate-800 select-all shadow-inner focus:outline-none",onClick:Je=>Je.target.select()}),
                    o.jsx("button",{
                      onClick:async()=>{try{await navigator.clipboard.writeText(managerLnk)}catch{const ta=document.createElement("textarea");ta.value=managerLnk;document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove()}A(managerLnk);R("Link do Responsável copiado com sucesso!");setTimeout(()=>{A(null);R(null)},4000)},
                      className:"inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer",
                      children:"Copiar Link"
                    }),
                    o.jsxs("a",{href:managerLnk,target:"_blank",rel:"noopener noreferrer",className:"inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold shadow-2xs transition-colors",children:[o.jsx(ql,{className:"w-3.5 h-3.5 text-purple-600"}),o.jsx("span",{children:"Abrir"})]})
                  ]})
                ]})
              ]}),

              // Section 4: Actions Buttons Bar
              o.jsxs("div",{className:"pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5",children:[
                o.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[
                  o.jsxs("button",{
                    type:"button",
                    onClick:()=>{U(Me)},
                    className:"inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-colors cursor-pointer",
                    children:[o.jsx(Xo,{className:"w-4 h-4"}),o.jsx("span",{children:"Ver Quadro de Funcionários"})]
                  }),
                  o.jsxs("button",{
                    type:"button",
                    onClick:()=>{Z(Me)},
                    className:"inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors cursor-pointer",
                    children:[o.jsx(my,{className:"w-4 h-4 text-slate-600"}),o.jsx("span",{children:"Editar Dados da Empresa"})]
                  }),
                  o.jsxs("button",{
                    type:"button",
                    onClick:()=>{h(Me.id)},
                    className:"inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors cursor-pointer",
                    children:[o.jsx(xf,{className:"w-4 h-4 text-indigo-600"}),o.jsx("span",{children:"Lançar Dados de RH"})]
                  })
                ]}),
                o.jsx("button",{
                  type:"button",
                  onClick:()=>{bt({id:Me.id,name:Me.name})},
                  className:"inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors cursor-pointer",
                  children:[o.jsx(Hp,{className:"w-4 h-4"}),o.jsx("span",{children:"Excluir Empresa"})]
                })
              ]})
            ]}),

            // Modal Footer with Close Button
            o.jsxs("div",{className:"px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3",children:[
              o.jsx("button",{
                type:"button",
                onClick:()=>setSelectedCompanyDetails(null),
                className:"px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer",
                children:"Fechar Janela"
              })
            ]})
          ]
        });
      })()
    }),

    // Delete confirmation modal (with header close button)
    st&&o.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn",children:o.jsxs("div",{className:"bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 sm:p-6 max-w-md w-full space-y-4",children:[
      o.jsxs("div",{className:"flex items-center justify-between text-rose-600 pb-2 border-b border-slate-100",children:[
        o.jsxs("div",{className:"flex items-center gap-3",children:[
          o.jsx("div",{className:"w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100",children:o.jsx(Hp,{className:"w-5 h-5"})}),
          o.jsxs("div",{children:[o.jsx("h4",{className:"text-base font-bold text-slate-900",children:"Confirmar Exclusão"}),o.jsx("p",{className:"text-xs text-slate-500",children:"Ação irreversível"})]})
        ]}),
        o.jsx("button",{type:"button",onClick:()=>bt(null),className:"p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer","aria-label":"Fechar",title:"Fechar",children:o.jsx(Zl,{className:"w-5 h-5"})})
      ]}),
      o.jsxs("p",{className:"text-sm text-slate-600 leading-relaxed",children:["Deseja realmente remover a empresa ",o.jsxs("strong",{className:"text-slate-800",children:['"',st.name,'"']})," e seus questionários exclusivos?"]}),
      o.jsxs("div",{className:"flex items-center justify-end gap-2 pt-2 border-t border-slate-100",children:[
        o.jsx("button",{onClick:()=>bt(null),disabled:pt,className:"px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer",children:"Cancelar"}),
        o.jsx("button",{onClick:async()=>{try{It(!0);await os.deleteSchool(st.id);c(st.id);bt(null);R('Empresa ' + (st ? st.name : '') + ' removida com sucesso.');if(selectedCompanyDetails?.id===st.id)setSelectedCompanyDetails(null);setTimeout(()=>R(null),4000)}catch(Me){alert(Me.message||"Erro ao excluir empresa.")}finally{It(!1)}},disabled:pt,className:"px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all flex items-center gap-1.5 cursor-pointer",children:pt?o.jsxs(o.Fragment,{children:[o.jsx(Xl,{className:"w-3.5 h-3.5 animate-spin"}),o.jsx("span",{children:"Excluindo..."})]}):o.jsx("span",{children:"Sim, Excluir Empresa"})})
      ]})
    ]})]`;

  code = code.slice(0, startIdx) + newCompaniesListAndDetailsModal + code.slice(endIdx);
  console.log('4b. Successfully updated companies to List View with Complete Data Modal!');
} else {
  console.error('Could not find company list section indices:', { startIdx, endIdx });
}

// =========================================================================
// 5. VALIDATE WITH ESBUILD AND WRITE
// =========================================================================
console.log('Validating full bundle syntax with esbuild...');
try {
  esbuild.transformSync(code, { loader: 'js' });
  console.log('BUNDLE SYNTAX VALIDATION SUCCEEDED! 🚀');
  fs.writeFileSync(filePath, code);
  fs.copyFileSync(filePath, './public/assets/index-lkSxDUTb.js');
  console.log('Successfully written and synchronized bundle!');
} catch (err) {
  console.error('esbuild validation error:', err);
  if (err?.errors?.[0]?.location) {
    const loc = err.errors[0].location;
    console.log('Error location:', loc);
    const lines = code.split('\n');
    console.log('Context:');
    for (let i = Math.max(0, loc.line - 5); i <= Math.min(lines.length - 1, loc.line + 5); i++) {
      console.log(`${i + 1}: ${lines[i]}`);
    }
  }
  process.exit(1);
}
