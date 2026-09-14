import { ArrowLeft } from 'lucide-react';
import styles from './styles.module.scss';
import { Link } from 'react-router';
import { useHeaderStatus } from '../../contexts/HeaderStatusProvider';
import { useEffect, useId } from 'react';

export default function NotFound()
{
    const ariaLabel = useId();
    const { setStatusAndTone } = useHeaderStatus();
    
    useEffect(() => {
        setStatusAndTone('page not found', 'alert');
    }, [setStatusAndTone]);

    return (
        <section className={styles.content} aria-labelledby={ariaLabel}>
            <p className={styles.eyebrow}>A small change of direction</p>
            <h1 id={ariaLabel}>This page wandered<br /><em>off the map.</em></h1>
            <p className={styles.message}>The forecast is still here. The page you were looking for is not.</p>
            <Link className={styles.homeLink} to="/"><ArrowLeft size={17} /> Back to the forecast</Link>
        </section>
    );
}
