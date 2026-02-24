import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { NgHcaptchaModule } from 'ng-hcaptcha';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      NgHcaptchaModule.forRoot({
        siteKey: '72908aba-be74-4a9a-9d3e-78aa226e81fe',
        languageCode: 'es'
      })
    ),
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withHashLocation()), 
    provideHttpClient()
  ]
};
