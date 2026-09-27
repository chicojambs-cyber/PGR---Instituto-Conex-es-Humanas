import fs from 'fs';

const filePath = './src/index-lkSxDUTb.js';
const publicPath = './public/assets/index-lkSxDUTb.js';

let code = fs.readFileSync(filePath, 'utf8');
console.log('Original code size:', code.length);

// 1. Replace all occurrences of dpereirasolucoes@gmail.com with chicojambs@gmail.com
const prevEmailCount = (code.match(/dpereirasolucoes@gmail\.com/g) || []).length;
code = code.replaceAll('dpereirasolucoes@gmail.com', 'chicojambs@gmail.com');
console.log(`1. Replaced ${prevEmailCount} occurrences of old email with chicojambs@gmail.com`);

// 2. Add lockSlot and unlockSlot to os object if not present
const targetOsSlots = 'async getAppointmentSlots(n){';
const newOsLocks = `async lockSlot(slotId, employeeName, employeeEmail, sessionId){
  return kt(\`\${Et}/appointments/lock-slot\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slotId, employeeName, employeeEmail, sessionId })
  });
},
async unlockSlot(slotId, sessionId){
  return kt(\`\${Et}/appointments/unlock-slot\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slotId, sessionId })
  });
},
async getAppointmentSlots(n){`;

if (!code.includes('async lockSlot(')) {
  code = code.replace(targetOsSlots, newOsLocks);
  console.log('2. Injected lockSlot and unlockSlot into API service (os)');
}

// 3. Update lt handler in Q4 to lock the slot immediately when an employee selects it
const origLt = 'lt=Ee=>{Ee.status!=="booked"&&(G(Ee),Y(null),J(!0))}';
const newLt = `lt=async Ee=>{
  if (Ee.status === "booked") {
    alert("Horário Indisponível: Este atendimento já foi agendado e confirmado por outro colaborador.");
    return;
  }
  if (Ee.status === "locked") {
    alert("Horário Bloqueado: Este horário já foi selecionado por outro colaborador e está bloqueado para evitar agendamentos simultâneos ao mesmo horário.");
    return;
  }
  try {
    const sId = "sess_" + Math.random().toString(36).substring(2, 9);
    window.__currentSlotSession = sId;
    const lockRes = await os.lockSlot(Ee.id, Re || "Colaborador", z || "", sId);
    if (!lockRes || !lockRes.success) {
      alert(lockRes?.error || "Horário bloqueado por outro colaborador.");
      _e();
      return;
    }
    h(Ct => Ct.map(Je => Je.id === Ee.id ? { ...Je, status: "locked" } : Je));
    G(Ee);
    Y(null);
    J(!0);
  } catch(err) {
    if (err && err.message && err.message.includes("bloqueado")) {
      alert(err.message);
      _e();
    } else {
      G(Ee);
      Y(null);
      J(!0);
    }
  }
}`;

if (code.includes(origLt)) {
  code = code.replace(origLt, newLt);
  console.log('3. Updated lt to lock slot immediately upon employee selection');
} else {
  console.log('Notice: origLt pattern not matched directly, checking variations...');
}

// 4. Update Qe in Q4 to pass sessionId and ensure slot is permanently marked as booked
const origQeCall = 'const nt=await os.bookAppointment({slotId:R.id,employeeName:Re.trim()||"Colaborador Confidencial",employeeEmail:z.trim(),employeeDepartment:k.trim(),companyId:A});';
const newQeCall = 'const nt=await os.bookAppointment({slotId:R.id,employeeName:Re.trim()||"Colaborador Confidencial",employeeEmail:z.trim(),employeeDepartment:k.trim(),companyId:A,sessionId:window.__currentSlotSession});';

if (code.includes(origQeCall)) {
  code = code.replace(origQeCall, newQeCall);
  console.log('4. Updated bookAppointment call in Qe to include sessionId');
}

// 5. Update cancel button in modal to unlock slot if user cancels
const origCancelBtn = 'onClick:()=>J(!1),className:"px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs sm:text-sm cursor-pointer min-h-[44px]",children:"Cancelar"';
const newCancelBtn = `onClick:async()=>{
  if (R && R.id) {
    try {
      await os.unlockSlot(R.id, window.__currentSlotSession);
      h(Ct => Ct.map(Je => Je.id === R.id ? { ...Je, status: "available" } : Je));
    } catch {}
  }
  J(!1);
  G(null);
  _e();
},className:"px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs sm:text-sm cursor-pointer min-h-[44px]",children:"Cancelar"`;

if (code.includes(origCancelBtn)) {
  code = code.replace(origCancelBtn, newCancelBtn);
  console.log('5. Updated modal Cancel button to release slot lock');
}

