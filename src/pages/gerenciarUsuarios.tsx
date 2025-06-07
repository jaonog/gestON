"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function GerenciarUsuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [novaSenha, setNovaSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
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
    const { data, error } = await supabase.from("Usuarios").select("*").order("id", { ascending: true });
    if (error) {
      setMensagem(`Erro ao carregar usuários: ${error.message}`);
    } else {
      setUsuarios(data || []);
    }
  };

  const adicionarUsuario = async () => {
    if (!novaSenha) {
      setMensagem("Informe a senha.");
      return;
    }

    const { error } = await supabase.from("Usuarios").insert([
      {
        senha: novaSenha,
        tipo: "comum",
      },
    ]);

    if (error) {
      setMensagem(`Erro ao adicionar: ${error.message}`);
    } else {
      setMensagem("Usuário adicionado com sucesso!");
      setNovaSenha("");
      carregarUsuarios();
    }
  };

  const excluirUsuario = async (id: number) => {
    if (!confirm("Deseja excluir este usuário?")) return;

    const { error } = await supabase.from("Usuarios").delete().eq("id", id);

    if (error) {
      setMensagem(`Erro ao excluir: ${error.message}`);
    } else {
      setMensagem("Usuário excluído com sucesso.");
      carregarUsuarios();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-10">
      <h2 className="text-2xl font-bold mb-6">Gerenciar Usuários</h2>

      {mensagem && <p className="text-green-400 mb-4">{mensagem}</p>}

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Senha"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          className="bg-neutral-800 p-2 rounded text-white"
        />
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
            <th className="p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className="border-b border-zinc-700">
              <td className="p-2">{u.id}</td>
              <td className="p-2">{u.tipo}</td>
              <td className="p-2">
                {u.tipo !== "admin" && (
                  <button
                    onClick={() => excluirUsuario(u.id)}
                    className="text-red-400 hover:underline"
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
