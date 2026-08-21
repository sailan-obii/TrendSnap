import {
    NOUVEAUTES_TV_DAYS,
    PROVIDER_IDS,
    runTmdbProviderSeriesJob,
} from '../utils/tmdbWatchProviders.mjs';

runTmdbProviderSeriesJob({
    providerId: PROVIDER_IDS.disneyPlus,
    snapshotFile: 'disney-series.json',
    label: 'Disney+',
    recencyDays: NOUVEAUTES_TV_DAYS,
});
