import { writable } from 'svelte/store';

/**
 * Reactive store indicating if the hero video has finished loading/playing.
 * Once true, other page components will eagerly load their video assets.
 */
export const heroVideoLoaded = writable(false);
