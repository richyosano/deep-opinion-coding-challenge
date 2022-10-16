import React, { Component } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Zoom from '@mui/material/Zoom';
import Tooltip from '@mui/material/Tooltip';
import Fab from '@mui/material/Fab';
import ArrowUpIcon from '@mui/icons-material/KeyboardArrowUpRounded';
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

	scrollToTop = () => {
		const viewportElement = this.viewportElement.current;
		if (viewportElement) viewportElement.scroll({ top: 0, behavior: 'smooth' });
	};

	scrollToBottom = () => {
		const { viewportHeight } = this.state;
		const viewportElement = this.viewportElement.current;
		if (viewportElement)
			viewportElement.scroll({
				top: viewportElement.scrollHeight - viewportHeight,
				behavior: 'smooth',
			});
	};

	componentDidUpdate(prevProps: Props, prevState: State) {
		const {
			toleranceHeight,
			bufferedItems,
			bottomPaddingHeight,
			settings: { itemHeight, minIndex },
		} = this.state;
		if (
			prevProps.settings.maxIndex !== this.props.settings.maxIndex &&
			bottomPaddingHeight === 0
		) {
			const scrollTop = this.viewportElement.current?.scrollTop ?? 0;
			const index =
				minIndex + Math.floor((scrollTop - toleranceHeight) / itemHeight);
			const data = this.props.get(index, bufferedItems);
			const totalHeight =
				(this.props.settings.maxIndex - minIndex + 1) * itemHeight;
			this.setState({
				data,
				totalHeight,
			});
		}

		if (
			prevState.data !== this.state.data &&
			prevState.totalHeight !== this.state.totalHeight &&
			bottomPaddingHeight === 0
		) {
			this.scrollToBottom();
		}
	}

	render() {
		const {
			viewportHeight,
			topPaddingHeight,
			bottomPaddingHeight,
			data,
			initialPosition,
			settings: { itemHeight },
		} = this.state;
		const currentScrollPosition =
			this.viewportElement.current?.scrollTop ?? initialPosition;

		const scrollToTopButton = (
			<Zoom in={currentScrollPosition > itemHeight} timeout={300} unmountOnExit>
				<Tooltip title='Scroll to top' placement='top'>
					<Fab
						color='primary'
						size='medium'
						variant='circular'
						sx={{
							position: 'fixed',
							bottom: 70,
							right: 45,
							zIndex: 10,
							backgroundColor: '#4186cb',
							boxShadow: 0,
						}}
						onClick={this.scrollToTop}
						data-testid='scrollToTop'
					>
						<ArrowUpIcon />
					</Fab>
				</Tooltip>
			</Zoom>
		);

		return (
			<TableContainer
				component={Paper}
				variant='outlined'
				ref={this.viewportElement}
				onScroll={this.runScroller}
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
								<TableCell
									align='left'
									height={42}
									sx={{ color: 'GrayText' }}
								>
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
						))}
						<tr style={{ height: bottomPaddingHeight }} />
					</TableBody>
				</Table>
				{scrollToTopButton}
			</TableContainer>
		);
	}
}

export default VirtualizedTable;
