type EnvConfig = {
  port: number;
  host: string;
};

export const env: EnvConfig = {
  port: Number(process.env.PORT ?? 3001),
  host: process.env.HOST ?? '0.0.0.0',
};