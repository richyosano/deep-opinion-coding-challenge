import { useEffect, useRef, useCallback } from 'react';
import { Product, Settings } from '../types';
import { useTableState } from './useTableState';

export const useVirtualizedTable = (tableItems: Product[], settings: Settings) => {
	const { state, setState } = useTableState(settings);
	const viewportElement = useRef<HTMLDivElement>(null);
	const hasComponentBeenRendered = useRef(false);

	const getData = useCallback(
		(offset: number, limit: number): Product[] => {
			const start = Math.max(settings.minIndex, offset);
			const end = Math.min(offset + limit - 1, settings.maxIndex);
			return start <= end ? tableItems.slice(start, end + 1) : [];
		},
		[settings.maxIndex]
	);

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
		const viewport = viewportElement.current;
		if (viewport) {
			viewport.scroll({
				top: viewport.scrollHeight - state.viewportHeight,
				behavior: 'smooth',
			});
		}
	}, [state.viewportHeight]);

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

	return { state, viewportElement, runScroller, scrollToTop };
};
