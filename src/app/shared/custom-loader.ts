import {TranslateLoader} from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

export class CustomLoader implements TranslateLoader {
  constructor() {}
  getTranslation(langCountry: string): Observable<any> {
    //Condition satisfies upon page load. en.json is loaded.
    return fromFetch('./assets/i18n/'+langCountry+'.json');
  }
}