// 6. Update It.map rendering to display locked status, badges and disabled buttons
const origSlotRenderTarget = 'const nt=Ee.status==="available";return o.jsxs("div",{className:`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${nt?"bg-white border-slate-200 hover:border-rose-400 hover:shadow-xs group":"bg-slate-50 border-slate-200/60 opacity-60"}`,children:[o.jsxs("div",{className:"space-y-1",children:[o.jsxs("div",{className:"flex items-center gap-2",children:[o.jsxs("span",{className:"text-base font-black text-slate-900 flex items-center gap-1.5",children:[o.jsx(Zo,{className:"w-4 h-4 text-rose-600"}),Ee.time]}),o.jsxs("span",{className:"text-xs text-slate-500 font-medium",children:["(",Ee.durationMinutes," min)"]}),o.jsx("span",{className:`text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${nt?"bg-emerald-100 text-emerald-800":"bg-slate-200 text-slate-600"}`,children:nt?"Disponível":"Agendado"})]}),o.jsxs("div",{className:"text-xs sm:text-sm text-slate-700 pt-0.5",children:[o.jsx("span",{className:"font-semibold text-slate-900",children:Ee.specialistName}),o.jsx("span",{className:"text-slate-500 block text-xs",children:Ee.specialistRole})]}),o.jsxs("div",{className:"flex items-center gap-1.5 text-xs font-medium text-indigo-700 pt-0.5",children:[o.jsx(_5,{className:"w-3.5 h-3.5 text-indigo-600"}),o.jsx("span",{children:Ee.platformOrLocation||"Google Meet • Sala Segura"})]})]}),o.jsx("div",{className:"pt-2 sm:pt-0",children:nt?o.jsxs("button",{type:"button",onClick:()=>lt(Ee),className:"w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap min-h-[44px]",children:[o.jsx("span",{children:"Escolher Horário"}),o.jsx(ql,{className:"w-4 h-4"})';

const newSlotRender = `const nt=Ee.status==="available";
const isLocked=Ee.status==="locked";
const isBooked=Ee.status==="booked";
return o.jsxs("div",{className:\`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 \${nt?"bg-white border-slate-200 hover:border-rose-400 hover:shadow-xs group":isLocked?"bg-amber-50/70 border-amber-300 shadow-2xs":"bg-slate-50 border-slate-200/60 opacity-60"}\`,children:[o.jsxs("div",{className:"space-y-1",children:[o.jsxs("div",{className:"flex items-center gap-2",children:[o.jsxs("span",{className:"text-base font-black text-slate-900 flex items-center gap-1.5",children:[o.jsx(Zo,{className:"w-4 h-4 text-rose-600"}),Ee.time]}),o.jsxs("span",{className:"text-xs text-slate-500 font-medium",children:["(",Ee.durationMinutes," min)"]}),o.jsx("span",{className:\`text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wider \${nt?"bg-emerald-100 text-emerald-800":isLocked?"bg-amber-100 text-amber-900 border border-amber-300 font-black animate-pulse":"bg-slate-200 text-slate-600"}\`,children:nt?"Disponível":isLocked?"🔒 Bloqueado / Em Seleção":"✓ Já Agendado"})]}),o.jsxs("div",{className:"text-xs sm:text-sm text-slate-700 pt-0.5",children:[o.jsx("span",{className:"font-semibold text-slate-900",children:Ee.specialistName}),o.jsx("span",{className:"text-slate-500 block text-xs",children:Ee.specialistRole})]}),o.jsxs("div",{className:"flex flex-wrap items-center gap-2 text-xs font-medium pt-0.5",children:[o.jsxs("span",{className:"flex items-center gap-1 text-indigo-700 font-semibold",children:[o.jsx(_5,{className:"w-3.5 h-3.5 text-indigo-600"}),o.jsx("span",{children:Ee.platformOrLocation||"Google Meet • Teleacolhimento"})]}),o.jsx("span",{className:"px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-mono text-[10px]",children:"Organizador: chicojambs@gmail.com"})]})]}),o.jsx("div",{className:"pt-2 sm:pt-0",children:nt?o.jsxs("button",{type:"button",onClick:()=>lt(Ee),className:"w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap min-h-[44px]",children:[o.jsx("span",{children:"Selecionar Horário"}),o.jsx(ql,{className:"w-4 h-4"})]}):isLocked?o.jsxs("button",{type:"button",disabled:!0,className:"w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-not-allowed whitespace-nowrap min-h-[44px]",children:[o.jsx("span",{children:"🔒 Bloqueado (Em Seleção)"})]}):o.jsxs("button",{type:"button",disabled:!0,className:"w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-200 text-slate-500 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-not-allowed whitespace-nowrap min-h-[44px]",children:[o.jsx("span",{children:"Horário Já Reservado"})]}`;

if (code.includes(origSlotRenderTarget)) {
  code = code.replace(origSlotRenderTarget, newSlotRender);
  console.log('6. Updated It.map slot rendering with lock status and badges');
} else {
  console.log('Notice: origSlotRenderTarget not matched, searching with regex...');
}

// 7. In Confirmation Box (Z): Highlight Google Meet Organizer chicojambs@gmail.com
const origZUrlBox = 'o.jsx("span",{className:"text-xs sm:text-sm font-mono text-slate-800 truncate flex-1",children:Z.bookingUrl})';
const newZUrlBox = `o.jsxs("div",{className:"flex-1 min-w-0",children:[
  o.jsx("span",{className:"text-xs sm:text-sm font-mono text-slate-800 truncate block font-bold",children:Z.bookingUrl}),
  o.jsx("span",{className:"text-[11px] text-blue-700 block font-semibold mt-0.5",children:"✓ Sala Google Meet vinculada à conta proprietária: chicojambs@gmail.com"})
]})`;

if (code.includes(origZUrlBox)) {
  code = code.replace(origZUrlBox, newZUrlBox);
  console.log('7. Added Google Meet Organizer chicojambs@gmail.com highlight in confirmation screen');
}

// Save modified code
fs.writeFileSync(filePath, code);
fs.writeFileSync(publicPath, code);
console.log('Successfully saved to src/index-lkSxDUTb.js and public/assets/index-lkSxDUTb.js. New size:', code.length);
