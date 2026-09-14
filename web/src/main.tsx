import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Routes from './routes';
import { QueryProvider } from './contexts/QueryProvider';
import { HeaderStatusProvider } from './contexts/HeaderStatusProvider';

import './styles.css';

const rootElement = document.querySelector<HTMLDivElement>('#root');
if (!rootElement) {
    throw new Error('Div with id #root not found.');
}

const root = createRoot(rootElement);

root.render(
    <StrictMode>
        <QueryProvider>
            <HeaderStatusProvider>
                <Routes />
            </HeaderStatusProvider>
        </QueryProvider>
    </StrictMode>,
);
