import { writable } from "svelte/store";

export const global_session = writable('');
export const progress_value = writable();
export const progress_enabled = writable(false);

export const theme = writable(window.localStorage.getItem('theme') ?? 'light');