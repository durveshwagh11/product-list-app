import { CheckIcon, PaletteIcon } from 'lucide-react';
import { THEMES } from '../constants';
import { useThemeStore } from '../store/useThemeStore';

function ThemeSelector() {
	const { theme, setTheme } = useThemeStore();

	return (
		<div className='dropdown dropdown-end'>
			<button tabIndex={0} className='btn btn-ghost btn-circle' aria-label='Change theme'>
				<PaletteIcon className='size-5' />
			</button>

			<ul tabIndex={0} className='dropdown-content mt-3 w-60 max-h-96 overflow-y-auto p-2 rounded-2xl bg-base-100 border border-base-content/10 shadow-2xl z-50'>
				{THEMES.map((option) => (
					<li key={option.name}>
						<button
							className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-3 text-sm transition-colors ${
								theme === option.name ? 'bg-primary/10 text-primary' : 'hover:bg-base-content/5'
							}`}
							onClick={() => setTheme(option.name)}
						>
							<span className='flex -space-x-1'>
								{option.colors.map((color, i) => (
									<span key={i} className='size-4 rounded-full ring-2 ring-base-100' style={{ backgroundColor: color }} />
								))}
							</span>
							<span className='font-medium'>{option.label}</span>
							{theme === option.name && <CheckIcon className='size-4 ml-auto' />}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
export default ThemeSelector;
