import { GenericState } from '@angular-spotify/web/shared/data-access/models';
import { reducer as createReducer, on } from 'ts-action';
import {
  loadFeaturedPlaylists,
  loadFeaturedPlaylistsError,
  loadFeaturedPlaylistsSuccess
} from './feature-playlists.action';

export type FeaturePlaylistsState = GenericState<SpotifyApi.ListOfFeaturedPlaylistsResponse>;

const initialState: FeaturePlaylistsState = {
  data: null,
  status: 'pending',
  error: null
};

export const featuredPlaylistsFeatureKey = 'feature-playlists';

export const featuredPlaylistsReducer = createReducer<FeaturePlaylistsState>(
  initialState,
  on(loadFeaturedPlaylists, (state) => ({ ...state, status: 'loading' })),
  on(loadFeaturedPlaylistsSuccess, (state, { response }) => ({
    ...state,
    data: response,
    status: 'success',
    error: null
  })),
  on(loadFeaturedPlaylistsError, (state, { error }) => ({
    ...state,
    error,
    status: 'error'
  }))
);
