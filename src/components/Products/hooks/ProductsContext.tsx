import React, {
	createContext,
	useContext,
	ReactNode,
	useState,
	useCallback,
} from 'react';
import { faker } from '@faker-js/faker';
import { Product } from '../types';

const randomProducts: Product[] = [...Array(200000).keys()].map((key) => ({
	id: key,
	name: faker.commerce.productName(),
	description: faker.commerce.productDescription(),
	price: faker.commerce.price(),
}));

const ProductsContext = createContext<
	| {
			products: Product[];
			setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
			addProduct: () => void;
	  }
	| undefined
>(undefined);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
	const [products, setProducts] = useState<Product[]>(randomProducts);
	const addProduct = useCallback(() => {
		const newProduct: Product = {
			id: products.length,
			name: faker.commerce.productName(),
			description: faker.commerce.productDescription(),
			price: faker.commerce.price(),
		};
		setProducts((prevProducts) => [...prevProducts, newProduct]);
	}, [products]);
	return (
		<ProductsContext.Provider value={{ products, setProducts, addProduct }}>
			{children}
		</ProductsContext.Provider>
	);
};

export const useProductsContext = () => {
	const context = useContext(ProductsContext);
	if (!context) {
		throw new Error('useProductsContext must be used within a ProductsProvider');
	}
	return context;
};
