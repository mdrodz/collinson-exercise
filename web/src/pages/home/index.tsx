import { type SubmitEvent, useCallback, useEffect, useState } from 'react';
import { LoaderCircle, MapPin, Search, Sun } from 'lucide-react';
import { useHeaderStatus } from '../../contexts/header-status-provider';
import { Link } from 'react-router';
import loadWeather from '../../api/weather/load-weather';
import { useQuery } from '@tanstack/react-query';
import useTrimmedString from '../../hooks/use-trimmed-string';
import styles from './styles.module.scss';

const initialLocation = { city: 'São Paulo', country: 'Brazil' };
const dateFormatter = new Intl.DateTimeFormat();

function formatForecastDate(value: string): string
{
    const dateValue = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00` : value;
    const date = new Date(dateValue);

    return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}

export default function Home()
{
    const { setStatusAndTone } = useHeaderStatus();
    const [city, setCity] = useTrimmedString(initialLocation.city);
    const [country, setCountry] = useTrimmedString(initialLocation.country);
    const [submittedLocation, setSubmittedLocation] = useState(initialLocation);

    const { data: weather, error, isLoading, isFetching } = useQuery({
        queryKey: ['weather', submittedLocation.city, submittedLocation.country],
        queryFn: () => loadWeather(submittedLocation.city, submittedLocation.country),
    });

    useEffect(() => {
        if (isFetching) {
            setStatusAndTone('loading forecast');
        } else if (error) {
            setStatusAndTone('forecast unavailable', 'alert');
        } else {
            setStatusAndTone('live forecast');
        }
    }, [error, isFetching, setStatusAndTone]);

    const handleSubmit = useCallback((evt: SubmitEvent<HTMLFormElement>) =>
    {
        evt.preventDefault();

        if (!city || !country || (city === submittedLocation.city && country === submittedLocation.country)) {
            return;
        }

        setSubmittedLocation({ city, country });
    }, [city, country, submittedLocation, setSubmittedLocation]);

    return (
        <div className={styles.appShell}>
            <section className={styles.hero}>
                <div className={styles.heroCopy}>
                    <p className={styles.eyebrow}>Your day, in the open air</p>
                    <h1>Weather with a little more <em>clarity.</em></h1>
                    <p className={styles.lede}>A calm read on what the sky is doing now, and what it has planned next.</p>
                </div>
                <form className={styles.searchForm} onSubmit={handleSubmit}>
                    <label><MapPin size={16} /><span className={styles.srOnly}>City</span><input value={city} onChange={(evt) => setCity(evt.currentTarget.value)} placeholder="City" /></label>
                    <label><span className={styles.srOnly}>Country</span><input value={country} onChange={(evt) => setCountry(evt.currentTarget.value)} placeholder="Country" /></label>
                    <button type="submit" aria-label="Search forecast" disabled={isFetching}><Search size={18} /></button>
                </form>
            </section>

            {error ? <div className={styles.errorBanner}>{error.message}</div> : null}
            <section className={styles.forecast} aria-live="polite">
                <div className={styles.forecastHeading}><div><p className={styles.eyebrow}>Next seven days in</p><h2>{submittedLocation.city}, {submittedLocation.country}</h2></div><span className={styles.dateLabel}>{weather ? `${weather.days.length} days ranked` : 'Loading forecast'}</span></div>
                {isLoading ? <div className={styles.loading}><LoaderCircle className={styles.spinner} size={28} /> Reading the atmosphere...</div> : null}
                {weather ? <div className={styles.dailyList}>{weather.days.map((day) => <article className={styles.dailyCard} key={day.date}><div><span className={styles.sectionLabel}>{formatForecastDate(day.date)}</span><Sun size={20} /></div><ol>{day.activities.map((rating) => <li key={rating.activity}><span>{rating.activity.replaceAll('_', ' ')}</span><strong>{rating.score}</strong><small>{rating.label}</small></li>)}</ol></article>)}</div> : null}
            </section>
            <footer className={styles.footer}>Forecast data by <Link to="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</Link> · Built for the days ahead</footer>
        </div>
    );
}
