import { saveSnapshot } from './saveSnapshot.mjs';
import {
    getAuth,
    LANGUAGE,
    loadEnvFile,
    pickTrailerUrl,
    posterUrl,
    backdropUrl,
    REGION,
    tmdbFetch,
    isoDaysAgo,
} from './tmdb.mjs';

export const TOP_N = 10;

/** Fenêtre « nouveautés » films (chrono FR : sortie salles → SVOD). */
export const NOUVEAUTES_MOVIE_DAYS = 730;
/** Fenêtre « nouveautés » séries : épisodes / saisons diffusés récemment. */
export const NOUVEAUTES_TV_DAYS = 365;

/** IDs TMDB watch providers (région FR). */
export const PROVIDER_IDS = {
    /** Max (ex-HBO Max) */
    max: 1899,
    /** Paramount+ */
    paramountPlus: 531,
    /** Disney+ */
    disneyPlus: 337,
};

async function discoverPopularByProvider(auth, pathname, providerId, { topN = TOP_N, extraParams = {} } = {}) {
    const data = await tmdbFetch(pathname, auth, {
        language: LANGUAGE,
        watch_region: REGION,
        with_watch_providers: String(providerId),
        with_watch_monetization_types: 'flatrate',
        sort_by: 'popularity.desc',
        include_adult: false,
        page: 1,
        ...extraParams,
    });

    return (data.results ?? []).slice(0, topN);
}

function recencyParams(mediaType, recencyDays) {
    if (!recencyDays) return {};

    const from = isoDaysAgo(recencyDays);
    const to = isoDaysAgo(0);

    if (mediaType === 'movie') {
        return {
            'primary_release_date.gte': from,
            'primary_release_date.lte': to,
        };
    }

    return {
        'air_date.gte': from,
        'air_date.lte': to,
    };
}

/**
 * Top séries TMDB disponibles chez un provider, tri popularité.
 * Ce n'est pas le Top 10 officiel de la plateforme.
 */
export async function discoverPopularTvByProvider(auth, providerId, options) {
    return discoverPopularByProvider(auth, '/discover/tv', providerId, options);
}

/**
 * Top films TMDB disponibles chez un provider, tri popularité.
 * Ce n'est pas le Top 10 officiel de la plateforme.
 */
export async function discoverPopularMoviesByProvider(auth, providerId, options) {
    return discoverPopularByProvider(auth, '/discover/movie', providerId, options);
}

function pickStars(details) {
    return (details.credits?.cast ?? [])
        .slice(0, 5)
        .map((person) => person.name)
        .filter(Boolean);
}

function pickGenres(details) {
    return (details.genres ?? []).map((g) => g.name).filter(Boolean);
}

function pickOriginCountry(details) {
    return details.production_countries?.[0]?.name || details.origin_country?.[0] || '';
}

async function enrichTvShow(listItem, rank, auth) {
    const details = await tmdbFetch(`/tv/${listItem.id}`, auth, {
        language: LANGUAGE,
        append_to_response: 'credits,videos',
    });

    const airDate = details.first_air_date || listItem.first_air_date || '';
    const image = posterUrl(details.poster_path || listItem.poster_path);

    return {
        id: rank,
        poster: image,
        title: details.name || listItem.name || '',
        description: details.overview || listItem.overview || '',
        stars: pickStars(details),
        imgVertical: image,
        pageInfosUrl: `https://www.themoviedb.org/tv/${listItem.id}`,
        genres: pickGenres(details),
        originCountry: pickOriginCountry(details),
        trailerUrl: pickTrailerUrl(details.videos),
        year: airDate ? airDate.slice(0, 4) : '',
        nbSaisons: details.number_of_seasons ?? '',
        nbEpisodes: details.number_of_episodes ?? '',
        backdropUrl: backdropUrl(details.backdrop_path || listItem.backdrop_path),
    };
}

function fallbackTvShow(listItem, rank) {
    const image = posterUrl(listItem.poster_path);
    const airDate = listItem.first_air_date || '';

    return {
        id: rank,
        poster: image,
        title: listItem.name || '',
        description: listItem.overview || '',
        stars: [],
        imgVertical: image,
        pageInfosUrl: `https://www.themoviedb.org/tv/${listItem.id}`,
        genres: [],
        originCountry: '',
        trailerUrl: '',
        year: airDate ? airDate.slice(0, 4) : '',
        nbSaisons: '',
        nbEpisodes: '',
        backdropUrl: backdropUrl(listItem.backdrop_path),
    };
}

