import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useProductsContext } from './hooks/ProductsContext';

function NewProductBtn() {
	const { addProduct } = useProductsContext();
	return (
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
			onClick={addProduct}
			startIcon={<AddIcon />}
			data-testid='newProductBtn'
		>
			New Product
		</Button>
	);
}

export default NewProductBtn;
