export async function listarChamados() {
  const res = await fetch("/api/chamados");
  return res.json();
}

export async function salvarChamado(chamado: any) {
  const res = await fetch("/api/chamados", {
    method: chamado.id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(chamado),
  });
  return res.json();
}

export async function excluirChamado(id: number) {
  await fetch("/api/chamados", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
}
