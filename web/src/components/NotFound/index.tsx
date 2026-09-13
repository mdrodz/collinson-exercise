import { ArrowLeft } from 'lucide-react';
import Header from '../Header';
import styles from './styles.module.scss';
import { Link } from 'react-router';

export default function NotFound()
{
    return (
        <main className={styles.notFound}>
            <Header status="page not found" statusTone="alert" />

            <section className={styles.content} aria-labelledby="not-found-title">
                <p className={styles.eyebrow}>A small change of direction</p>
                <h1 id="not-found-title">This page wandered<br /><em>off the map.</em></h1>
                <p className={styles.message}>The forecast is still here. The page you were looking for is not.</p>
                <Link className={styles.homeLink} to="/"><ArrowLeft size={17} /> Back to the forecast</Link>
            </section>
        </main>
    );
}
