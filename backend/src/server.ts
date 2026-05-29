import Fastify from 'fastify';

const app = Fastify({ logger: true });

app.get('/health', async () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };
});

app.get('/', async () => {
  return {
    message: '99dev API is running',
  };
});

const port = Number(process.env.PORT ?? 3001);
const host = process.env.HOST ?? '0.0.0.0';

const start = async () => {
  try {
    await app.listen({ port, host });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

void start();