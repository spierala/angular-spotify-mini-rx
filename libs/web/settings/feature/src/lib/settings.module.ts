import { NgModule } from '@angular/core';

import {
  SETTINGS_FEATURE_KEY,
  settingsReducer,
  SettingsEffects,
  SettingsFacade
} from '@angular-spotify/web/settings/data-access';
import { EffectsModule, StoreModule } from 'mini-rx-store-ng';

@NgModule({
  imports: [
    StoreModule.forFeature(SETTINGS_FEATURE_KEY, settingsReducer),
    // Provide service in module constructor instead (because MiniRx has no `dispatch: false` yet for effects)
    // EffectsModule.forFeature([SettingsEffects])
  ],
  providers: [SettingsFacade]
})
export class SettingsModule {
  constructor(
    private settingsEffects: SettingsEffects
  ) {
  }
}
