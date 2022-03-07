import { render, screen } from '@testing-library/react';
import App from './App';

test('Validate popstore', () => {
  render(<App />);
  const divElements = screen.getAllByText(/Create Popstore from a spreadsheet/i);
  expect(divElements[0]).toBeInTheDocument();
});
