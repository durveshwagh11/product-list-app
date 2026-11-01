import { PlusIcon, XIcon } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import ProductFields from './ProductFields';
import ProductImage from './ProductImage';

export const ADD_PRODUCT_MODAL_ID = 'add_product_modal';

function AddProductModal() {
	const { addProduct, formData, setFormData, loading } = useProductStore();
	const close = () => document.getElementById(ADD_PRODUCT_MODAL_ID).close();

	return (
		<dialog id={ADD_PRODUCT_MODAL_ID} className='modal modal-bottom sm:modal-middle'>
			<div className='modal-box max-w-lg p-0 overflow-hidden bg-base-100'>
				{/* LIVE IMAGE PREVIEW */}
				<div className='relative aspect-[16/9] bg-base-300'>
					<ProductImage src={formData.image} alt='Image preview' className='size-full' />
					<button type='button' onClick={close} className='btn btn-sm btn-circle border-0 bg-base-100/80 backdrop-blur absolute right-3 top-3' aria-label='Close'>
						<XIcon className='size-4' />
					</button>
				</div>

				<div className='p-6'>
					<h3 className='text-xl font-bold'>Add a new product</h3>
					<p className='text-sm text-base-content/60 mt-1'>Paste an image link to see a preview above.</p>

					<form onSubmit={addProduct} className='space-y-4 mt-6'>
						<ProductFields formData={formData} setFormData={setFormData} />

						<div className='flex justify-end gap-2 pt-2'>
							<button type='button' onClick={close} className='btn btn-ghost'>
								Cancel
							</button>
							<button type='submit' className='btn btn-primary min-w-36' disabled={!formData.name || !formData.price || !formData.image || loading}>
								{loading ? (
									<span className='loading loading-spinner loading-sm' />
								) : (
									<>
										<PlusIcon className='size-4' />
										Add product
									</>
								)}
							</button>
						</div>
					</form>
				</div>
			</div>

			{/* BACKDROP */}
			<form method='dialog' className='modal-backdrop'>
				<button>close</button>
			</form>
		</dialog>
	);
}
export default AddProductModal;
