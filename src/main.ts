import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: 'https://411ba6a95316493a8ca61fc82c74381c@o4508425871097856.ingest.de.sentry.io/4508425874833488',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1,
  replaysSessionSampleRate: 0.1, 
  replaysOnErrorSampleRate: 1.0,
});

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
