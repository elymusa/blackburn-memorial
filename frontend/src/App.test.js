import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders the admin login link on the main page', () => {
  // We need to wrap App in BrowserRouter because it uses <Link>
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const linkElement = screen.getByText(/Admin Login/i);
  expect(linkElement).toBeInTheDocument();
});
