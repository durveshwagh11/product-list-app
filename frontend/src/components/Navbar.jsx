import { Link, useLocation } from 'react-router-dom';
import { LogOutIcon, ShoppingBagIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import ThemeSelector from './ThemeSelector';
import { useAuthStore } from '../store/useAuthStore';

function Navbar() {
	const { pathname } = useLocation();
	const { user, logout } = useAuthStore();

	const handleLogout = async () => {
		await logout();
		toast.success('Logged out');
	};

	return (
		<header className='sticky top-0 z-40 bg-base-200/70 backdrop-blur-xl border-b border-base-content/5'>
			<nav className='max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4'>
				{/* LOGO */}
				<Link to='/' className='flex items-center gap-2.5 font-bold text-lg tracking-tight'>
					<span className='size-9 rounded-xl bg-gradient-to-br from-primary to-secondary grid place-items-center text-primary-content shadow-md shadow-primary/30'>
						<ShoppingBagIcon className='size-5' />
					</span>
					<span className='hidden sm:inline'>Product Listing</span>
				</Link>

				{/* RIGHT SECTION */}
				<div className='flex items-center gap-2'>
					<ThemeSelector />

					{user ? (
						<div className='dropdown dropdown-end'>
							<button tabIndex={0} className='btn btn-ghost btn-circle avatar placeholder' aria-label='Account menu'>
								<div className='w-9 rounded-full bg-gradient-to-br from-primary to-accent text-primary-content'>
									<span className='font-semibold'>{user.email[0].toUpperCase()}</span>
								</div>
							</button>
							<ul tabIndex={0} className='dropdown-content menu mt-3 w-64 p-2 rounded-2xl bg-base-100 border border-base-content/10 shadow-2xl z-50'>
								<li className='px-3 py-2'>
									<span className='text-xs text-base-content/50 p-0 pointer-events-none'>Signed in as</span>
									<span className='font-medium truncate p-0 pointer-events-none'>{user.email}</span>
								</li>
								<div className='divider my-0' />
								<li>
									<button onClick={handleLogout} className='text-error'>
										<LogOutIcon className='size-4' />
										Log out
									</button>
								</li>
							</ul>
						</div>
					) : (
						pathname !== '/login' && (
							<>
								<Link to='/login' className='btn btn-ghost btn-sm'>
									Log in
								</Link>
								<Link to='/login?mode=signup' className='btn btn-primary btn-sm'>
									Sign up
								</Link>
							</>
						)
					)}
				</div>
			</nav>
		</header>
	);
}
export default Navbar;
