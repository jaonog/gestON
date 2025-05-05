import { useState } from "react";

type NovoChamadoModalProps = {
  onClose: () => void;
  onSalvar: (chamado: {
    cliente: string;
    equipamento: string;
    problema: string;
    solucao: string;
    status: "Pendente" | "Em andamento" | "Concluído";
  }) => void;
};

export default function NovoChamadoModal({ onClose, onSalvar }: NovoChamadoModalProps) {
  const [cliente, setCliente] = useState("");
  const [equipamento, setEquipamento] = useState("");
  const [problema, setProblema] = useState("");
  const [solucao, setSolucao] = useState("");
  const [status, setStatus] = useState<"Pendente" | "Em andamento" | "Concluído">("Pendente");

  const handleSubmit = () => {
    onSalvar({ cliente, equipamento, problema, solucao, status });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neutral-900 p-6 rounded shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Novo Chamado</h2>

        <input
          type="text"
          placeholder="Cliente"
          className="w-full mb-3 p-2 rounded bg-neutral-800 text-white"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
        />
        <input
          type="text"
          placeholder="Equipamento"
          className="w-full mb-3 p-2 rounded bg-neutral-800 text-white"
          value={equipamento}
          onChange={(e) => setEquipamento(e.target.value)}
        />
        <textarea
          placeholder="Descrição do problema"
          className="w-full mb-3 p-2 rounded bg-neutral-800 text-white"
          value={problema}
          onChange={(e) => setProblema(e.target.value)}
        />
        <textarea
          placeholder="Solução"
          className="w-full mb-3 p-2 rounded bg-neutral-800 text-white"
          value={solucao}
          onChange={(e) => setSolucao(e.target.value)}
        />
        <select
          className="w-full mb-3 p-2 rounded bg-neutral-800 text-white"
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
        >
          <option value="Pendente">Pendente</option>
          <option value="Em andamento">Em andamento</option>
          <option value="Concluído">Concluído</option>
        </select>

        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-600 rounded" onClick={onClose}>
            Cancelar
          </button>
          <button className="px-4 py-2 bg-sky-800 rounded" onClick={handleSubmit}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
