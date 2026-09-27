import { useState, useMemo } from 'react';
import { Users, Plus, Trash2, CheckCircle2, XCircle, Search, UserCheck } from 'lucide-react';
import { Employee, School } from '../types';

interface Props {
  employees: Employee[];
  currentSchool: School;
  onSaveEmployee: (employee: Employee) => Promise<void>;
  onDeleteEmployee: (id: string) => Promise<void>;
}

export function EmployeesTab({ employees, currentSchool, onSaveEmployee, onDeleteEmployee }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('todos');
  const [showModal, setShowModal] = useState(false);

  const [newEmp, setNewEmp] = useState<Partial<Employee>>({
    name: '',
    role: '',
    sector: 'Operacional',
    shift: 'Comercial',
    admissionDate: new Date().toISOString().split('T')[0],
    status: 'Ativo'
  });

  const schoolEmployees = useMemo(() => {
    return employees.filter(e => e.schoolId === currentSchool.id);
  }, [employees, currentSchool]);

  const filtered = useMemo(() => {
    return schoolEmployees.filter(e => {
      const matchSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSector = sectorFilter === 'todos' || e.sector === sectorFilter;
      return matchSearch && matchSector;
    });
  }, [schoolEmployees, searchTerm, sectorFilter]);

  // Sector participation stats
  const sectorStats = useMemo(() => {
    const stats: Record<string, { total: number; responded: number }> = {
      Operacional: { total: 0, responded: 0 },
      Administrativo: { total: 0, responded: 0 },
      'Gestão e Liderança': { total: 0, responded: 0 }
    };

    schoolEmployees.forEach(e => {
      const s = e.sector in stats ? e.sector : 'Operacional';
      stats[s].total += 1;
      if (e.hasRespondedSurvey) stats[s].responded += 1;
    });

    return stats;
  }, [schoolEmployees]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmp.name || !newEmp.role) {
      alert('Nome e Cargo são obrigatórios.');
      return;
    }

    const emp: Employee = {
      id: `emp-${Date.now()}`,
      schoolId: currentSchool.id,
      name: newEmp.name,
      role: newEmp.role,
      sector: (newEmp.sector as any) || 'Operacional',
      shift: (newEmp.shift as any) || 'Comercial',
      admissionDate: newEmp.admissionDate || '2025-01-01',
      status: (newEmp.status as any) || 'Ativo',
      hasRespondedSurvey: false
    };

    await onSaveEmployee(emp);
    setShowModal(false);
    setNewEmp({
      name: '',
      role: '',
      sector: 'Operacional',
      shift: 'Comercial',
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'Ativo'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600" />
            Gestão de Colaboradores e Taxa de Adesão à Avaliação
          </h3>
          <p className="text-xs text-slate-500">
            Acompanhe a amostragem necessária para validade estatística da pesquisa por setor conforme a NR-1.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Cadastrar Colaborador</span>
        </button>
      </div>

      {/* Cards de Adesão por Setor */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.entries(sectorStats).map(([sec, val]) => {
          const rate = val.total > 0 ? Math.round((val.responded / val.total) * 100) : 0;
          return (
            <div key={sec} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">{sec}</span>
                <span className="font-mono text-teal-700 font-bold">{rate}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                <div className="bg-teal-600 h-full rounded-full transition-all" style={{ width: `${rate}%` }} />
              </div>
              <span className="text-[11px] text-slate-500 mt-2 block">
                {val.responded} de {val.total} responderam anonimamente
              </span>
            </div>
          );
        })}
      </div>

      {/* Barra de Pesquisa e Filtros */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou cargo..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sectorFilter}
            onChange={e => setSectorFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 text-xs rounded-lg px-3 py-2 outline-none font-medium"
          >
            <option value="todos">Todos os Setores</option>
            <option value="Operacional">Operacional</option>
            <option value="Administrativo">Administrativo</option>
            <option value="Gestão e Liderança">Gestão e Liderança</option>
          </select>
        </div>
      </div>

      {/* Tabela de Colaboradores */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Colaborador / Matrícula</th>
                <th className="py-3 px-4">Função / Cargo</th>
                <th className="py-3 px-4">Setor</th>
                <th className="py-3 px-4">Turno</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Pesquisa NR-1</th>
                <th className="py-3 px-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900 block">{emp.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {emp.id}</span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">{emp.role}</td>
                  <td className="py-3 px-4 text-slate-600">{emp.sector}</td>
                  <td className="py-3 px-4 text-slate-600">{emp.shift}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                      emp.status === 'Ativo'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {emp.hasRespondedSurvey ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Participou
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        <XCircle className="w-3 h-3 text-slate-400" />
                        Pendente
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => onDeleteEmployee(emp.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      title="Excluir Colaborador"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Novo Colaborador */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-teal-600" />
              Novo Colaborador
            </h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 block font-semibold mb-1">Nome Completo:</label>
                <input
                  type="text"
                  required
                  value={newEmp.name}
                  onChange={e => setNewEmp({ ...newEmp, name: e.target.value })}
                  placeholder="Ex: João da Silva"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-700 block font-semibold mb-1">Função / Cargo:</label>
                <input
                  type="text"
                  required
                  value={newEmp.role}
                  onChange={e => setNewEmp({ ...newEmp, role: e.target.value })}
                  placeholder="Ex: Operador de Máquinas"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-700 block font-semibold mb-1">Setor:</label>
                  <select
                    value={newEmp.sector}
                    onChange={e => setNewEmp({ ...newEmp, sector: e.target.value as any })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 outline-none font-medium"
                  >
                    <option value="Operacional">Operacional</option>
                    <option value="Administrativo">Administrativo</option>
                    <option value="Gestão e Liderança">Gestão e Liderança</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 block font-semibold mb-1">Turno:</label>
                  <select
                    value={newEmp.shift}
                    onChange={e => setNewEmp({ ...newEmp, shift: e.target.value as any })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 outline-none font-medium"
                  >
                    <option value="Comercial">Comercial</option>
                    <option value="Matutino">Matutino</option>
                    <option value="Vespertino">Vespertino</option>
                    <option value="Noturno">Noturno</option>
                    <option value="Revezamento">Revezamento</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-2 rounded-lg text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer shadow-xs"
                >
                  Salvar Colaborador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
