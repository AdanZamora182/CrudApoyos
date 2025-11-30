import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            'babel-plugin-styled-components',
            {
              displayName: true,
              fileName: true,
              minify: false, // evita que minimice en dev
              pure: true,
            },
          ],
        ],
      },
    }),
  ],
})