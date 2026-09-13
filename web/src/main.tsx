import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Routes from './routes';
import { ErrorBoundary } from './components/ErrorElement';
import { QueryProvider } from './contexts/QueryProvider';

import './styles.css';

const rootElement = document.querySelector<HTMLDivElement>('#root');
if (!rootElement) {
    throw new Error('Div with id #root not found.');
}

const root = createRoot(rootElement);

root.render(
    <StrictMode>
        <QueryProvider>
            <Routes />
        </QueryProvider>
    </StrictMode>,
);
