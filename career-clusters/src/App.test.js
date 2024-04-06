/*
Test case for rendering the "learn react" link in the App component.

Features:
- Renders the App component.
- Finds the "learn react" link in the rendered component.
- Expects the "learn react" link to be present in the document.

LAST EDITED 04/05/2024 Gavin T. Anderson
*/

import { render, screen } from '@testing-library/react'; // Importing render and screen utilities from testing-library/react
import App from './App'; // Importing the App component

test('renders learn react link', () => {
  render(<App />); // Renders the App component
  const linkElement = screen.getByText(/learn react/i); // Finds the "learn react" link using case-insensitive regular expression
  expect(linkElement).toBeInTheDocument(); // Expects the "learn react" link to be present in the document
});
