import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {

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

  
    if (req.method === "POST") {
      const { clienteId, tecnico, status, data, itens = [] } = req.body;

      if (!clienteId || !tecnico || !status || !data || !Array.isArray(itens)) {
        return res.status(400).json({ error: "Dados incompletos" });
      }

      const chamado = await prisma.chamado.create({
        data: {
          clienteId,
          tecnico,
          status,
          data: new Date(data),
        },
      });

      if (itens.length > 0) {
        const itensCriar = itens.map((item: any) => ({
          chamadoId: chamado.id,
          equipamentoId: Number(item.equipamentoId),
          problema: item.problema?.toString() || "",
          solucao: item.solucao?.toString() || "",
        }));

        await prisma.chamadoItem.createMany({ data: itensCriar });
      }

      const chamadoCompleto = await prisma.chamado.findUnique({
        where: { id: chamado.id },
        include: {
          cliente: true,
          itens: { include: { equipamento: true } },
        },
      });

      return res.status(201).json(chamadoCompleto);
    }

    if (req.method === "PUT") {
      const { id, clienteId, tecnico, status, data, itens = [] } = req.body;
      const chamadoId = typeof id === "string" ? Number(id) : id;

      if (!chamadoId || !clienteId || !tecnico || !status || !data || !Array.isArray(itens)) {
        return res.status(400).json({ error: "Dados inválidos para atualização" });
      }

      await prisma.chamado.update({
        where: { id: chamadoId },
        data: {
          clienteId,
          tecnico,
          status,
          data: new Date(data),
        },
      });

      await prisma.chamadoItem.deleteMany({ where: { chamadoId } });

      if (itens.length > 0) {
        const itensCriar = itens.map((item: any) => ({
          chamadoId,
          equipamentoId: Number(item.equipamentoId),
          problema: item.problema?.toString() || "",
          solucao: item.solucao?.toString() || "",
        }));

        await prisma.chamadoItem.createMany({ data: itensCriar });
      }

      const chamadoAtualizado = await prisma.chamado.findUnique({
        where: { id: chamadoId },
        include: {
          cliente: true,
          itens: { include: { equipamento: true } },
        },
      });

      return res.status(200).json(chamadoAtualizado);
    }

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

    return res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    console.error("Erro na API de chamados:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}
