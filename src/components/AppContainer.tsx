import Typography from '@mui/material/Typography';
import NewProductBtn from './Products/NewProductBtn';
import ProductsTable from './Products/ProductsTable';
import { useProductsContext } from './Products/hooks/ProductsContext';

function AppContainer() {
	const { products } = useProductsContext();

	return (
		<div style={{ padding: 24 }} id='appContainer'>
			<div style={{ display: 'flex', textAlign: 'center' }}>
				<Typography
					variant='h5'
					sx={{ marginBottom: 3, fontWeight: 500, flexGrow: 1 }}
					data-testid={'pageTitle'}
				>
					Available Products {`(${products.length.toLocaleString()})`}
				</Typography>
				<NewProductBtn />
			</div>
			<ProductsTable />
		</div>
	);
}

export default AppContainer;
