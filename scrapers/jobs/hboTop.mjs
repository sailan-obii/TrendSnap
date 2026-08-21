import {
    NOUVEAUTES_TV_DAYS,
    NOUVEAUTES_TV_MAX_FIRST_AIR_YEARS,
    PROVIDER_IDS,
    runTmdbProviderSeriesJob,
} from '../utils/tmdbWatchProviders.mjs';

runTmdbProviderSeriesJob({
    providerId: PROVIDER_IDS.max,
    snapshotFile: 'hbo-series.json',
    label: 'Max (HBO)',
    recencyDays: NOUVEAUTES_TV_DAYS,
    maxFirstAirAgeYears: NOUVEAUTES_TV_MAX_FIRST_AIR_YEARS,
});
