import React from 'react';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { ScrollToTopButton } from './ScrollToTopButton';
import { ProductTableItem } from './ProductTableItem';
import { Product } from './types';

interface ProductsTableProps {
	viewportElement: React.RefObject<HTMLDivElement>;
	runScroller: (scrollTop: number) => void;
	viewportHeight: number;
	topPaddingHeight: number;
	data: Product[];
	bottomPaddingHeight: number;
	currentScrollPosition: number;
	itemHeight: number;
	scrollToTop: () => void;
}

export const ProductsTable: React.FC<ProductsTableProps> = ({
	viewportElement,
	runScroller,
	viewportHeight,
	topPaddingHeight,
	data,
	bottomPaddingHeight,
	currentScrollPosition,
	itemHeight,
	scrollToTop,
}) => {
	return (
		<TableContainer
			component={Paper}
			variant='outlined'
			ref={viewportElement}
			onScroll={(e) => runScroller((e.target as HTMLDivElement).scrollTop)}
			sx={{ height: viewportHeight }}
			data-testid={'virtualizedTableContainer'}
		>
			<Table sx={{ minWidth: 835 }} aria-label='virtualized table' stickyHeader>
				<TableHead>
					<TableRow>
						<TableCell sx={{ backgroundColor: '#f7f7f7' }} width={'20%'}>
							Product Name
						</TableCell>
						<TableCell
							sx={{ backgroundColor: '#f7f7f7' }}
							width={'65%'}
							align='left'
						>
							Description
						</TableCell>
						<TableCell
							sx={{ backgroundColor: '#f7f7f7' }}
							width={'15%'}
							align='center'
						>
							Price&nbsp;($)
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					<tr style={{ height: topPaddingHeight }} />
					{data.map((product) => (
						<ProductTableItem key={product.id} product={product} />
					))}
					<tr style={{ height: bottomPaddingHeight }} />
				</TableBody>
			</Table>
			<ScrollToTopButton
				currentScrollPosition={currentScrollPosition}
				itemHeight={itemHeight}
				scrollToTop={scrollToTop}
			/>
		</TableContainer>
	);
};
