import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

// Mock the data provider and firebase to prevent network calls and initialization errors during tests
jest.mock('./components/data-provider', () => ({
  DataProvider: ({ children }: any) => <div>{children}</div>,
  useDataProvider: () => ({ categories: [], items: [], getItemById: () => undefined }),
}));

jest.mock('./utils/firebase', () => ({
  db: {},
  app: {},
  firebaseConfig: {}
}));

test('renders without crashing', () => {
  render(<App />);
});
