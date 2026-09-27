import fs from 'fs';

const filePath = './src/index-lkSxDUTb.js';
let code = fs.readFileSync(filePath, 'utf8');

console.log('Original index-lkSxDUTb.js size:', code.length);

// 1. FIX NUMBERED STEP BADGES IN COMPANY COLLABORATORS LINK SCREEN (Directly solves user uploaded image)
const origStep1 = `o.jsx("div", { className: "w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs", children: "1" })`;
const origStep2 = `o.jsx("div", { className: "w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs", children: "2" })`;
const origStep3 = `o.jsx("div", { className: "w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs", children: "3" })`;

const newStep1 = `o.jsx("div", { className: "w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center shrink-0 shadow-xs", style: { backgroundColor: "#dbeafe", color: "#1e40af", border: "1.5px solid #93c5fd" }, children: "1" })`;
const newStep2 = `o.jsx("div", { className: "w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center shrink-0 shadow-xs", style: { backgroundColor: "#f3e8ff", color: "#6b21a8", border: "1.5px solid #d8b4fe" }, children: "2" })`;
const newStep3 = `o.jsx("div", { className: "w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center shrink-0 shadow-xs", style: { backgroundColor: "#d1fae5", color: "#065f46", border: "1.5px solid #a7f3d0" }, children: "3" })`;

if (code.includes(origStep2)) {
  code = code.replace(origStep1, newStep1);
  code = code.replace(origStep2, newStep2);
  code = code.replace(origStep3, newStep3);
  console.log('Successfully replaced step badges with high-contrast pastel styling!');
} else {
  console.warn('Could not find exact origStep2 snippet, checking alternatives...');
}

// 2. FIX GOOGLE MEET LINKS
// Replace any broken psi-safe-nr1 or random codes with official working link
const meetCount = (code.match(/https:\/\/meet\.google\.com\/psi-[^"'\s]+/g) || []).length;
console.log('Found psi- meet links in index-lkSxDUTb.js:', meetCount);
code = code.replace(/https:\/\/meet\.google\.com\/psi-[^"'\s]+/g, 'https://meet.google.com/new');

// 3. TRANSFORM LOGIN SCREEN INTO TONS PASTÉIS
// Replace dark background with soft pastel gradient and high contrast text
const darkLoginBg = 'className: "min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 flex flex-col justify-between items-center p-4 sm:p-6 text-slate-100 font-sans selection:bg-blue-600 selection:text-white"';
const pastelLoginBg = 'className: "min-h-screen bg-gradient-to-br from-indigo-50/70 via-slate-50 to-purple-50/80 flex flex-col justify-between items-center p-4 sm:p-6 text-slate-800 font-sans selection:bg-purple-200 selection:text-purple-900"';

if (code.includes(darkLoginBg)) {
  code = code.replace(darkLoginBg, pastelLoginBg);
  console.log('Replaced dark login background with pastel gradient!');
}

// Replace login header banner styling
const darkLoginHeader = 'className: "w-full max-w-5xl flex items-center justify-between py-2 border-b border-white/10 text-xs text-slate-300"';
const pastelLoginHeader = 'className: "w-full max-w-5xl flex items-center justify-between py-3 px-4 rounded-2xl bg-white/80 backdrop-blur-xs border border-purple-100/80 shadow-xs text-xs text-slate-700"';

if (code.includes(darkLoginHeader)) {
  code = code.replace(darkLoginHeader, pastelLoginHeader);
  console.log('Replaced login header banner with pastel theme!');
}

// Replace login header text color
const darkHeaderText = 'className: "font-extrabold text-white tracking-tight text-sm"';
const pastelHeaderText = 'className: "font-extrabold text-slate-900 tracking-tight text-sm"';
if (code.includes(darkHeaderText)) {
  code = code.replace(darkHeaderText, pastelHeaderText);
}

// Replace login main card container
const darkMainCard = 'className: "w-full max-w-lg my-6 bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200"';
const pastelMainCard = 'className: "w-full max-w-lg my-6 bg-white/95 text-slate-900 rounded-3xl shadow-xl shadow-purple-500/5 border border-purple-200/70 p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200 backdrop-blur-xs"';

if (code.includes(darkMainCard)) {
  code = code.replace(darkMainCard, pastelMainCard);
  console.log('Replaced main card styling with pastel shadow and border!');
}

// Replace login footer
const darkFooter = 'className: "w-full max-w-5xl py-4 border-t border-white/10 text-center text-xs text-slate-400"';
const pastelFooter = 'className: "w-full max-w-5xl py-4 border-t border-slate-200/80 text-center text-xs text-slate-500"';
if (code.includes(darkFooter)) {
  code = code.replace(darkFooter, pastelFooter);
}

// 4. ENSURE LOGIN SCREEN IS SHOWN INITIALLY
// Change initial isLoggedIn to false so user always sees the Login Screen on entry,
// while preserving employee actions (employee-register, fill-form)
const origIsLoggedIn = `const [isLoggedIn, setIsLoggedIn] = ee.useState(() => {
  const params = new URLSearchParams(window.location.search);
  const action = params.get("action");
  if (action === "employee-register" || action === "company-manager" || action === "fill-form") return true;
  return !!localStorage.getItem("psicosafe_current_user");
});`;

const newIsLoggedIn = `const [isLoggedIn, setIsLoggedIn] = ee.useState(() => {
  const params = new URLSearchParams(window.location.search);
  const action = params.get("action");
  if (action === "employee-register" || action === "fill-form") return true;
  if (params.get("autologin") === "true") return !!localStorage.getItem("psicosafe_current_user");
  return false; // Mostra a tela de login na entrada conforme solicitado pelo usuário
});`;

if (code.includes(origIsLoggedIn)) {
  code = code.replace(origIsLoggedIn, newIsLoggedIn);
  console.log('Updated isLoggedIn state to display Login Screen on load!');
}

// 5. ENHANCE HEADER WITH PROMINENT "TELA DE LOGIN / SAIR" BUTTON
const origTrocarBtn = `o.jsx("button",{onClick:()=>{localStorage.removeItem("psicosafe_current_user");setIsLoggedIn(!1);setCurrentUser(null);},className:"px-2 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 border border-slate-200 text-[11px] font-bold transition-colors cursor-pointer",title:"Trocar usuário ou sair do sistema",children:"Trocar / Sair"})`;
const newTrocarBtn = `o.jsx("button",{onClick:()=>{localStorage.removeItem("psicosafe_current_user");setIsLoggedIn(!1);setCurrentUser(null);},className:"px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs",title:"Sair e voltar para a Tela de Login",children:[o.jsx("span",{children:"🚪"}),"Tela de Login / Sair"]})`;

if (code.includes(origTrocarBtn)) {
  code = code.replace(origTrocarBtn, newTrocarBtn);
  console.log('Enhanced header logout button with pastel styling!');
}

fs.writeFileSync(filePath, code);
console.log('Successfully saved updated index-lkSxDUTb.js! New size:', code.length);
