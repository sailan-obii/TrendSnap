import {
    NOUVEAUTES_MOVIE_DAYS,
    PROVIDER_IDS,
    runTmdbProviderMoviesJob,
} from '../utils/tmdbWatchProviders.mjs';

runTmdbProviderMoviesJob({
    providerId: PROVIDER_IDS.disneyPlus,
    snapshotFile: 'disney-movies.json',
    label: 'Disney+',
    recencyDays: NOUVEAUTES_MOVIE_DAYS,
});
