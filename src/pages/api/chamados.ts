import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // GET - Listar todos os chamados com cliente e itens
    if (req.method === "GET") {
      const chamados = await prisma.chamado.findMany({
        include: {
          cliente: true,
          itens: {
            include: {
              equipamento: true,
            },
          },
        },
        orderBy: {
          data: "desc",
        },
      });
      return res.status(200).json(chamados);
    }

    // POST - Criar novo chamado com itens
    if (req.method === "POST") {
      const { clienteId, tecnico, status, data, itens = [] } = req.body;

      if (!clienteId || !tecnico || !status || !data || !Array.isArray(itens)) {
        return res.status(400).json({ error: "Dados incompletos" });
      }

      // Cria o chamado principal
      const chamado = await prisma.chamado.create({
        data: {
          clienteId,
          tecnico,
          status,
          data: new Date(data),
        },
      });

      // Prepara e cria os itens vinculados
      if (itens.length > 0) {
        const itensCriar = itens.map((item: any) => ({
          chamadoId: chamado.id,
          equipamentoId: Number(item.equipamentoId),
          problema: item.problema?.toString() || "",
          solucao: item.solucao?.toString() || "",
        }));

        await prisma.chamadoItem.createMany({ data: itensCriar });
      }

      // Busca o chamado completo com os dados
      const chamadoCompleto = await prisma.chamado.findUnique({
        where: { id: chamado.id },
        include: {
          cliente: true,
          itens: { include: { equipamento: true } },
        },
      });

      return res.status(201).json(chamadoCompleto);
    }

    // PUT - Atualizar chamado e recriar itens
    if (req.method === "PUT") {
      const { id, clienteId, tecnico, status, data, itens = [] } = req.body;
      const chamadoId = typeof id === "string" ? Number(id) : id;

      if (!chamadoId || !clienteId || !tecnico || !status || !data || !Array.isArray(itens)) {
        return res.status(400).json({ error: "Dados inválidos para atualização" });
      }

      // Atualiza o chamado
      await prisma.chamado.update({
        where: { id: chamadoId },
        data: {
          clienteId,
          tecnico,
          status,
          data: new Date(data),
        },
      });

      // Remove os itens antigos
      await prisma.chamadoItem.deleteMany({ where: { chamadoId } });

      // Cria novos itens, se existirem
      if (itens.length > 0) {
        const itensCriar = itens.map((item: any) => ({
          chamadoId,
          equipamentoId: Number(item.equipamentoId),
          problema: item.problema?.toString() || "",
          solucao: item.solucao?.toString() || "",
        }));

        await prisma.chamadoItem.createMany({ data: itensCriar });
      }

      // Retorna o chamado atualizado com cliente e itens
      const chamadoAtualizado = await prisma.chamado.findUnique({
        where: { id: chamadoId },
        include: {
          cliente: true,
          itens: { include: { equipamento: true } },
        },
      });

      return res.status(200).json(chamadoAtualizado);
    }

    // DELETE - Remover chamado e seus itens
    if (req.method === "DELETE") {
      const { id } = req.body;
      const chamadoId = typeof id === "string" ? Number(id) : id;

      if (!chamadoId) {
        return res.status(400).json({ error: "ID inválido" });
      }

      await prisma.chamadoItem.deleteMany({ where: { chamadoId } });
      await prisma.chamado.delete({ where: { id: chamadoId } });

      return res.status(204).end();
    }

    // Método não permitido
    return res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    console.error("Erro na API de chamados:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}
