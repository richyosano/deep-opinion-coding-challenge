import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Product } from '../types';

export const ProductTableItem = ({ product }: { product: Product }) => {
	return (
		<TableRow
			key={product.id}
			sx={{
				'&:last-child td, &:last-child th': { border: 0 },
			}}
			data-testid={`tableItem_${product.id}`}
		>
			<TableCell component='th' scope='row' height={42}>
				{product.name}
			</TableCell>
			<TableCell align='left' height={42} sx={{ color: 'GrayText' }}>
				{product.description}
			</TableCell>
			<TableCell
				align='center'
				height={42}
				sx={{ color: '#e0ac11', fontWeight: 500 }}
			>
				{product.price}
			</TableCell>
		</TableRow>
	);
};
