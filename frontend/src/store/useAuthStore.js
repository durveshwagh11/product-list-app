import { create } from 'zustand';
import axios from 'axios';

export const useAuthStore = create((set) => ({
	user: null,

	checkAuth: async () => {
		try {
			const response = await axios.get('/api/auth/me');
			set({ user: response.data.data });
		} catch {
			set({ user: null });
		}
	},

	// mode: "login" | "signup"; throws so the form can show the server message
	authenticate: async (mode, credentials) => {
		const response = await axios.post(`/api/auth/${mode}`, credentials);
		set({ user: response.data.data });
	},

	logout: async () => {
		await axios.post('/api/auth/logout');
		set({ user: null });
	},
}));

// Access token lives 15 min. On a 401, refresh once and replay the request.
// Concurrent 401s share one refresh call (refresh tokens are single-use).
const NO_REFRESH = ['/api/auth/login', '/api/auth/signup', '/api/auth/refresh', '/api/auth/logout'];
let refreshing = null;

axios.interceptors.response.use(undefined, async (error) => {
	const { config, response } = error;
	if (response?.status !== 401 || !config || config._retried || NO_REFRESH.includes(config.url)) {
		throw error;
	}
	config._retried = true;

	refreshing ??= axios.post('/api/auth/refresh').finally(() => {
		refreshing = null;
	});
	try {
		await refreshing;
	} catch {
		useAuthStore.setState({ user: null });
		throw error;
	}
	return axios(config);
});
