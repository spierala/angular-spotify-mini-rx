import { GenericState } from '@angular-spotify/web/shared/data-access/models';
import { Injectable } from '@angular/core';
import { catchError, filter, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { ArtistApiService } from '@angular-spotify/web/shared/data-access/spotify-api';
import { AuthStore } from '@angular-spotify/web/auth/data-access';
import { ArtistStore } from './artist.store';
import { createFeatureSelector, createSelector, FeatureStore } from 'mini-rx-store';
import { EMPTY } from 'rxjs';

interface ArtistTopTracksState extends GenericState<SpotifyApi.ArtistsTopTracksResponse> {
  artistId: string;
}

const featureSelector = createFeatureSelector<ArtistTopTracksState>(); // The feature key is not needed when selectors are executed on a FeatureStore
const getData = createSelector(featureSelector, state => state.data);
const getStatus = createSelector(featureSelector, state => state.status);
const getError = createSelector(featureSelector, state => state.error);
const getVm = createSelector(getData, getStatus, getError, (data, status, error) => {
  return { data, error, status };
})

@Injectable()
export class ArtistTopTracksStore extends FeatureStore<ArtistTopTracksState> {
  readonly vm$ = this.select(getVm);

  loadArtistTopTracks = this.effect<string>((params$) =>
    params$.pipe(
      filter(artistId => !!artistId),
      tap(() => this.setState({ status: 'loading', error: null })),
      withLatestFrom(this.authStore.country$),
      switchMap(([artistId, country]) =>
        this.artistApi.getArtistTopTracks(artistId, country).pipe(
          tap(
            (data) => {
              this.setState({
                data,
                status: 'success',
                error: ''
              });
            },
            (error) => this.setState({ status: 'error', error: error as string })
          ),
          catchError(() => EMPTY)
        )
      )
    )
  );

  constructor(
    private readonly artistStore: ArtistStore,
    private readonly authStore: AuthStore,
    private readonly artistApi: ArtistApiService
  ) {
    super('artistTopTracks', <ArtistTopTracksState>{});

    this.artistStore.artistIdParams$.subscribe(
      artistIdParams => this.loadArtistTopTracks(artistIdParams)
    )
  }
}
