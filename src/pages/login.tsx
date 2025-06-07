"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [identificador, setIdentificador] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setErro("");
    if (!identificador || !senha) {
      setErro("Preencha identificador e senha.");
      return;
    }

    const idNumerico = parseInt(identificador);
    if (isNaN(idNumerico)) {
      setErro("Identificador inválido.");
      return;
    }

    const { data: usuario, error } = await supabase
      .from("Usuarios") // IMPORTANTE: aspas duplas dentro da string!
      .select("*")
      .eq("id", idNumerico)
      .limit(1)
      .single();

    if (error || !usuario) {
      setErro("Usuário não encontrado.");
      return;
    }

    if (usuario.senha !== senha) {
      setErro("Senha incorreta.");
      return;
    }

    localStorage.setItem("logado", "true");
    localStorage.setItem(
      "usuario",
      JSON.stringify({ id: usuario.id, tipo: usuario.tipo })
    );
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-sky-900 via-stone-900 to-stone-950 opacity-30 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(59,130,246,0.2),rgba(59,130,246,0.2) 2px,transparent 2px,transparent 6px)] pointer-events-none z-0" />

      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-12 relative z-10">
        <div className="md:w-1/2 flex items-center justify-center">
          <div className="bg-neutral-900 p-8 rounded-2xl w-full max-w-sm shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">
              Acesse o <span className="text-sky-500">Sistema</span>
            </h2>

            {erro && <p className="text-red-400 text-sm mb-4">{erro}</p>}

            <label className="block text-sm font-semibold mb-2" htmlFor="id">
              IDENTIFICADOR
            </label>
            <input
              id="id"
              type="text"
              value={identificador}
              onChange={(e) => setIdentificador(e.target.value)}
              className="w-full p-3 rounded bg-neutral-800 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent transition duration-300"
              placeholder="Digite seu identificador"
            />

            <label className="block text-sm font-semibold mb-2" htmlFor="senha">
              SENHA
            </label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-3 rounded bg-neutral-800 text-white mb-6 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent transition duration-300"
              placeholder="Digite sua senha"
            />

            <button
              onClick={handleLogin}
              className="w-full bg-sky-700 hover:bg-sky-800 transform hover:scale-105 transition duration-300 ease-in-out text-white font-bold py-2 rounded shadow-lg"
            >
              ACESSAR
            </button>
          </div>
        </div>

        <div className="md:w-1/2 flex items-center justify-center relative">
          <div className="relative w-full max-w-xl">
            <h1 className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-4xl font-bold z-10">
              GEST <span className="underline decoration-sky-600">ON</span>
            </h1>

            <Image
              src="/login-illustration.png"
              alt="Ilustração"
              width={1000}
              height={1000}
              className="w-full h-auto transition-transform duration-500 ease-in-out hover:scale-105"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
