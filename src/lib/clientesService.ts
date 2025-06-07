export async function listarClientes() {
  const res = await fetch("/api/clientes");
  if (!res.ok) throw new Error("Erro ao listar clientes");
  return res.json();
}

export async function criarCliente(cliente: any) {
  const res = await fetch("/api/clientes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cliente),
  });
  if (!res.ok) throw new Error("Erro ao criar cliente");
  return res.json();
}

export async function atualizarCliente(cliente: any) {
  // Garantir que id seja número e enviar só os campos permitidos
  const corpo = {
    id: Number(cliente.id),
    nome: cliente.nome,
    cpfCnpj: cliente.cpfCnpj,
    telefone: cliente.telefone,
    email: cliente.email,
    endereco: cliente.endereco,
  };

  const res = await fetch("/api/clientes", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
  });

  if (!res.ok) {
    const texto = await res.text();
    console.error("Erro na resposta da API:", texto);
    throw new Error("Erro ao atualizar cliente");
  }

  return res.json();
}

export async function excluirCliente(id: number) {
  const res = await fetch("/api/clientes", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: Number(id) }),
  });

  if (!res.ok) {
    const texto = await res.text();
    console.error("Erro ao deletar cliente:", texto);
    throw new Error("Erro ao deletar cliente");
  }
}
