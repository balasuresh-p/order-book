const convertData = (data) => {
  const [channelId, orderBookData] = data;
  const bids = [];
  const asks = [];
  orderBookData.forEach(level => {
    const [price, count, amount] = level;
    const order = { price, count, amount };
    if (amount > 0) {
      bids.push(order);
    } else {
      asks.push(order);
    }
  });
  return { channelId, bids, asks };
}

const calculateTotals = (bids, asks) => {
  const calculateTotal = (orders) => {
    const totalAmount = orders.reduce((s, i) => {
      let amount = Math.abs(Number(i.amount.toFixed(4)))
      return Number((s + amount).toFixed(4))
    }, 0)
    let total = 0;
    return orders.map(order => {
      let amount = Math.abs(Number(order.amount.toFixed(4)));
      let price = new Intl.NumberFormat().format(order.price)
      total = Number((total + amount).toFixed(4));
      let percentage = (total / totalAmount) * 100;
      return { ...order, amount, total, price, percentage: percentage.toFixed(2) };
    });
  };
  return {
    bidsWithTotals: calculateTotal(bids),
    asksWithTotals: calculateTotal(asks)
  };
}

const updateOrderBook = (data, orderBookData) => {
  let arr = [...orderBookData]
  const [id, level] = data;
  if (Array.isArray(level)) {
    const [price, count, amount] = level;
    const order = { price, count, amount };
    const index = orderBookData.findIndex(el => el.channelId === id);
    if (count > 0) {
      if (amount > 0) {
        if (index >= 0) {
          let childIndex = arr[index].bids.findIndex(el => el.price === price);
          if (childIndex >= 0) {
            arr[index].bids[childIndex] = order;
          } else {
            arr[index].bids = [...arr[index].bids, order];
          }
        } else {
          arr.push(convertData([id, [level]]))
        }
      } else {
        if (index >= 0) {
          let childIndex = arr[index].asks.findIndex(el => el.price === price);
          if (childIndex >= 0) {
            arr[index].asks[childIndex] = order;
          } else {
            arr[index].asks = [...arr[index].asks, order];
          }
        } else {
          arr.push(convertData([id, [level]]))
        }
      }
    } else if (count === 0) {
      if (amount === 1) {
        let childIndex = arr[index].bids.findIndex(el => el.price === price);
        if (childIndex >= 0) {
          arr[index].bids.splice(childIndex, 1)
        }
      } else if (amount === -1) {
        let childIndex = arr[index].asks.findIndex(el => el.price === price);
        if (childIndex >= 0) {
          arr[index].asks.splice(childIndex, 1)
        }
      }
    }
  }
  return arr;
}

export { calculateTotals, convertData, updateOrderBook };
