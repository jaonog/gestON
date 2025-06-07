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
}
