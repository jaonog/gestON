export async function listarEquipamentos() {
  const res = await fetch("/api/equipamentos");
  return res.json();
}

export async function criarEquipamento(equipamento: any) {
  const res = await fetch("/api/equipamentos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(equipamento),
  });
  return res.json();
}

export async function atualizarEquipamento(equipamento: any) {
  const res = await fetch("/api/equipamentos", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(equipamento),
  });
  return res.json();
}

export async function excluirEquipamento(id: number) {
  await fetch("/api/equipamentos", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
}
