import { GenericState } from '@angular-spotify/web/shared/data-access/models';
import {
  PlayerApiService,
  TrackApiService
} from '@angular-spotify/web/shared/data-access/spotify-api';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { SelectorUtil } from '@angular-spotify/web/shared/utils';
import { Injectable } from '@angular/core';
import { FeatureStore } from 'mini-rx-store';
import { EMPTY } from 'rxjs';

type TracksState = GenericState<SpotifyApi.UsersSavedTracksResponse>;

@Injectable()
export class TracksStore extends FeatureStore<TracksState> {
  loadTracks = this.effect((params$) =>
    params$.pipe(
      tap(() => {
        this.setState({
          status: 'loading',
          error: null
        });
      }),
      switchMap(() =>
        this.trackApi.getUserSavedTracks().pipe(
          tap(
            (response) => {
              this.setState({
                data: response,
                status: 'success',
                error: ''
              });
            }),
          catchError((error) => {
            this.setState({
              status: 'error',
              error: error as string
            });
            return EMPTY;
          })
        )
      )
    )
  );

  playTrack = this.effect<{ track: SpotifyApi.TrackObjectFull }>((params$) =>
    params$.pipe(
      switchMap(({ track }) =>
        this.playerApi.play({
          context_uri: track.album.uri,
          offset: {
            position: track.track_number - 1
          }
        })
      )
    )
  );

  vm$ = this.select((s) => ({
    ...s,
    isLoading: SelectorUtil.isLoading(s)
  }));

  constructor(private trackApi: TrackApiService, private playerApi: PlayerApiService) {
    super('tracks', <TracksState>{});
  }
}
