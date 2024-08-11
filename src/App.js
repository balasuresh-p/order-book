import './App.css';
import { Provider } from 'react-redux';
import OrderBook from './OrderBook';
import store from './redux/store'
function App() {
  return (
    <Provider store={store}>
      <OrderBook />
    </Provider>
  );
}

export default App;
