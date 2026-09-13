import { Sun } from 'lucide-react';
import cn from 'clsx';

import styles from './styles.module.scss';
import { Link } from 'react-router';

type HeaderProps = {
    readonly status: string;
    readonly statusTone?: 'live' | 'alert';
};

export default function Header({ status, statusTone = 'live' }: HeaderProps)
{
    return (
        <header className={styles.topbar}>
            <Link className={styles.brand} to="/" aria-label="Daybound Application">
                <span className={styles.brandMark}><Sun size={18} /></span>
                <span>daybound</span>
            </Link>
            <span className={styles.status}>
                <span className={cn(styles.statusDot, styles[statusTone])} />
                {status}
            </span>
        </header>
    );
}
