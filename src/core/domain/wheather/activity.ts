export enum Activity
{
    Skiing = 'SKIING',
    Surfing = 'SURFING',
    OutdoorSightseeing = 'OUTDOOR_SIGHTSEEING',
    IndoorSightseeing = 'INDOOR_SIGHTSEEING'
}

export enum ActivityRatingLabel
{
    Excellent = 'EXCELLENT',
    Good = 'GOOD',
    Fair = 'FAIR',
    Poor = 'POOR'
}

export interface ActivityRating
{
    activity: Activity;
    score: number;
    label: ActivityRatingLabel;
}

export interface DailyActivityRating
{
    date: string;
    activities: ActivityRating[];
}
