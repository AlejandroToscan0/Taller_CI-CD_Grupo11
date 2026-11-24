import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    // la conexion a la base puede tardar un poco en el CI
    hookTimeout: 30000,
    // los archivos e2e usan la misma base, mejor uno a la vez
    fileParallelism: false,
  },
});
