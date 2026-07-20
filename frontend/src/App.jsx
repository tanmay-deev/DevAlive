import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './app/routes.jsx';
import { ErrorBoundary } from './components/ui/ErrorBoundary.jsx';

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
