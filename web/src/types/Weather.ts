export type Weather = {
    days: Forecast[];
};

type Activity = {
    activity: string;
    score: number;
    label: string;
};

type Forecast = {
    date: string;
    activities: Activity[];
};
