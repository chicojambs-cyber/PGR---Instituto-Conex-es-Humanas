import { useState } from 'react';
import { Shield, Check, X, Lock } from 'lucide-react';
import { RolePermission } from '../types';

interface Props {
  permissions: RolePermission[];
  onSavePermission: (perm: RolePermission) => Promise<void>;
}

export function PermissionsTab({ permissions, onSavePermission }: Props) {
  const [items, setItems] = useState<RolePermission[]>(permissions);

  const toggle = async (id: string, key: keyof Omit<RolePermission, 'id' | 'roleName'>) => {
    const updated = items.map(p => {
      if (p.id === id) {
        return { ...p, [key]: !p[key] };
      }
      return p;
    });
    setItems(updated);
    const target = updated.find(p => p.id === id);
    if (target) {
      await onSavePermission(target);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-teal-600" />
          Matriz de Governança, Papéis e Permissões (RBAC)
        </h3>
        <p className="text-xs text-slate-500">
          Controle de acesso granular em estrita conformidade com a LGPD e o sigilo ético de SST / Medicina do Trabalho.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Papel / Perfil</th>
                <th className="py-3 px-3 text-center">Visualizar Laudos</th>
                <th className="py-3 px-3 text-center">Editar Plano PGR</th>
                <th className="py-3 px-3 text-center">Gestão Colaboradores</th>
                <th className="py-3 px-3 text-center">Acolhimento Psicológico</th>
                <th className="py-3 px-3 text-center">Emitir PDF</th>
                <th className="py-3 px-3 text-center">Logs Auditoria</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {items.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-teal-600" />
                    {p.roleName}
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => toggle(p.id, 'canViewReports')}
                      className={`w-6 h-6 rounded flex items-center justify-center mx-auto cursor-pointer ${
                        p.canViewReports ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {p.canViewReports ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    </button>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => toggle(p.id, 'canEditPgr')}
                      className={`w-6 h-6 rounded flex items-center justify-center mx-auto cursor-pointer ${
                        p.canEditPgr ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {p.canEditPgr ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    </button>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => toggle(p.id, 'canManageEmployees')}
                      className={`w-6 h-6 rounded flex items-center justify-center mx-auto cursor-pointer ${
                        p.canManageEmployees ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {p.canManageEmployees ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    </button>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => toggle(p.id, 'canAccessAppointments')}
                      className={`w-6 h-6 rounded flex items-center justify-center mx-auto cursor-pointer ${
                        p.canAccessAppointments ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {p.canAccessAppointments ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    </button>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => toggle(p.id, 'canExportPdf')}
                      className={`w-6 h-6 rounded flex items-center justify-center mx-auto cursor-pointer ${
                        p.canExportPdf ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {p.canExportPdf ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    </button>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => toggle(p.id, 'canAuditLogs')}
                      className={`w-6 h-6 rounded flex items-center justify-center mx-auto cursor-pointer ${
                        p.canAuditLogs ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {p.canAuditLogs ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
