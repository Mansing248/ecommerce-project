// src/components/Checkout.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Checkout from './Checkout';

test('renders Checkout component and submits form', () => {
  render(<Checkout />);
  
  // Simulate user input
  fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
  fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: '123 Main St' } });
  fireEvent.change(screen.getByLabelText(/Card Number/i), { target: { value: '4111111111111111' } });
  fireEvent.change(screen.getByLabelText(/Expiry Date/i), { target: { value: '12/25' } });
  fireEvent.change(screen.getByLabelText(/CVV/i), { target: { value: '123' } });
  
  // Simulate form submission
  fireEvent.click(screen.getByText(/Submit/i));
  
  // Check for submission message
  expect(screen.getByText(/Thank you for your purchase!/i)).toBeInTheDocument();
});
