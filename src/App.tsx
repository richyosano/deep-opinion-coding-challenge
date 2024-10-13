import AppContainer from './components/AppContainer';
import { ProductsProvider } from './components/Products/hooks/ProductsContext';

function App() {
	return (
		<ProductsProvider>
			<AppContainer />
		</ProductsProvider>
	);
}

export default App;
