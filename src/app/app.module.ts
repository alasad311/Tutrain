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

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(),IonicStorageModule.forRoot()
    , AppRoutingModule,FormsModule,ReactiveFormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },FileTransfer,Chooser,
    AuthGuardService ,HTTP,ScreenOrientation,AndroidFullScreen,StatusBar,InAppBrowser,AppVersion,FilePath],
  bootstrap: [AppComponent],
})
export class AppModule {}
