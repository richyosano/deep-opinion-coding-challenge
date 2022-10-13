import React, { Component } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Product } from '../App';

type Settings = {
	itemHeight: number;
	visibleItems: number;
	tolerance: number;
	minIndex: number;
	maxIndex: number;
	startIndex: number;
};

type Props = {
	get: (offset: number, limit: number) => Product[];
	settings: Settings;
};
type State = ReturnType<typeof setInitialState>;

const setInitialState = (settings: Settings) => {
	const { itemHeight, visibleItems, tolerance, minIndex, maxIndex, startIndex } =
		settings;
	// viewportHeight: height of the visible part of the viewport (px)
	const viewportHeight = visibleItems * itemHeight;

	// totalHeight: total height of rendered and virtualized items (px)
	const totalHeight = (maxIndex - minIndex + 1) * itemHeight;

	// toleranceHeight: single viewport outlet height, filled with rendered but invisible rows (px)
	const toleranceHeight = tolerance * itemHeight;

	// bufferHeight: all rendered rows height, visible part + invisible outlets (px)
	const bufferHeight = viewportHeight + 2 * toleranceHeight;

	// bufferedItems: number of items to be rendered, buffered dataset length (pcs)
	const bufferedItems = visibleItems + 2 * tolerance;

	// itemsAbove: how many items will be virtualized above (pcs)
	const itemsAbove = startIndex - tolerance - minIndex;

	// topPaddingHeight: initial height of the top padding element (px)
	const topPaddingHeight = itemsAbove * itemHeight;

	// bottomPaddingHeight: initial height of the bottom padding element (px)
	const bottomPaddingHeight = totalHeight - topPaddingHeight;

	// initialPosition: initial scroll position (px)
	const initialPosition = topPaddingHeight + toleranceHeight;

	// data: list of items to be rendered
	const data: Product[] = [];

	return {
		settings,
		viewportHeight,
		totalHeight,
		toleranceHeight,
		bufferHeight,
		bufferedItems,
		topPaddingHeight,
		bottomPaddingHeight,
		initialPosition,
		data,
	};
};

class VirtualizedTable extends Component<Props, State> {
	viewportElement: React.RefObject<HTMLDivElement>;
	constructor(props: Props) {
		super(props);
		this.state = setInitialState(props.settings);
		this.viewportElement = React.createRef();
	}

	componentDidMount() {
		if (this.viewportElement.current) {
			this.viewportElement.current.scrollTop = this.state.initialPosition;
		}
		if (!this.state.initialPosition) {
			this.runScroller({ target: { scrollTop: 0 } });
		}
	}

	runScroller = ({ target: { scrollTop } }: any) => {
		const {
			totalHeight,
			toleranceHeight,
			bufferedItems,
			settings: { itemHeight, minIndex },
		} = this.state;
		const index = minIndex + Math.floor((scrollTop - toleranceHeight) / itemHeight);
		const data = this.props.get(index, bufferedItems);
		const topPaddingHeight = Math.max((index - minIndex) * itemHeight, 0);
		const bottomPaddingHeight = Math.max(
			totalHeight - topPaddingHeight - data.length * itemHeight,
			0
		);

		this.setState({
			topPaddingHeight,
			bottomPaddingHeight,
			data,
		});
	};

	render() {
		const { viewportHeight, topPaddingHeight, bottomPaddingHeight, data } =
			this.state;
		return (
			<TableContainer
				component={Paper}
				variant='outlined'
				ref={this.viewportElement}
				onScroll={this.runScroller}
				sx={{ height: viewportHeight }}
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
						<tr style={{ height: topPaddingHeight }} />
						{data.map((product) => (
							<TableRow
								key={product.id}
								sx={{
									'&:last-child td, &:last-child th': { border: 0 },
								}}
							>
								<TableCell component='th' scope='row' height={42}>
									{product.name}
								</TableCell>
								<TableCell align='left' height={42}>
									{product.description}
								</TableCell>
								<TableCell align='center' height={42}>
									{product.price}
								</TableCell>
							</TableRow>
						))}
						<tr style={{ height: bottomPaddingHeight }} />
					</TableBody>
				</Table>
			</TableContainer>
		);
	}
}

export default VirtualizedTable;