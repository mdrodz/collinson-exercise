import { PureComponent, type ReactNode } from 'react';

import * as styles from './styles.module.scss';

type ErrorBoundaryProps = { children?: ReactNode };
type ErrorBoundaryState = { hasError: boolean; };

export class ErrorBoundary extends PureComponent<ErrorBoundaryProps, ErrorBoundaryState>
{
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false
        };
    }

    static getDerivedStateFromError()
    {
        return {
            hasError: true
        };
    }

    render()
    {
        if (!this.state.hasError) {
            return this.props.children;
        }

        return (
            <div className={styles['error-container']}>
                <h1>Oops, an exception has ocurred...</h1>
                <p>Please, try again in a few seconds!</p>
            </div>
        );
    }
}
