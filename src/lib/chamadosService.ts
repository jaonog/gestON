<<<<<<< HEAD
import { getDB } from './db'

export async function salvarChamado(chamado: any) {
  const db = await getDB()
  await db.put('chamados', chamado)
}

export async function listarChamados() {
  const db = await getDB()
  return await db.getAll('chamados')
}

export async function excluirChamado(id: number) {
  const db = await getDB()
  await db.delete('chamados', id)
=======
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
>>>>>>> 18c7c88 (Mudanças finais)
}
