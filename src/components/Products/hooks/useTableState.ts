import { useState } from 'react';
import { Settings, TableState, Product } from '../types';

export const useTableState = (settings: Settings) => {
	const { itemHeight, visibleItems, tolerance, minIndex, maxIndex, startIndex } =
		settings;
	const viewportHeight = visibleItems * itemHeight;
	const totalHeight = (maxIndex - minIndex + 1) * itemHeight;
	const toleranceHeight = tolerance * itemHeight;
	const bufferHeight = viewportHeight + 2 * toleranceHeight;
	const bufferedItems = visibleItems + 2 * tolerance;
	const itemsAbove = startIndex - tolerance - minIndex;
	const topPaddingHeight = itemsAbove * itemHeight;
	const bottomPaddingHeight = totalHeight - topPaddingHeight;
	const initialPosition = topPaddingHeight + toleranceHeight;
	const data: Product[] = [];

	const [state, setState] = useState<TableState>({
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
	});

	return {
		state,
		setState,
	};
};
