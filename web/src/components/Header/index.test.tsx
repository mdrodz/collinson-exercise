import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Header from '.';
import { MemoryRouter } from 'react-router';

describe('Header', () => {
    afterEach(cleanup);

    it('renders the brand and live status', () => {
        const { asFragment } = render(
            <MemoryRouter>
                <Header status="live forecast" />
            </MemoryRouter>
        );

        expect(screen.getByRole('link', { name: 'Daybound Application' }).getAttribute('href')).toBe('/');
        expect(screen.getByText('daybound')).toBeDefined();
        expect(screen.getByText('live forecast')).toBeDefined();
        
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders the alert status tone when requested', () => {
        const { asFragment } = render(
            <MemoryRouter>
                <Header status="page not found" statusTone="alert" />
            </MemoryRouter>
        );

        expect(screen.getByText('page not found')).toBeDefined();
        
        expect(asFragment()).toMatchSnapshot();
    });
});
