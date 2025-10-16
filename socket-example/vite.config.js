import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { z } from 'zod';

export default defineConfig(({ mode }) => {
  // Load .env files based on current mode (e.g. .env, .env.development)
  const env = loadEnv(mode, process.cwd(), '')

  // Schema validation
  const EnvSchema = z.object({
    VITE_PORT: z.coerce.number().min(3000).max(9999),
    VITE_SERVER: z.string(),
  })
  let parsed;
  try {
    parsed = EnvSchema.parse(env)
  } catch (error){
    if (error instanceof z.ZodError){
      console.log("Malformed env:")
      console.log(env);
    }
    else throw error;
  }

  return {
    plugins: [vue(), tailwindcss()],
    server: {
      port: parsed.VITE_PORT,
      host: parsed.VITE_SERVER,
    },
  }
});
