import { PROVIDER_IDS, runTmdbProviderMoviesJob } from '../utils/tmdbWatchProviders.mjs';

runTmdbProviderMoviesJob({
    providerId: PROVIDER_IDS.disneyPlus,
    snapshotFile: 'disney-movies.json',
    label: 'Disney+',
});
