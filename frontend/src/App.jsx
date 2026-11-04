import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import { useAuthStore } from './store/useAuthStore';

// DaisyUI v4 exposes theme colors as oklch CSS variables
const TOAST_STYLE = {
	background: 'oklch(var(--b1))',
	color: 'oklch(var(--bc))',
	border: '1px solid oklch(var(--bc) / 0.1)',
	borderRadius: '0.875rem',
};

function App() {
	const checkAuth = useAuthStore((state) => state.checkAuth);

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	return (
		<div className='min-h-screen flex flex-col'>
			<Navbar />

			<div className='grow'>
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/product/:id' element={<ProductPage />} />
					<Route path='/login' element={<LoginPage />} />
				</Routes>
			</div>

			<footer className='border-t border-base-content/5 py-6 text-center text-sm text-base-content/50'>Product Listing</footer>

			<Toaster position='bottom-right' toastOptions={{ style: TOAST_STYLE }} />
		</div>
	);
}

export default App;
