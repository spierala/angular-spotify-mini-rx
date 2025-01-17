import { GenericState, SpotifyApiRecentPlayerTracksResponse } from '@angular-spotify/web/shared/data-access/models';
import { reducer as createReducer, on } from 'ts-action';
import { loadRecentTracks, loadRecentTracksError, loadRecentTracksSuccess } from './recent-played-tracks.action';

export type RecentPlayedTracksState = GenericState<SpotifyApiRecentPlayerTracksResponse>;

const initialState: RecentPlayedTracksState = {
  data: null,
  status: 'pending',
  error: null
};

export const recentFeatureTracksFeatureKey = 'recentTracks';

export const recentPlayedTracksReducer = createReducer<RecentPlayedTracksState>(
  initialState,
  on(loadRecentTracks, (state) => ({ ...state, status: 'loading' })),
  on(loadRecentTracksSuccess, (state, { response }) => ({
    ...state,
    data: response,
    status: 'success',
    error: null
  })),
  on(loadRecentTracksError, (state, { error }) => ({
    ...state,
    error,
    status: 'error'
  }))
);
