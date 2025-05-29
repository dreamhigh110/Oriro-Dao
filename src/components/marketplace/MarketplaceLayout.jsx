import React from 'react';
import { Outlet } from 'react-router-dom';
import MarketplaceNav from './MarketplaceNav';

const MarketplaceLayout = () => {
  return (
    <div>
      <MarketplaceNav />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MarketplaceLayout;
