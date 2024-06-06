import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import 'feather-icons';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
