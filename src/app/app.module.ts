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
import { AuthGuardService } from './service/Auth/auth-guard.service'
import { AndroidFullScreen } from '@awesome-cordova-plugins/android-full-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { YoutubeVideoPlayer } from '@awesome-cordova-plugins/youtube-video-player/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(),IonicStorageModule.forRoot()
    , AppRoutingModule,FormsModule,ReactiveFormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },AuthGuardService ,HTTP,ScreenOrientation,AndroidFullScreen,StatusBar,YoutubeVideoPlayer],
  bootstrap: [AppComponent],
})
export class AppModule {}
