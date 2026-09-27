import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  getDocFromServer
} from 'firebase/firestore';
import {
  School,
  CompanyDiagnosis,
  Form,
  Response,
  Intervention,
  AuditLog,
  ScheduledAppointment,
  Employee,
  RiskInventoryItem,
  AppointmentSlot,
  RolePermission,
  Supervisor
} from '../types';
import {
  INITIAL_SCHOOLS,
  INITIAL_DIAGNOSES,
  INITIAL_FORMS,
  INITIAL_RESPONSES,
  INITIAL_INTERVENTIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_EMPLOYEES,
  INITIAL_RISK_INVENTORY,
  INITIAL_APPOINTMENT_SLOTS,
  INITIAL_ROLE_PERMISSIONS,
  INITIAL_SUPERVISORS
} from './seedData';
import firebaseConfig from '../../firebase-applet-config.json';
import { getAuth } from 'firebase/auth';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
let firestoreDb: ReturnType<typeof getFirestore> | null = null;
let isFirebaseOnline = false;

try {
  firestoreDb = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  isFirebaseOnline = true;
} catch (err) {
  console.warn('Firebase init fallback to local state:', err);
}

export const db = firestoreDb;
export const auth = getAuth(app);

async function testConnection() {
  if (!db) return;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

// Helpers com persistência no LocalStorage
const STORAGE_KEYS = {
  SCHOOLS: 'psicosafe_schools_v2',
  DIAGNOSES: 'psicosafe_diagnoses_v2',
  FORMS: 'psicosafe_forms_v2',
  RESPONSES: 'psicosafe_responses_v2',
  INTERVENTIONS: 'psicosafe_interventions_v2',
  AUDIT_LOGS: 'psicosafe_audit_logs_v2',
  APPOINTMENTS: 'psicosafe_appointments_v2',
  EMPLOYEES: 'psicosafe_employees_v2',
  RISK_INVENTORY: 'psicosafe_risk_inventory_v2',
  APPOINTMENT_SLOTS: 'psicosafe_appointment_slots_v2',
  ROLE_PERMISSIONS: 'psicosafe_role_permissions_v2',
  SUPERVISORS: 'psicosafe_supervisors_v2'
};

function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error writing to localStorage', e);
  }
}

