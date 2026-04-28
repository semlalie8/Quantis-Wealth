import { Request, Response } from 'express';
import { prisma } from '../index';
import { z } from 'zod';

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).optional(),
});

export class UserController {
  async getAll(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({
        include: { portfolios: { select: { id: true, name: true } } },
      });
      res.json({ data: users });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve users' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        include: {
          portfolios: {
            include: { assets: { include: { asset: true } } },
          },
        },
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ data: user });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve user' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const parsed = CreateUserSchema.parse(req.body);
      const user = await prisma.user.create({ data: parsed });
      res.status(201).json({ data: user });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create user' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const user = await prisma.user.update({
        where: { id: req.params.id },
        data: req.body,
      });
      res.json({ data: user });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user' });
    }
  }
}
