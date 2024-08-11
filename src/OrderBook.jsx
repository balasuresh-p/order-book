import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrderBookStart, fetchOrderBookSuccess, fetchOrderBookUpdate, fetchOrderBookFailure } from './redux/reducer'

const selectOrderBook = (state) => state.orderBook;

const precisionLevels = ["P0", "P1", "P2", "P3", "P4"]

// WebSocket connection
const wss = new WebSocket('wss://api-pub.bitfinex.com/ws/2');

var orderBookCreated = false;
var precisionLevel = 0;

const OrderBook = () => {
  const { orderBookData, loading } = useSelector(selectOrderBook);
  const bids = orderBookData.flatMap((el) => el?.bids || []);
  const asks = orderBookData.flatMap((el) => el?.asks || []);
  const { bidsWithTotals, asksWithTotals } = calculateTotals(bids, asks);

  const dispatch = useDispatch();

  let msg = JSON.stringify(
    {
      event: "subscribe",
      channel: "book",
      symbol: "tBTCUSD",
      prec: precisionLevels[precisionLevel],
    }
  )

  useEffect(() => {
    wss.onmessage = async (event) => {
      try {
        if (!orderBookCreated) {
          dispatch(fetchOrderBookStart());
        }
        const data = await JSON.parse(event.data);
        if (Array.isArray(data)) {
          if (!orderBookCreated) {
            dispatch(fetchOrderBookSuccess(data));
            orderBookCreated = true;
          } else {
            dispatch(fetchOrderBookUpdate(data));
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket data:', error, orderBookCreated);
        dispatch(fetchOrderBookFailure());
        orderBookCreated = false;
      }
    };


    wss.onopen = () => {    
      wss.send(msg);
    };

    wss.onerror = (error) => {
      console.error('WebSocket connection error:', error);
    };

    return () => {
      orderBookCreated = false;
      precisionLevel = 0;
    }
  }, [dispatch]);

  const handleIncrementPrecision = () => {
    if(precisionLevel < 4){
      precisionLevel++;
      orderBookCreated = false;
    }
  }

  const handleDecrementPrecision = () => {
    if (precisionLevel > 0) {
      precisionLevel--;
      orderBookCreated = false;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="order-book">
      <button onClick={handleIncrementPrecision} >+</button>
      <div className="bids">
        <table>
          <thead>
            <tr>
              <th>Price</th>
              <th>Amount</th>
              <th>Total</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {bidsWithTotals.map((level, index) => (
              <tr key={index}>
                <td>{level.price}</td>
                <td>{level.amount}</td>
                <td>{level.total}</td>
                <td>{level.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="asks">
        <table>
          <thead>
            <tr>
              <th>Price</th>
              <th>Amount</th>
              <th>Total</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {asksWithTotals.map((level, index) => (
              <tr key={index}>
                <td>{level.price}</td>
                <td>{level.amount}</td>
                <td>{level.total}</td>
                <td>{level.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderBook;
