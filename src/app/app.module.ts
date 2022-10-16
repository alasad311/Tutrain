import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AuthGuardService } from './service/Auth/auth-guard.service';
import { AndroidFullScreen } from '@awesome-cordova-plugins/android-full-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
import { Chooser } from '@awesome-cordova-plugins/chooser/ngx';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { VideoEditor } from '@awesome-cordova-plugins/video-editor/ngx';
import { Globalization } from '@awesome-cordova-plugins/globalization/ngx';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CustomLoader } from './shared/custom-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,HttpClientModule, IonicModule.forRoot(),IonicStorageModule.forRoot()
    , AppRoutingModule,FormsModule,ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },FileTransfer,Chooser,
    AuthGuardService ,HTTP,ScreenOrientation,AndroidFullScreen,StatusBar,InAppBrowser,AppVersion,FilePath,VideoEditor,Globalization],
  bootstrap: [AppComponent],
})
export class AppModule {}
