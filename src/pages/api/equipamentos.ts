import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const equipamentos = await prisma.equipamento.findMany();
      return res.status(200).json(equipamentos);
    }

    if (req.method === "POST") {
      const novo = await prisma.equipamento.create({ data: req.body });
      return res.status(201).json(novo);
    }

    if (req.method === "PUT") {
      const atualizado = await prisma.equipamento.update({
        where: { id: req.body.id },
        data: req.body,
      });
      return res.status(200).json(atualizado);
    }

    if (req.method === "DELETE") {
      await prisma.equipamento.delete({ where: { id: req.body.id } });
      return res.status(204).end();
    }

    return res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    console.error("Erro na API de equipamentos:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
