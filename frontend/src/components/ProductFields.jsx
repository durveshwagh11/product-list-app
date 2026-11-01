import { DollarSignIcon, LinkIcon, Package2Icon } from 'lucide-react';
import Field from './Field';

// shared by the Add modal and the Edit form
function ProductFields({ formData, setFormData }) {
	const update = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

	return (
		<>
			<Field label='Product name' icon={Package2Icon}>
				<input type='text' required maxLength={255} placeholder='e.g. Wireless headphones' className='grow min-w-0' value={formData.name} onChange={update('name')} />
			</Field>

			<Field label='Price' icon={DollarSignIcon}>
				<input type='number' required min='0' step='0.01' placeholder='0.00' className='grow min-w-0' value={formData.price} onChange={update('price')} />
			</Field>

			<Field label='Image URL' icon={LinkIcon}>
				<input type='url' required placeholder='https://example.com/image.jpg' className='grow min-w-0' value={formData.image} onChange={update('image')} />
			</Field>
		</>
	);
}
export default ProductFields;
