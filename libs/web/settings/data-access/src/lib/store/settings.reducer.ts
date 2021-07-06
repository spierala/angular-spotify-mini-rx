import { reducer as createReducer, on } from 'ts-action';
import * as SettingsActions from './settings.actions';
import { LocalStorageService } from '../services';

export const SETTINGS_FEATURE_KEY = 'settings';

export interface SettingsState {
  volume: number;
}

export const initialState: SettingsState = LocalStorageService.loadInitialState()?.settings ?? {}

export const settingsReducer = createReducer(
  initialState,
  on(SettingsActions.persistVolume, (state, { volume }) => ({
    ...state,
    volume
  }))
);
