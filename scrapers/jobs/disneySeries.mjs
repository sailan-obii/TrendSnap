import {
    NOUVEAUTES_TV_DAYS,
    NOUVEAUTES_TV_MAX_FIRST_AIR_YEARS,
    PROVIDER_IDS,
    runTmdbProviderSeriesJob,
} from '../utils/tmdbWatchProviders.mjs';

runTmdbProviderSeriesJob({
    providerId: PROVIDER_IDS.disneyPlus,
    snapshotFile: 'disney-series.json',
    label: 'Disney+',
    recencyDays: NOUVEAUTES_TV_DAYS,
    maxFirstAirAgeYears: NOUVEAUTES_TV_MAX_FIRST_AIR_YEARS,
});
