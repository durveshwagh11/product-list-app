// labelled input with a leading icon; children = the <input> (plus optional trailing element)
function Field({ label, icon: Icon, hint, children }) {
	return (
		<label className='form-control w-full'>
			<span className='label-text font-medium mb-1.5'>{label}</span>
			<div className='input input-bordered flex items-center gap-3 bg-base-200/50 focus-within:border-primary focus-within:outline-none'>
				<Icon className='size-4 shrink-0 opacity-50' />
				{children}
			</div>
			{hint && <span className='label-text-alt text-base-content/50 mt-1.5'>{hint}</span>}
		</label>
	);
}
export default Field;
