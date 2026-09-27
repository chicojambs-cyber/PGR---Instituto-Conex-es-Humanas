import fs from 'fs';

let code = fs.readFileSync('/app/applet/src/index-lkSxDUTb.js', 'utf8');

console.log('Original code length:', code.length);

// 1. Add m4 function next to t4
const t4Def = 'function t4(n,t=!0){const a=t?W3():e4(),i=new URLSearchParams;return i.set("action","employee-register"),i.set("companyId",n),`${a}/?${i.toString()}`}';
const m4Def = 'function m4(n,t=!0){const a=t?W3():e4(),i=new URLSearchParams;return i.set("action","company-manager"),i.set("companyId",n),i.set("key",`gestor_${n}`),`${a}/?${i.toString()}`}' + t4Def;

if (!code.includes('function m4(')) {
  code = code.replace(t4Def, m4Def);
  console.log('Patch 1 (m4 function): APPLIED');
} else {
  console.log('Patch 1 (m4 function): ALREADY PRESENT');
}

fs.writeFileSync('/app/applet/src/index-lkSxDUTb.js', code);
