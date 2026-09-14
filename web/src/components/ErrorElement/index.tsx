import { ArrowLeft } from 'lucide-react';

import styles from './styles.module.scss';
import { Link } from 'react-router';
import { useHeaderStatus } from '../../contexts/HeaderStatusProvider';
import { useEffect, useId } from 'react';

export default function ErrorElement()
{
    const ariaLabel = useId();
    const { setStatusAndTone } = useHeaderStatus();
    
    useEffect(() => {
        setStatusAndTone('system pause', 'alert');
    }, [setStatusAndTone]);

    return (
        <section className={styles.content} aria-labelledby={ariaLabel}>
            <p className={styles.eyebrow}>A brief change in the atmosphere</p>
            <h1 id={ariaLabel}>The forecast needs a<br /><em>moment to settle.</em></h1>
            <p className={styles.message}>Something unexpected happened while loading the page. Please return to the forecast and try again.</p>
            <Link className={styles.homeLink} to="/"><ArrowLeft size={17} /> Back to the forecast</Link>
        </section>
    );
}
