export type GraphQLResponse<Name extends string, T> = {
    data: {
        [Key in Name]: T;
    };
};
