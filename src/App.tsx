import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { faker } from '@faker-js/faker';
import VirtualizedTable from './components/VirtualizedTable';

export type Product = {
	id: number;
	name: string;
	description: string;
	price: string;
};

const randomProducts: Product[] = [...Array(200000).keys()].map((key) => {
	return {
		id: key,
		name: `${faker.commerce.productName()}`,
		description: `${faker.commerce.productDescription()}`,
		price: faker.commerce.price(),
	};
});

function App() {
	const [productsList, setProductsList] = useState<Product[]>(randomProducts);
	const SETTINGS = {
		itemHeight: 75,
		visibleItems: 9,
		tolerance: 3,
		minIndex: 0,
		maxIndex: productsList.length - 1,
		startIndex: 0,
	};

	const handleAddNewProduct = () => {
		const newProduct: Product = {
			id: productsList.length,
			name: `${faker.commerce.productName()}`,
			description: `${faker.commerce.productDescription()}`,
			price: faker.commerce.price(),
		};
		setProductsList([...productsList, newProduct]);
	};

	const getData = (offset: number, limit: number) => {
		var data: Product[] = [];
		const start = Math.max(SETTINGS.minIndex, offset);
		const end = Math.min(offset + limit - 1, SETTINGS.maxIndex);

		if (start <= end) {
			data = productsList.slice(start, end + 1);
		}
		return data;
	};

	return (
		<div style={{ padding: 24 }}>
			<div style={{ display: 'flex', textAlign: 'center' }}>
				<Typography
					variant='h5'
					sx={{ marginBottom: 3, fontWeight: 500, flexGrow: 1 }}
				>
					Available Products
				</Typography>
				<Button
					variant='contained'
					disableElevation
					sx={{
						textTransform: 'capitalize',
						height: 'fit-content',
						borderRadius: 1,
						backgroundColor: '#4186cb',
					}}
					onClick={handleAddNewProduct}
				>
					Add New Product
				</Button>
			</div>

			<VirtualizedTable get={getData} settings={SETTINGS} />
		</div>
	);
}

export default App;
