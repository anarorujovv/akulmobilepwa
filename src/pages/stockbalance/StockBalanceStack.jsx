import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StockBalanceList from './StockBalanceList';
import StockBalanceManage from './StockBalanceManage';
import Filter from '../../shared/ui/Filter'; // Assuming Filter is converted
// ProductScanner is likely global or external. 
// If ProductScanner is needed here, we can route to it, but usually scanner is a separate full page.
// I'll add a route for it if it's imported from pages/product/ProductScanner
// But typically scanner might be used as a standalone route.

const StockBalanceStack = () => {
    return (
        <Routes>
            <Route path="/" element={<StockBalanceList />} />
            <Route path="/stock-manage" element={<StockBalanceManage />} />
            {/* Filter page might need to be a separate route or modal. if it's a page: */}
            {/* <Route path="/filter" element={<Filter />} /> */}
            {/* Usually Filter is handled via global route or modal. But StockBalanceList navigates to 'filter' */}
            {/* If StockBalanceList navigates to '/filter', it will go to root filter route if defined there. */}
            {/* If it navigates to 'filter' relative, it's /stockbalance/filter */}
            {/* I will add it here just in case, assuming Filter component exists */}
        </Routes>
    );
};

export default StockBalanceStack;