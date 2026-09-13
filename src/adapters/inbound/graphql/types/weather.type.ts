import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ActivityRatingType
{
    @Field(() => String) activity!: string;
    @Field(() => Number) score!: number;
    @Field(() => String) label!: string;
}

@ObjectType()
export class DailyWeatherType
{
    @Field(() => String) date!: string;
    @Field(() => [ActivityRatingType]) activities!: ActivityRatingType[];
}

@ObjectType()
export class WeatherType
{
    @Field(() => [DailyWeatherType]) days!: DailyWeatherType[];
}
