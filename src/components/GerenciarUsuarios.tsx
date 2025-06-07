import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function GerenciarUsuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [novoId, setNovoId] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [mostrarSenhaInput, setMostrarSenhaInput] = useState(false);
  const [novoTipo, setNovoTipo] = useState<"admin" | "atendente" | "tecnico">("atendente");
  const [mensagem, setMensagem] = useState("");
  const [mostrarSenhas, setMostrarSenhas] = useState<{ [key: number]: boolean }>({});
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuario") || "null");
    if (!user || user.tipo !== "admin") {
      router.push("/login");
    } else {
      carregarUsuarios();
    }
  }, []);

  const carregarUsuarios = async () => {
    const { data, error } = await supabase.from("Usuarios").select("id, tipo, senha");
    if (!error) setUsuarios(data || []);
  };

  const adicionarUsuario = async () => {
    setMensagem("");
    if (!novoId || !novaSenha) {
      setMensagem("Preencha todos os campos.");
      return;
    }

    const { data: existente } = await supabase
      .from("Usuarios")
      .select("*")
      .eq("id", parseInt(novoId));

    if (existente && existente.length > 0) {
      setMensagem("Usuário já existe.");
      return;
    }

    const { error } = await supabase.from("Usuarios").insert([
      {
        id: parseInt(novoId),
        senha: novaSenha,
        tipo: novoTipo,
      },
    ]);

    if (error) {
      setMensagem("Erro: " + error.message);
    } else {
      setMensagem("Usuário adicionado com sucesso!");
      setNovoId("");
      setNovaSenha("");
      setNovoTipo("atendente");
      carregarUsuarios();
    }
  };

  const excluirUsuario = async (id: number) => {
    if (!confirm("Deseja excluir este usuário?")) return;
    const { error } = await supabase.from("Usuarios").delete().eq("id", id);
    if (error) {
      setMensagem("Erro ao excluir: " + error.message);
    } else {
      setMensagem("Usuário excluído.");
      carregarUsuarios();
    }
  };

  const alternarVisibilidadeSenha = (id: number) => {
    setMostrarSenhas((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-10">
      <h2 className="text-2xl font-bold mb-6">Gerenciar Usuários</h2>

      {mensagem && <p className="text-green-400 mb-4">{mensagem}</p>}

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="number"
          placeholder="Identificador"
          value={novoId}
          onChange={(e) => setNovoId(e.target.value)}
          className="bg-neutral-800 p-2 rounded text-white"
        />

        <div className="relative">
          <input
            type={mostrarSenhaInput ? "text" : "password"}
            placeholder="Senha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            className="bg-neutral-800 p-2 pr-10 rounded text-white"
          />
          <button
            type="button"
            onClick={() => setMostrarSenhaInput(!mostrarSenhaInput)}
            className="absolute right-2 top-2 text-white"
          >
            {mostrarSenhaInput ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <select
          value={novoTipo}
          onChange={(e) => setNovoTipo(e.target.value as "admin" | "atendente" | "tecnico")}
          className="bg-neutral-800 p-2 rounded text-white"
        >
          <option value="admin">Admin</option>
          <option value="atendente">Atendente</option>
          <option value="tecnico">Técnico</option>
        </select>

        <button
          onClick={adicionarUsuario}
          className="bg-sky-700 hover:bg-sky-800 px-4 py-2 rounded"
        >
          Adicionar
        </button>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="text-sky-400">
            <th className="p-2">ID</th>
            <th className="p-2">Tipo</th>
            <th className="p-2">Senha</th>
            <th className="p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className="border-b border-zinc-700">
              <td className="p-2">{u.id}</td>
              <td className="p-2">{u.tipo}</td>
             <td className="p-2">
                {u.tipo === "admin" ? (
                  <span className="italic text-zinc-400">Oculto</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>{mostrarSenhas[u.id] ? u.senha : "•".repeat(8)}</span>
                    <button onClick={() => alternarVisibilidadeSenha(u.id)}>
                      {mostrarSenhas[u.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                )}
              </td>

              <td className="p-2">
                {u.tipo !== "admin" && (
                  <button
                    onClick={() => excluirUsuario(u.id)}
                    className="text-red-400 hover:text-red-200"
                  >
                    Excluir
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
