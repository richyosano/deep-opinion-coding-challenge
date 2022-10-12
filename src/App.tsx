import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { faker } from '@faker-js/faker';

type Product = {
	id: number;
	name: string;
	description: string;
	price: string;
};

function App() {
	const [productsList, setProductsList] = useState<Product[]>([]);

	useEffect(() => {
		const randomProducts: Product[] = [...Array(10).keys()].map((key) => {
			return {
				id: key,
				name: `${faker.commerce.productName()}`,
				description: `${faker.commerce.productDescription()}`,
				price: faker.commerce.price(),
			};
		});

		setProductsList(randomProducts);
	}, []);

	const handleAddNewProduct = () => {
		const newProduct: Product = {
			id: productsList.length,
			name: `${faker.commerce.productName()}`,
			description: `${faker.commerce.productDescription()}`,
			price: faker.commerce.price(),
		};
		setProductsList([...productsList, newProduct]);
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

			<TableContainer
				component={Paper}
				variant='outlined'
				sx={{ maxHeight: '80vh' }}
			>
				<Table sx={{ minWidth: 650 }} aria-label='virtualized table' stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell width={'20%'}>Product Name</TableCell>
							<TableCell width={'65%'} align='left'>
								Description
							</TableCell>
							<TableCell width={'15%'} align='center'>
								Price&nbsp;($)
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{productsList.map((product) => (
							<TableRow
								key={product.id}
								sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
							>
								<TableCell component='th' scope='row'>
									{product.name}
								</TableCell>
								<TableCell align='left'>{product.description}</TableCell>
								<TableCell align='center'>{product.price}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
}

export default App;
