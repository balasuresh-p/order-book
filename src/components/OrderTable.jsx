import React, { useEffect, useMemo, useRef } from 'react';
import { TableRow } from './styledComponents';

const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

const OrderTableRow = ({ level, index, type }) => {
    const prevValue = usePrevious({ level, index });
    const isValueNotUpdated = prevValue?.level?.count === level.count && prevValue?.level?.amount === level.amount && prevValue?.level?.total === level.total && prevValue?.level?.price === level.price && prevValue?.index === index
    return type === 'asks' ?
        <TableRow percentage={`${level.percentage}%`} type={type} className={isValueNotUpdated ? '' : 'update'} key={index}>
            <td align="center">{level.count}</td>
            <td align="right">{level.amount}</td>
            <td align="right">{level.total}</td>
            <td align="right" style={{ paddingRight: '10px' }}>{level.price}</td>
        </TableRow> :
        <TableRow percentage={`${level.percentage}%`} type={type} className={isValueNotUpdated ? '' : 'update'} key={index}>
            <td align="left" style={{ paddingLeft: '10px' }}>{level.price}</td>
            <td align="right">{level.total}</td>
            <td align="right">{level.amount}</td>
            <td align="center">{level.count}</td>
        </TableRow>
}

const OrderTable = ({ data, type }) => {
    const memoizedRows = useMemo(() => {
        return data.map((level, index) => (
            <OrderTableRow key={index} index={index} level={level} type={type} />
        ));
    }, [data, type]);

    return (
        <table>
            <thead>
                {type === 'asks' ?
                    <tr>
                        <th>Count</th>
                        <th align="right">Amount</th>
                        <th align="right">Total</th>
                        <th align="right" style={{ paddingRight: '10px' }}>Price</th>
                    </tr> :
                    <tr>
                        <th align="left" style={{ paddingLeft: '10px' }}>Price</th>
                        <th align="right">Total</th>
                        <th align="right">Amount</th>
                        <th>Count</th>
                    </tr>}
            </thead>
            <tbody>{memoizedRows}</tbody>
        </table>
    );
};

export default OrderTable;