// Data Services
export const DataService = {
  isOnline(): boolean {
    return isFirebaseOnline;
  },

  // Schools / Organizações
  async getSchools(): Promise<School[]> {
    const local = getLocal<School[]>(STORAGE_KEYS.SCHOOLS, INITIAL_SCHOOLS);
    if (!firestoreDb) return local;
    try {
      const snap = await getDocs(collection(firestoreDb, 'schools'));
      if (!snap.empty) {
        const remote = snap.docs.map(d => ({ id: d.id, ...d.data() } as School));
        setLocal(STORAGE_KEYS.SCHOOLS, remote);
        return remote;
      }
    } catch (e) {
      console.warn('Firestore getSchools fallback:', e);
    }
    return local;
  },

  async saveSchool(school: School): Promise<School> {
    const current = await this.getSchools();
    const index = current.findIndex(s => s.id === school.id);
    let updated: School[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = school;
    } else {
      updated = [school, ...current];
    }
    setLocal(STORAGE_KEYS.SCHOOLS, updated);

    if (firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, 'schools', school.id), school);
      } catch (e) {
        console.warn('Firestore setDoc school error:', e);
      }
    }
    return school;
  },

  // Diagnósticos Corporativos
  async getDiagnoses(): Promise<CompanyDiagnosis[]> {
    const local = getLocal<CompanyDiagnosis[]>(STORAGE_KEYS.DIAGNOSES, INITIAL_DIAGNOSES);
    if (!firestoreDb) return local;
    try {
      const snap = await getDocs(collection(firestoreDb, 'companyDiagnoses'));
      if (!snap.empty) {
        const remote = snap.docs.map(d => ({ id: d.id, ...d.data() } as CompanyDiagnosis));
        setLocal(STORAGE_KEYS.DIAGNOSES, remote);
        return remote;
      }
    } catch (e) {
      console.warn('Firestore getDiagnoses fallback:', e);
    }
    return local;
  },

  async saveDiagnosis(diagnosis: CompanyDiagnosis): Promise<CompanyDiagnosis> {
    const current = await this.getDiagnoses();
    const index = current.findIndex(d => d.id === diagnosis.id);
    let updated: CompanyDiagnosis[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = diagnosis;
    } else {
      updated = [diagnosis, ...current];
    }
    setLocal(STORAGE_KEYS.DIAGNOSES, updated);

    if (firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, 'companyDiagnoses', diagnosis.id), diagnosis);
      } catch (e) {
        console.warn('Firestore setDoc diagnosis error:', e);
      }
    }
    return diagnosis;
  },

  // Formulários de Questionários
  async getForms(): Promise<Form[]> {
    const local = getLocal<Form[]>(STORAGE_KEYS.FORMS, INITIAL_FORMS);
    if (!firestoreDb) return local;
    try {
      const snap = await getDocs(collection(firestoreDb, 'forms'));
      if (!snap.empty) {
        const remote = snap.docs.map(d => ({ id: d.id, ...d.data() } as Form));
        setLocal(STORAGE_KEYS.FORMS, remote);
        return remote;
      }
    } catch (e) {
      console.warn('Firestore getForms fallback:', e);
    }
    return local;
  },

  async saveForm(form: Form): Promise<Form> {
    const current = await this.getForms();
    const index = current.findIndex(f => f.id === form.id);
    let updated: Form[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = form;
    } else {
      updated = [form, ...current];
    }
    setLocal(STORAGE_KEYS.FORMS, updated);

    if (firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, 'forms', form.id), form);
      } catch (e) {
        console.warn('Firestore setDoc form error:', e);
      }
    }
    return form;
  },

  // Respostas dos Questionários
  async getResponses(): Promise<Response[]> {
    const local = getLocal<Response[]>(STORAGE_KEYS.RESPONSES, INITIAL_RESPONSES);
    if (!firestoreDb) return local;
    try {
      const snap = await getDocs(collection(firestoreDb, 'responses'));
      if (!snap.empty) {
        const remote = snap.docs.map(d => ({ id: d.id, ...d.data() } as Response));
        setLocal(STORAGE_KEYS.RESPONSES, remote);
        return remote;
      }
    } catch (e) {
      console.warn('Firestore getResponses fallback:', e);
    }
    return local;
  },

  async submitResponse(response: Response): Promise<Response> {
    const current = await this.getResponses();
    const updated = [response, ...current];
    setLocal(STORAGE_KEYS.RESPONSES, updated);

    if (firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, 'responses', response.id), response);
      } catch (e) {
        console.warn('Firestore submitResponse error:', e);
      }
    }

    await this.addAuditLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'RESPOSTA_SUBMETIDA_ANONIMA',
      userEmail: 'ANONIMO@LGPD',
      userRole: 'Colaborador',
      details: `Formulário respondido anonimamente sob protocolo hash: ${response.anonymousHash}. Setor: ${response.sector}.`
    });

    return response;
  },

  // Planos de Ação / Intervenções PGR
  async getInterventions(): Promise<Intervention[]> {
    const local = getLocal<Intervention[]>(STORAGE_KEYS.INTERVENTIONS, INITIAL_INTERVENTIONS);
    if (!firestoreDb) return local;
    try {
      const snap = await getDocs(collection(firestoreDb, 'interventions'));
      if (!snap.empty) {
        const remote = snap.docs.map(d => ({ id: d.id, ...d.data() } as Intervention));
        setLocal(STORAGE_KEYS.INTERVENTIONS, remote);
        return remote;
      }
    } catch (e) {
      console.warn('Firestore getInterventions fallback:', e);
    }
    return local;
  },

  async saveIntervention(intervention: Intervention): Promise<Intervention> {
    const current = await this.getInterventions();
    const index = current.findIndex(i => i.id === intervention.id);
    let updated: Intervention[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = intervention;
    } else {
      updated = [intervention, ...current];
    }
    setLocal(STORAGE_KEYS.INTERVENTIONS, updated);

    if (firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, 'interventions', intervention.id), intervention);
      } catch (e) {
        console.warn('Firestore saveIntervention error:', e);
      }
    }

    await this.addAuditLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'ATUALIZACAO_PLANO_PGR',
      userEmail: 'coordenador.sst@psicosafe.com.br',
      userRole: 'Gestor SST',
      details: `Ação preventiva '${intervention.title}' salva para o setor '${intervention.sector}' com status '${intervention.status}'.`
    });

    return intervention;
  },

  async deleteIntervention(id: string): Promise<void> {
    const current = await this.getInterventions();
    const updated = current.filter(i => i.id !== id);
    setLocal(STORAGE_KEYS.INTERVENTIONS, updated);

    if (firestoreDb) {
      try {
        await deleteDoc(doc(firestoreDb, 'interventions', id));
      } catch (e) {
        console.warn('Firestore deleteIntervention error:', e);
      }
    }
  },

  // Inventário de Riscos (GRO / NR-1.5.7)
  async getRiskInventory(): Promise<RiskInventoryItem[]> {
    const local = getLocal<RiskInventoryItem[]>(STORAGE_KEYS.RISK_INVENTORY, INITIAL_RISK_INVENTORY);
    if (!firestoreDb) return local;
    try {
      const snap = await getDocs(collection(firestoreDb, 'riskInventory'));
      if (!snap.empty) {
        const remote = snap.docs.map(d => ({ id: d.id, ...d.data() } as RiskInventoryItem));
        setLocal(STORAGE_KEYS.RISK_INVENTORY, remote);
        return remote;
      }
    } catch (e) {
      console.warn('Firestore getRiskInventory fallback:', e);
    }
    return local;
  },

  async saveRiskInventoryItem(item: RiskInventoryItem): Promise<RiskInventoryItem> {
    const current = await this.getRiskInventory();
    const index = current.findIndex(i => i.id === item.id);
    let updated: RiskInventoryItem[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = item;
    } else {
      updated = [item, ...current];
    }
    setLocal(STORAGE_KEYS.RISK_INVENTORY, updated);

    if (firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, 'riskInventory', item.id), item);
      } catch (e) {
        console.warn('Firestore saveRiskInventoryItem error:', e);
      }
    }

    await this.addAuditLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'ATUALIZACAO_INVENTARIO_RISCOS',
      userEmail: 'eng.marcelo@psicosafe.com.br',
      userRole: 'Engenheiro SST',
      details: `Item de inventário '${item.dangerFactor}' atualizado para o grupo ${item.ghe}. Score: ${item.riskScore} (${item.riskCategory}).`
    });

    return item;
  },

  async deleteRiskInventoryItem(id: string): Promise<void> {
    const current = await this.getRiskInventory();
    const updated = current.filter(i => i.id !== id);
    setLocal(STORAGE_KEYS.RISK_INVENTORY, updated);

    if (firestoreDb) {
      try {
        await deleteDoc(doc(firestoreDb, 'riskInventory', id));
      } catch (e) {
        console.warn('Firestore deleteRiskInventoryItem error:', e);
      }
    }
  },

  // Colaboradores
  async getEmployees(): Promise<Employee[]> {
    const local = getLocal<Employee[]>(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
    if (!firestoreDb) return local;
    try {
      const snap = await getDocs(collection(firestoreDb, 'employees'));
      if (!snap.empty) {
        const remote = snap.docs.map(d => ({ id: d.id, ...d.data() } as Employee));
        setLocal(STORAGE_KEYS.EMPLOYEES, remote);
        return remote;
      }
    } catch (e) {
      console.warn('Firestore getEmployees fallback:', e);
    }
    return local;
  },

  async saveEmployee(employee: Employee): Promise<Employee> {
    const current = await this.getEmployees();
    const index = current.findIndex(e => e.id === employee.id);
    let updated: Employee[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = employee;
    } else {
      updated = [employee, ...current];
    }
    setLocal(STORAGE_KEYS.EMPLOYEES, updated);

    if (firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, 'employees', employee.id), employee);
      } catch (e) {
        console.warn('Firestore saveEmployee error:', e);
      }
    }
    return employee;
  },

  async deleteEmployee(id: string): Promise<void> {
    const current = await this.getEmployees();
    const updated = current.filter(e => e.id !== id);
    setLocal(STORAGE_KEYS.EMPLOYEES, updated);

    if (firestoreDb) {
      try {
        await deleteDoc(doc(firestoreDb, 'employees', id));
      } catch (e) {
        console.warn('Firestore deleteEmployee error:', e);
      }
    }
  },

  // Appointment Slots
  async getAppointmentSlots(): Promise<AppointmentSlot[]> {
    return getLocal<AppointmentSlot[]>(STORAGE_KEYS.APPOINTMENT_SLOTS, INITIAL_APPOINTMENT_SLOTS);
  },

  async saveAppointmentSlot(slot: AppointmentSlot): Promise<AppointmentSlot> {
    const current = await this.getAppointmentSlots();
    const index = current.findIndex(s => s.id === slot.id);
    let updated: AppointmentSlot[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = slot;
    } else {
      updated = [slot, ...current];
    }
    setLocal(STORAGE_KEYS.APPOINTMENT_SLOTS, updated);
    return slot;
  },

  // Role Permissions
  async getRolePermissions(): Promise<RolePermission[]> {
    return getLocal<RolePermission[]>(STORAGE_KEYS.ROLE_PERMISSIONS, INITIAL_ROLE_PERMISSIONS);
  },

  async saveRolePermission(perm: RolePermission): Promise<RolePermission> {
    const current = await this.getRolePermissions();
    const index = current.findIndex(p => p.id === perm.id);
    let updated: RolePermission[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = perm;
    } else {
      updated = [perm, ...current];
    }
    setLocal(STORAGE_KEYS.ROLE_PERMISSIONS, updated);
    return perm;
  },

  // Supervisors
  async getSupervisors(): Promise<Supervisor[]> {
    return getLocal<Supervisor[]>(STORAGE_KEYS.SUPERVISORS, INITIAL_SUPERVISORS);
  },

  // Trilhas de Auditoria
  async getAuditLogs(): Promise<AuditLog[]> {
    const local = getLocal<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    if (!firestoreDb) return local;
    try {
      const snap = await getDocs(collection(firestoreDb, 'auditLogs'));
      if (!snap.empty) {
        const remote = snap.docs.map(d => ({ id: d.id, ...d.data() } as AuditLog));
        setLocal(STORAGE_KEYS.AUDIT_LOGS, remote);
        return remote;
      }
    } catch (e) {
      console.warn('Firestore getAuditLogs fallback:', e);
    }
    return local;
  },

  async addAuditLog(log: AuditLog): Promise<void> {
    const current = getLocal<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    const updated = [log, ...current];
    setLocal(STORAGE_KEYS.AUDIT_LOGS, updated);

    if (firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, 'auditLogs', log.id), log);
      } catch (e) {
        console.warn('Firestore addAuditLog error:', e);
      }
    }
  },

  // Atendimentos Psicológicos
  async getAppointments(): Promise<ScheduledAppointment[]> {
    const local = getLocal<ScheduledAppointment[]>(STORAGE_KEYS.APPOINTMENTS, []);
    if (!firestoreDb) return local;
    try {
      const snap = await getDocs(collection(firestoreDb, 'scheduledAppointments'));
      if (!snap.empty) {
        const remote = snap.docs.map(d => ({ id: d.id, ...d.data() } as ScheduledAppointment));
        setLocal(STORAGE_KEYS.APPOINTMENTS, remote);
        return remote;
      }
    } catch (e) {
      console.warn('Firestore getAppointments fallback:', e);
    }
    return local;
  },

  async bookAppointment(appItem: ScheduledAppointment): Promise<ScheduledAppointment> {
    const current = await this.getAppointments();
    const updated = [appItem, ...current];
    setLocal(STORAGE_KEYS.APPOINTMENTS, updated);

    if (firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, 'scheduledAppointments', appItem.id), appItem);
      } catch (e) {
        console.warn('Firestore bookAppointment error:', e);
      }
    }

    await this.addAuditLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'AGENDAMENTO_ACOLHIMENTO_PSICOLOGICO',
      userEmail: 'CANAL_CONFIDENCIAL@PSICOLOGIA',
      userRole: 'Colaborador',
      details: `Solicitação de escuta psicológica anônima registrada (Hash: ${appItem.anonymousHash}). Turno: ${appItem.shift}.`
    });

    return appItem;
  },

  // Backup & Restore
  exportBackupJson(): string {
    const dump = {
      timestamp: new Date().toISOString(),
      version: '2.0-NR1',
      schools: getLocal(STORAGE_KEYS.SCHOOLS, INITIAL_SCHOOLS),
      diagnoses: getLocal(STORAGE_KEYS.DIAGNOSES, INITIAL_DIAGNOSES),
      forms: getLocal(STORAGE_KEYS.FORMS, INITIAL_FORMS),
      responses: getLocal(STORAGE_KEYS.RESPONSES, INITIAL_RESPONSES),
      interventions: getLocal(STORAGE_KEYS.INTERVENTIONS, INITIAL_INTERVENTIONS),
      riskInventory: getLocal(STORAGE_KEYS.RISK_INVENTORY, INITIAL_RISK_INVENTORY),
      employees: getLocal(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES),
      appointments: getLocal(STORAGE_KEYS.APPOINTMENTS, []),
      auditLogs: getLocal(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS)
    };
    return JSON.stringify(dump, null, 2);
  },

  importBackupJson(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.schools) setLocal(STORAGE_KEYS.SCHOOLS, parsed.schools);
      if (parsed.diagnoses) setLocal(STORAGE_KEYS.DIAGNOSES, parsed.diagnoses);
      if (parsed.forms) setLocal(STORAGE_KEYS.FORMS, parsed.forms);
      if (parsed.responses) setLocal(STORAGE_KEYS.RESPONSES, parsed.responses);
      if (parsed.interventions) setLocal(STORAGE_KEYS.INTERVENTIONS, parsed.interventions);
      if (parsed.riskInventory) setLocal(STORAGE_KEYS.RISK_INVENTORY, parsed.riskInventory);
      if (parsed.employees) setLocal(STORAGE_KEYS.EMPLOYEES, parsed.employees);
      if (parsed.appointments) setLocal(STORAGE_KEYS.APPOINTMENTS, parsed.appointments);
      return true;
    } catch (e) {
      console.error('Failed to import backup json', e);
      return false;
    }
  }
};
