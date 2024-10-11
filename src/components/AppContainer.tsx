import { useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { faker } from '@faker-js/faker';
import VirtualizedTable from './VirtualizedTable';
import AddIcon from '@mui/icons-material/PostAddRounded';
import { Product, Settings, TableState } from './types';
import { useInitialState } from './hooks/useInitialState';

const randomProducts: Product[] = [...Array(200000).keys()].map((key) => ({
	id: key,
	name: faker.commerce.productName(),
	description: faker.commerce.productDescription(),
	price: faker.commerce.price(),
}));

function AppContainer() {
	const [productsList, setProductsList] = useState<Product[]>(randomProducts);
	const viewportElement = useRef<HTMLDivElement>(null);
	const SETTINGS: Settings = {
		itemHeight: 75,
		visibleItems: 9,
		tolerance: 3,
		minIndex: 0,
		maxIndex: productsList.length - 1,
		startIndex: 0,
	};
	const [tableState, setTableState] = useState<TableState>(() =>
		useInitialState(SETTINGS)
	);

	const handleAddNewProduct = () => {
		const newProduct: Product = {
			id: productsList.length,
			name: faker.commerce.productName(),
			description: faker.commerce.productDescription(),
			price: faker.commerce.price(),
		};
		setProductsList([...productsList, newProduct]);
	};

	const getData = (offset: number, limit: number): Product[] => {
		const start = Math.max(SETTINGS.minIndex, offset);
		const end = Math.min(offset + limit - 1, SETTINGS.maxIndex);
		return start <= end ? productsList.slice(start, end + 1) : [];
	};

	return (
		<div style={{ padding: 24 }} id='appContainer'>
			<div style={{ display: 'flex', textAlign: 'center' }}>
				<Typography
					variant='h5'
					sx={{ marginBottom: 3, fontWeight: 500, flexGrow: 1 }}
					data-testid={'pageTitle'}
				>
					Available Products {`(${productsList.length.toLocaleString()})`}
				</Typography>
				<Button
					variant='contained'
					disableElevation
					sx={{
						textTransform: 'capitalize',
						height: 'fit-content',
						borderRadius: 1,
						backgroundColor: '#4186cb',
						fontWeight: 400,
					}}
					onClick={handleAddNewProduct}
					startIcon={<AddIcon />}
					data-testid='newProductBtn'
				>
					New Product
				</Button>
			</div>

			<VirtualizedTable
				state={tableState}
				getData={getData}
				settings={SETTINGS}
				viewportElement={viewportElement}
				setState={setTableState}
			/>
		</div>
	);
}

export default AppContainer;
