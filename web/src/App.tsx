import { FormEvent, useEffect, useState } from 'react';
import { LoaderCircle, MapPin, Search, Sun } from 'lucide-react';

const WEATHER_QUERY = `
  query Weather($city: String!, $country: String!) {
    weather(city: $city, country: $country) {
      days { date activities { activity score label } }
    }
  }
`;

type Weather = { days: Array<{ date: string; activities: Array<{ activity: string; score: number; label: string }> }> };

const initialLocation = { city: 'Lisbon', country: 'Portugal' };
const dateFormatter = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'short', day: 'numeric' });

function formatForecastDate(value: string): string {
  const dateValue = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00` : value;
  const date = new Date(dateValue);

  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}

function App() {
  const [location, setLocation] = useState(initialLocation);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadWeather(city: string, country: string) {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:3000'}/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: WEATHER_QUERY, variables: { city, country } }),
      });
      const result = await response.json();
      if (!response.ok || result.errors?.length) throw new Error(result.errors?.[0]?.message ?? 'Unable to load this forecast.');
      setWeather(result.data.weather);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load this forecast.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadWeather(initialLocation.city, initialLocation.country);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (location.city.trim() && location.country.trim()) void loadWeather(location.city.trim(), location.country.trim());
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Daybound home"><span className="brand-mark"><Sun size={18} /></span>daybound</a>
        <span className="status"><span className="status-dot" /> live forecast</span>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Your day, in the open air</p>
          <h1>Weather with a little more <em>clarity.</em></h1>
          <p className="lede">A calm read on what the sky is doing now, and what it has planned next.</p>
        </div>
        <form className="search-form" onSubmit={handleSubmit}>
          <label><MapPin size={16} /><span className="sr-only">City</span><input value={location.city} onChange={(event) => setLocation({ ...location, city: event.target.value })} placeholder="City" /></label>
          <label><span className="sr-only">Country</span><input value={location.country} onChange={(event) => setLocation({ ...location, country: event.target.value })} placeholder="Country" /></label>
          <button type="submit" aria-label="Search forecast" disabled={loading}><Search size={18} /></button>
        </form>
      </section>

      {error ? <div className="error-banner">{error}</div> : null}
      <section className="forecast" aria-live="polite">
        <div className="forecast-heading"><div><p className="eyebrow">Next seven days in</p><h2>{location.city}</h2></div><span className="date-label">{weather ? `${weather.days.length} days ranked` : 'Loading forecast'}</span></div>
        {loading && !weather ? <div className="loading"><LoaderCircle className="spinner" size={28} /> Reading the atmosphere...</div> : null}
        {weather ? <div className="daily-list">{weather.days.map((day) => <article className="daily-card" key={day.date}><div><span className="section-label">{formatForecastDate(day.date)}</span><Sun size={20} /></div><ol>{day.activities.map((rating) => <li key={rating.activity}><span>{rating.activity.replaceAll('_', ' ')}</span><strong>{rating.score}</strong><small>{rating.label}</small></li>)}</ol></article>)}</div> : null}
      </section>
      <footer>Forecast data by <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a> · Built for the days ahead</footer>
    </main>
  );
}

export default App;