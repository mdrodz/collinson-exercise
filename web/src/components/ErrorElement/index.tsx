import { ArrowLeft } from 'lucide-react';

import Header from '../Header';
import styles from './styles.module.scss';
import { Link } from 'react-router';

export default function ErrorElement()
{
    return (
        <main className={styles.errorContainer}>
            <Header status="system pause" statusTone="alert" />

            <section className={styles.content} aria-labelledby="error-title">
                <p className={styles.eyebrow}>A brief change in the atmosphere</p>
                <h1 id="error-title">The forecast needs a<br /><em>moment to settle.</em></h1>
                <p className={styles.message}>Something unexpected happened while loading the page. Please return to the forecast and try again.</p>
                <Link className={styles.homeLink} to="/"><ArrowLeft size={17} /> Back to the forecast</Link>
            </section>
        </main>
    );
}