async function enrichMovie(listItem, rank, auth) {
    const details = await tmdbFetch(`/movie/${listItem.id}`, auth, {
        language: LANGUAGE,
        append_to_response: 'credits,videos',
    });

    const releaseDate = details.release_date || listItem.release_date || '';
    const image = posterUrl(details.poster_path || listItem.poster_path);

    return {
        id: rank,
        poster: image,
        title: details.title || listItem.title || '',
        description: details.overview || listItem.overview || '',
        stars: pickStars(details),
        imgVertical: image,
        pageInfosUrl: `https://www.themoviedb.org/movie/${listItem.id}`,
        genres: pickGenres(details),
        originCountry: pickOriginCountry(details),
        trailerUrl: pickTrailerUrl(details.videos),
        year: releaseDate ? releaseDate.slice(0, 4) : '',
        backdropUrl: backdropUrl(details.backdrop_path || listItem.backdrop_path),
    };
}

function fallbackMovie(listItem, rank) {
    const image = posterUrl(listItem.poster_path);
    const releaseDate = listItem.release_date || '';

    return {
        id: rank,
        poster: image,
        title: listItem.title || '',
        description: listItem.overview || '',
        stars: [],
        imgVertical: image,
        pageInfosUrl: `https://www.themoviedb.org/movie/${listItem.id}`,
        genres: [],
        originCountry: '',
        trailerUrl: '',
        year: releaseDate ? releaseDate.slice(0, 4) : '',
        backdropUrl: backdropUrl(listItem.backdrop_path),
    };
}

async function runTmdbProviderJob({ providerId, snapshotFile, label, mediaType, recencyDays }) {
    loadEnvFile();
    const auth = getAuth();
    const isMovie = mediaType === 'movie';
    const kind = isMovie ? 'films' : 'séries';
    const discover = isMovie ? discoverPopularMoviesByProvider : discoverPopularTvByProvider;
    const enrich = isMovie ? enrichMovie : enrichTvShow;
    const fallback = isMovie ? fallbackMovie : fallbackTvShow;
    const extraParams = recencyParams(mediaType, recencyDays);

    try {
        console.log(`TMDB Discover ${kind} ${label} (provider ${providerId}, ${REGION})...`);
        if (recencyDays) {
            const from = extraParams['primary_release_date.gte'] || extraParams['air_date.gte'];
            const to = extraParams['primary_release_date.lte'] || extraParams['air_date.lte'];
            console.log(`Filtre nouveautés : ${from} → ${to} (${recencyDays} jours)`);
        }

        const results = await discover(auth, providerId, { extraParams });

        if (results.length === 0) {
            throw new Error(`Aucun résultat TMDB Discover pour ${label} (${kind}).`);
        }

        if (recencyDays && results.length < TOP_N) {
            console.warn(`Seulement ${results.length} ${kind} après filtre nouveautés pour ${label}.`);
        }

        console.log(`TMDB ${label} : ${results.length} ${kind}`);

        const items = [];
        for (let i = 0; i < results.length; i++) {
            const item = results[i];
            const title = isMovie ? item.title : item.name;
            console.log(`[${i + 1}/${results.length}] Enrichissement : ${title}...`);
            try {
                items.push(await enrich(item, i + 1, auth));
            } catch (err) {
                console.error(`Échec enrichissement "${title}":`, err.message);
                items.push(fallback(item, i + 1));
            }
        }

        saveSnapshot(snapshotFile, items);
        console.log(`Job ${label} ${kind} TMDB terminé.`);
    } catch (error) {
        console.error(`Erreur job ${label} (${kind}) :`, error.message);
        process.exitCode = 1;
    }
}

/**
 * @param {object} config
 * @param {number} config.providerId - ID watch provider TMDB
 * @param {string} config.snapshotFile
 * @param {string} config.label
 * @param {number} [config.recencyDays] - Si défini, limite aux titres récents (nouveautés).
 */
export async function runTmdbProviderSeriesJob(config) {
    return runTmdbProviderJob({ ...config, mediaType: 'tv' });
}

/**
 * @param {object} config
 * @param {number} config.providerId - ID watch provider TMDB
 * @param {string} config.snapshotFile
 * @param {string} config.label
 * @param {number} [config.recencyDays] - Si défini, limite aux titres récents (nouveautés).
 */
export async function runTmdbProviderMoviesJob(config) {
    return runTmdbProviderJob({ ...config, mediaType: 'movie' });
}
