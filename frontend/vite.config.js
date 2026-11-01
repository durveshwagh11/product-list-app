import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	// same-origin API in dev too, so auth cookies work without CORS
	server: {
		proxy: { '/api': 'http://localhost:3000' },
	},
});
