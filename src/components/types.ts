export type Product = {
	id: number;
	name: string;
	description: string;
	price: string;
};

export type Settings = {
	itemHeight: number;
	visibleItems: number;
	tolerance: number;
	minIndex: number;
	maxIndex: number;
	startIndex: number;
};

export type TableState = {
	settings: Settings;
	viewportHeight: number;
	totalHeight: number;
	toleranceHeight: number;
	bufferHeight: number;
	bufferedItems: number;
	topPaddingHeight: number;
	bottomPaddingHeight: number;
	initialPosition: number;
	data: Product[];
};
