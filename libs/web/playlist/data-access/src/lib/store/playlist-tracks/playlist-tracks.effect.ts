import { PlaylistApiService } from '@angular-spotify/web/shared/data-access/spotify-api';
import { Injectable } from '@angular/core';
import { Actions, Store } from 'mini-rx-store';
import { ofType } from 'ts-action-operators';
import { EMPTY } from 'rxjs';
import { catchError, filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { getPlaylistTracksState } from './playlist-tracks.selector';
import {
  loadPlaylistTracks,
  loadPlaylistTracksSuccess,
  setPlaylistTracksStateStatus
} from './playlist-tracks.action';

@Injectable({ providedIn: 'root' })
export class PlaylistTracksEffect {
  loadPlaylistTracks$ =
    this.actions$.pipe(
      ofType(loadPlaylistTracks),
      withLatestFrom(this.store.select(getPlaylistTracksState)),
      tap(([{ playlistId }, playlistTracks]) => {
        if (playlistTracks.data?.has(playlistId)) {
          this.store.dispatch(
            setPlaylistTracksStateStatus({
              status: 'success'
            })
          );
        }
      }),
      filter(([{ playlistId }, playlistTracks]) => {
        return !playlistTracks.data?.has(playlistId);
      }),
      switchMap(([{ playlistId }]) =>
        this.playlistsApi.getTracks(playlistId).pipe(
          map((playlistTracks) =>
            loadPlaylistTracksSuccess({
              playlistId,
              playlistTracks
            })
          ),
          catchError(() => EMPTY)
        )
      )
  );

  constructor(
    private actions$: Actions,
    private playlistsApi: PlaylistApiService,
    private store: Store
  ) {}
}
