import { Add, Notifications, Remove, Settings, ZoomIn, ZoomOut } from '@mui/icons-material';
import { Box, Grid, Skeleton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OrderTable from './components/OrderTable';
import { Accordion, AccordionDetails, AccordionSummary, IconButton } from './components/styledComponents';
import { fetchOrderBookFailure, fetchOrderBookStart, fetchOrderBookSuccess, fetchOrderBookUpdate } from './redux/reducer';
import { calculateTotals } from './utils/helper';

const selectOrderBook = (state) => state.orderBook;

const precisionLevels = ["P0", "P1", "P2", "P3", "P4"]

// WebSocket connection
const wss = new WebSocket('wss://api-pub.bitfinex.com/ws/2');

var orderBookCreated = false;
var precisionLevel = 0;

const OrderBook = () => {
  const [expanded, setExpanded] = useState(true);
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
          const [channelId, orderBookOrLevel] = data;
          const isOrderBook = typeof orderBookOrLevel[0] === 'object';
          if (isOrderBook) {
            dispatch(fetchOrderBookSuccess(data));
          } else {
            dispatch(fetchOrderBookUpdate(data));
          }
          orderBookCreated = true;
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

  const handleIncrementPrecision = (e) => {
    e.stopPropagation();
    if (precisionLevel < 4) {
      precisionLevel++;
      orderBookCreated = false;
    }
  }

  const handleDecrementPrecision = (e) => {
    e.stopPropagation();
    if (precisionLevel > 0) {
      precisionLevel--;
      orderBookCreated = false;
    }
  };

  const handleChange = () => {
    setExpanded(!expanded);
  }

  const handleClick = (e) => {
    e.stopPropagation()
  }

  const handleZoomIn = (e) => {
    e.stopPropagation();
  }

  const handleZoomOut = (e) => {
    e.stopPropagation();
  }

  return (
    <div className="order-book">
      <Accordion expanded={expanded} onChange={handleChange}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Grid container alignItems={'center'}>
            <Grid item xs>
              <Typography fontSize="14px">ORDER BOOK <span className={'tag'}>{"BTC/USD"}</span></Typography>
            </Grid>
            <Grid item>
              <IconButton onClick={handleDecrementPrecision} disable={precisionLevel < 1} title={'Decrease Precision'}><Remove /></IconButton>
            </Grid>
            <Grid item>
              <IconButton onClick={handleIncrementPrecision} disable={precisionLevel > 3} title={'Increase Precision'}><Add /></IconButton>
            </Grid>
            <Grid item>
              <IconButton onClick={handleClick} disable><Notifications /></IconButton>
            </Grid>
            <Grid item>
              <IconButton onClick={handleClick} disable><Settings /></IconButton>
            </Grid>
            <Grid item>
              <IconButton onClick={handleZoomIn} disable><ZoomIn /></IconButton>
            </Grid>
            <Grid item>
              <IconButton onClick={handleZoomOut} disable><ZoomOut /></IconButton>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          {loading ? <Skeleton variant="rounded" height={450} /> :
            <Box>
              <Box>
                <Grid container spacing={0.5}>
                  <Grid item xs={12} sm={6}>
                    <div className="asks wrapper">
                      <OrderTable data={asksWithTotals} type={'asks'} />
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <div className="bids wrapper">
                      <OrderTable data={bidsWithTotals} type={'bids'} />
                    </div>
                  </Grid>
                </Grid>
              </Box>
              <Box className={'footer__wrapper'}>
                <Typography color={'#82baf6'}>{'FULL BOOK'}</Typography>
                <div className={'divider__section'}>
                  <span className="circle" />
                  <Typography sx={{ textDecoration: 'underline' }}>{'REAL-TIME'}</Typography>
                </div>
              </Box>
            </Box>}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default OrderBook;
