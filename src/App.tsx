import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Root } from 'pages/root';
import { Menu } from 'pages/menu';
import { Item } from 'pages/item';
import { Cart } from 'pages/cart';
import { Checkout } from 'pages/checkout';
import { ThankYou } from 'pages/thankYou';
import { Info } from 'pages/info';
import { Admin } from 'pages/admin';
import { DataProvider } from 'components/data-provider';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Menu />
      },
      {
        path: 'item/:id',
        element: <Item />
      },
      {
        path: 'cart',
        element: <Cart />
      },
      {
        path: 'checkout',
        element: <Checkout />
      },
      {
        path: 'thankYou',
        element: <ThankYou />
      },
      {
        path: 'info',
        element: <Info />
      }
    ]
  },
  {
    path: '/admin/*',
    element: <Admin />
  }
]);

function App() {
  return (
    <DataProvider>
      <RouterProvider router={router} />
    </DataProvider>
  );
}

export default App;
