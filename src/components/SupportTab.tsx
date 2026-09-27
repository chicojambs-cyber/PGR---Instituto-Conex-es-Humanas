import { useState } from 'react';
import { HeartHandshake, Calendar, Clock, CheckCircle2, Shield, UserCheck } from 'lucide-react';
import { ScheduledAppointment, AppointmentSlot, School } from '../types';

interface Props {
  appointments: ScheduledAppointment[];
  slots: AppointmentSlot[];
  currentSchool: School;
  anonymousHash: string;
  onBookAppointment: (item: ScheduledAppointment) => Promise<void>;
}

export function SupportTab({
  appointments,
  slots,
  currentSchool,
  anonymousHash,
  onBookAppointment
}: Props) {
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [sector, setSector] = useState('Operacional');
  const [reason, setReason] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const slot = slots.find(s => s.id === selectedSlotId);
    if (!slot) {
      alert('Por favor, selecione um horário disponível.');
      return;
    }

    const appItem: ScheduledAppointment = {
      id: `app-${Date.now()}`,
      schoolId: currentSchool.id,
      sector: sector,
      preferredDate: slot.date,
      shift: slot.shift,
      anonymousHash: anonymousHash,
      reason: reason || 'Atendimento de suporte emocional e manejo de estresse ocupacional.',
      professionalName: slot.professionalName,
      status: 'Agendado',
      createdAt: new Date().toISOString()
    };

    await onBookAppointment(appItem);
    setBookingSuccess(true);
    setReason('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner de Sigilo Ético */}
      <div className="bg-pink-50/80 border border-pink-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-pink-600 rounded-xl text-white">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-pink-950 flex items-center gap-2">
              Canal de Acolhimento e Orientação Psicológica Ocupacional
            </h3>
            <p className="text-xs text-pink-900 leading-relaxed">
              Serviço especializado com <strong>sigilo profissional absoluto</strong> respaldado pelo Código de Ética do Psicólogo (Resolução CFP nº 010/2005) e pela LGPD. O empregador <strong>NUNCA</strong> terá acesso à sua identidade nem ao teor das conversas.
            </p>
            <div className="pt-1 text-[11px] font-mono text-pink-800">
              Protocolo Hash Ativo: <strong>{anonymousHash}</strong>
            </div>
          </div>
        </div>
      </div>

      {bookingSuccess ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-slate-900">Acolhimento Confirmado!</h4>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Seu agendamento foi registrado com sucesso. Guarde o seu código hash anônimo para comparecer à sessão no horário escolhido.
          </p>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800 inline-block">
            {anonymousHash}
          </div>
          <div>
            <button
              onClick={() => setBookingSuccess(false)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-pink-600 hover:bg-pink-700 text-white cursor-pointer shadow-xs"
            >
              Fazer Novo Agendamento
            </button>
          </div>
        </div>
      ) : (
        /* Agendador com Slots Disponíveis */
        <form onSubmit={handleBook} className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-xs">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Selecione um Horário com o Especialista</h4>
            <p className="text-xs text-slate-500">Escolha a data e o horário mais conveniente para o seu atendimento telepresencial.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {slots.map(slot => {
              const isSelected = selectedSlotId === slot.id;
              return (
                <button
                  type="button"
                  key={slot.id}
                  onClick={() => setSelectedSlotId(slot.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-pink-50/70 border-pink-500 shadow-xs ring-1 ring-pink-500'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-pink-600" />
                      {slot.time}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {slot.shift}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>Data: {slot.date}</span>
                  </div>
                  <div className="text-[11px] text-pink-800 font-medium mt-1 truncate">
                    {slot.professionalName}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div>
              <label className="text-slate-700 block font-semibold mb-1">Setor de Origem (Apenas para estatística):</label>
              <select
                value={sector}
                onChange={e => setSector(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 outline-none"
              >
                <option value="Operacional">Operacional</option>
                <option value="Administrativo">Administrativo</option>
                <option value="Gestão">Gestão</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 block font-semibold mb-1">Motivo Principal (Opcional):</label>
              <input
                type="text"
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Ex: Manejo de ansiedade, estresse com prazos..."
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-2"
            >
              <span>Confirmar Agendamento Anônimo</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* Histórico de Agendamentos Cadastrados */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-pink-600" />
          Atendimentos Agendados na Plataforma
        </h4>

        {appointments.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            Nenhum atendimento agendado no período.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {appointments.map(appItem => (
              <div key={appItem.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-pink-800 bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                      {appItem.anonymousHash}
                    </span>
                    <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">Turno: {appItem.shift}</span>
                    <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                      {appItem.status}
                    </span>
                  </div>
                  <p className="text-slate-600">
                    {appItem.reason} {appItem.professionalName ? `· Profissional: ${appItem.professionalName}` : ''}
                  </p>
                </div>
                <div className="text-[11px] font-mono text-slate-500 whitespace-nowrap">
                  Data: {appItem.preferredDate}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
