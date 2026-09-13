import { ArrowLeft, Sun } from 'lucide-react';

import styles from './styles.module.scss';

export default function ErrorElement()
{
    return (
        <main className={styles.errorContainer}>
            <header className={styles.topbar}>
                <a className={styles.brand} href="/" aria-label="Daybound home">
                    <span className={styles.brandMark}><Sun size={18} /></span>
                    <span>daybound</span>
                </a>
                <span className={styles.status}><span className={styles.statusDot} /> system pause</span>
            </header>

            <section className={styles.content} aria-labelledby="error-title">
                <p className={styles.eyebrow}>A brief change in the atmosphere</p>
                <h1 id="error-title">The forecast needs a<br /><em>moment to settle.</em></h1>
                <p className={styles.message}>Something unexpected happened while loading the page. Please return to the forecast and try again.</p>
                <a className={styles.homeLink} href="/"><ArrowLeft size={17} /> Back to the forecast</a>
            </section>
        </main>
    );
}
