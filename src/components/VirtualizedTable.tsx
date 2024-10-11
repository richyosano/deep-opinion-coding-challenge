import React, { useEffect, useRef, useCallback } from 'react';
import { Product, Settings, TableState } from './types';
import { ProductsTable } from './ProductsTable';

type Props = {
	state: TableState;
	setState: React.Dispatch<React.SetStateAction<TableState>>;
	getData: (offset: number, limit: number) => Product[];
	settings: Settings;
	viewportElement: React.RefObject<HTMLDivElement>;
};

const VirtualizedTable: React.FC<Props> = ({
	state,
	setState,
	getData,
	settings,
	viewportElement,
}) => {
	const hasComponentBeenRendered = useRef(false);

	const scrollToTop = useCallback(() => {
		const viewport = viewportElement.current;
		if (viewport) viewport.scroll({ top: 0, behavior: 'smooth' });
	}, [viewportElement]);

	useEffect(() => {
		if (viewportElement.current) {
			viewportElement.current.scrollTop = state.initialPosition;
		}
		if (!state.initialPosition) {
			runScroller(0);
		}
	}, [state.initialPosition, viewportElement]);

	const scrollToBottom = useCallback(() => {
		const { viewportHeight } = state;
		const viewport = viewportElement.current;
		if (viewport) {
			viewport.scroll({
				top: viewport.scrollHeight - viewportHeight,
				behavior: 'smooth',
			});
		}
	}, [state]);

	const runScroller = useCallback(
		(scrollTop: number) => {
			const {
				totalHeight,
				toleranceHeight,
				bufferedItems,
				settings: { itemHeight, minIndex },
			} = state;
			const index =
				minIndex + Math.floor((scrollTop - toleranceHeight) / itemHeight);
			const data: Product[] = getData(index, bufferedItems);
			const topPaddingHeight = Math.max((index - minIndex) * itemHeight, 0);
			const bottomPaddingHeight = Math.max(
				totalHeight - topPaddingHeight - data.length * itemHeight,
				0
			);

			setState((prevState) => ({
				...prevState,
				topPaddingHeight,
				bottomPaddingHeight,
				data,
			}));
		},
		[state.totalHeight, state.toleranceHeight, state.bufferedItems, getData]
	);

	useEffect(() => {
		const {
			toleranceHeight,
			bufferedItems,
			bottomPaddingHeight,
			settings: { itemHeight, minIndex, maxIndex },
		} = state;
		if (hasComponentBeenRendered.current) {
			if (bottomPaddingHeight === 0) {
				const scrollTop = viewportElement.current?.scrollTop ?? 0;
				const index =
					minIndex + Math.floor((scrollTop - toleranceHeight) / itemHeight);
				const data = getData(index, bufferedItems);
				const totalHeight = (maxIndex - minIndex + 1) * itemHeight;
				setState((prevState) => ({
					...prevState,
					data,
					totalHeight,
				}));

				//set timeout to allow the state to update before scrolling
				setTimeout(() => {
					scrollToBottom();
				}, 0);
			}
		}
		hasComponentBeenRendered.current = true;
	}, [settings.maxIndex]);

	return (
		<ProductsTable
			viewportElement={viewportElement}
			runScroller={runScroller}
			viewportHeight={state.viewportHeight}
			topPaddingHeight={state.topPaddingHeight}
			data={state.data}
			bottomPaddingHeight={state.bottomPaddingHeight}
			currentScrollPosition={
				viewportElement.current?.scrollTop ?? state.initialPosition
			}
			itemHeight={settings.itemHeight}
			scrollToTop={scrollToTop}
		/>
	);
};

export default VirtualizedTable;
