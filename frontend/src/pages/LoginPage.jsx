import { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, ShoppingBagIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';
import Field from '../components/Field';

function LoginPage() {
	const { user, authenticate } = useAuthStore();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	// mode lives in the URL so the navbar can link straight to /login?mode=signup
	const mode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
	const isLogin = mode === 'login';
	const setMode = (next) => setSearchParams(next === 'signup' ? { mode: 'signup' } : {}, { replace: true });

	if (user) return <Navigate to='/' replace />;

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			await authenticate(mode, { email, password });
			toast.success(isLogin ? 'Welcome back' : 'Account created');
			navigate('/');
		} catch (error) {
			toast.error(error.response?.data?.message || 'Something went wrong');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<main className='relative min-h-[calc(100vh-4rem)] grid place-items-center px-4 py-12 overflow-hidden'>
			<div aria-hidden className='pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 size-[32rem] rounded-full bg-primary/15 blur-3xl' />

			<div className='relative w-full max-w-md'>
				<div className='text-center mb-8'>
					<div className='mx-auto size-14 rounded-2xl bg-gradient-to-br from-primary to-secondary grid place-items-center text-primary-content shadow-lg shadow-primary/30'>
						<ShoppingBagIcon className='size-7' />
					</div>
					<h1 className='text-3xl font-extrabold tracking-tight mt-6'>{isLogin ? 'Welcome back' : 'Create your account'}</h1>
					<p className='text-base-content/60 mt-2'>{isLogin ? 'Log in to manage your listings.' : 'Start listing products in seconds.'}</p>
				</div>

				<div className='rounded-3xl bg-base-100 border border-base-content/5 p-6 sm:p-8 shadow-xl'>
					<div role='tablist' className='tabs tabs-boxed grid grid-cols-2 mb-6 bg-base-200'>
						<button type='button' role='tab' aria-selected={isLogin} className={`tab ${isLogin ? 'tab-active' : ''}`} onClick={() => setMode('login')}>
							Log in
						</button>
						<button type='button' role='tab' aria-selected={!isLogin} className={`tab ${!isLogin ? 'tab-active' : ''}`} onClick={() => setMode('signup')}>
							Sign up
						</button>
					</div>

					<form onSubmit={handleSubmit} className='space-y-4'>
						<Field label='Email' icon={MailIcon}>
							<input type='email' required autoComplete='email' placeholder='you@example.com' className='grow min-w-0' value={email} onChange={(e) => setEmail(e.target.value)} />
						</Field>

						<Field label='Password' icon={LockIcon} hint={isLogin ? null : 'At least 8 characters.'}>
							<input
								type={showPassword ? 'text' : 'password'}
								required
								minLength={8}
								autoComplete={isLogin ? 'current-password' : 'new-password'}
								placeholder='••••••••'
								className='grow min-w-0'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<button
								type='button'
								className='opacity-50 hover:opacity-100 transition-opacity'
								onClick={() => setShowPassword((v) => !v)}
								aria-label={showPassword ? 'Hide password' : 'Show password'}
							>
								{showPassword ? <EyeOffIcon className='size-4' /> : <EyeIcon className='size-4' />}
							</button>
						</Field>

						<button type='submit' className='btn btn-primary w-full mt-2' disabled={submitting}>
							{submitting ? <span className='loading loading-spinner loading-sm' /> : isLogin ? 'Log in' : 'Create account'}
						</button>
					</form>
				</div>
			</div>
		</main>
	);
}
export default LoginPage;
