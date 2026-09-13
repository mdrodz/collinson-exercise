import { ArrowLeft, Sun } from 'lucide-react';
import styles from './styles.module.scss';

export default function NotFound()
{
    return (
        <main className={styles.notFound}>
            <header className={styles.topbar}>
                <a className={styles.brand} href="/" aria-label="Daybound home">
                    <span className={styles.brandMark}><Sun size={18} /></span>
                    <span>daybound</span>
                </a>
                <span className={styles.status}><span className={styles.statusDot} /> page not found</span>
            </header>

            <section className={styles.content} aria-labelledby="not-found-title">
                <p className={styles.eyebrow}>A small change of direction</p>
                <h1 id="not-found-title">This page wandered<br /><em>off the map.</em></h1>
                <p className={styles.message}>The forecast is still here. The page you were looking for is not.</p>
                <a className={styles.homeLink} href="/"><ArrowLeft size={17} /> Back to the forecast</a>
            </section>
        </main>
    );
}
