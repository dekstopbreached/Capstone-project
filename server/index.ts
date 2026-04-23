import cors from '@fastify/cors';
import Fastify from 'fastify';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  checkoutResendBodySchema,
  checkoutStartBodySchema,
  checkoutVerifyBodySchema,
} from '../shared/schemas.js';
import {
  createPendingOrder,
  priceCheckoutItems,
  replaceVerificationCode,
  verifyAndConfirmOrder,
} from './checkout.js';
import { connectMongo, getDb } from './db.js';

const port = Number(process.env.PORT ?? 3001);
const host = process.env.HOST ?? '127.0.0.1';

async function main() {
  await connectMongo();
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: true,
  });

  const __dirname = fileURLToPath(new URL('.', import.meta.url));

  app.get('/api/products', async (req, reply) => {
    try {
      const dataPath = join(__dirname, '../data/products.json');
      const products = JSON.parse(readFileSync(dataPath, 'utf8'));
      return { products };
    } catch (err) {
      req.log.error(err);
      return reply.code(500).send({ error: 'Failed to load products' });
    }
  });

  app.post('/api/checkout/start', async (req, reply) => {
    const database = getDb();
    const parsed = checkoutStartBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: 'Validation failed',
        details: parsed.error.flatten(),
      });
    }

    const priced = await priceCheckoutItems(database, parsed.data.items);
    if ('error' in priced) {
      return reply.code(400).send({ error: priced.error });
    }

    const sessionId = randomUUID();
    const { code } = await createPendingOrder(
      database,
      sessionId,
      parsed.data,
      priced.lines,
      priced.subtotalCents,
    );

    const leakOtp = process.env.NODE_ENV !== 'production';
    if (leakOtp) {
      req.log.info(
        { sessionId, email: parsed.data.email, otp: code },
        'checkout OTP (dev only)',
      );
    }

    return {
      sessionId,
      subtotalCents: priced.subtotalCents,
      ...(leakOtp ? { devOtp: code } : {}),
    };
  });

  app.post('/api/checkout/verify', async (req, reply) => {
    const database = getDb();
    const parsed = checkoutVerifyBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: 'Validation failed',
        details: parsed.error.flatten(),
      });
    }

    const result = await verifyAndConfirmOrder(
      database,
      parsed.data.sessionId,
      parsed.data.code,
    );

    if ('error' in result) {
      return reply.code(400).send({ error: result.error });
    }

    return { ok: true };
  });

  app.post('/api/checkout/resend', async (req, reply) => {
    const database = getDb();
    const parsed = checkoutResendBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: 'Validation failed',
        details: parsed.error.flatten(),
      });
    }

    const result = await replaceVerificationCode(
      database,
      parsed.data.sessionId,
    );
    if ('error' in result) {
      return reply.code(400).send({ error: result.error });
    }

    const leakOtp = process.env.NODE_ENV !== 'production';
    if (leakOtp) {
      req.log.info(
        { sessionId: parsed.data.sessionId, otp: result.code },
        'resend OTP (dev only)',
      );
    }

    return {
      ok: true,
      ...(leakOtp ? { devOtp: result.code } : {}),
    };
  });

  try {
    await app.listen({ port, host });
    app.log.info(`API listening on http://${host}:${port}`);
    app.log.info(
      `MongoDB: ${process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017'} / db=${process.env.MONGODB_DB ?? 'streetwear'}`,
    );
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();