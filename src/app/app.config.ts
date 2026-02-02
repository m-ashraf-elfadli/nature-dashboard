import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import {
  withFetch,
  provideHttpClient,
  withInterceptors,
  HttpInterceptorFn,
} from '@angular/common/http';

import { routes } from './app.routes';
import Aura from '@primeng/themes/aura';

import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { TokenInterceptor } from './core/interceptors/token.interceptor';
import { LoaderInterceptor } from './core/interceptors/loader.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),

    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: 'none',
        },
      },
    }),

    provideHttpClient(
      withFetch(),
      withInterceptors([LoaderInterceptor, TokenInterceptor]),
    ),

    provideTranslateService({
      defaultLanguage: 'en',
    }),
    provideTranslateHttpLoader({
      prefix: './i18n/',
      suffix: '.json',
    }),
  ],
};
