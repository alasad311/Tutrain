import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './service/storage/storage.service';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import {  MenuController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { FetchService } from "./service/api/fetch.service"
import { EventService } from "./service/event.service"
import { App as CapacitorApp } from '@capacitor/app';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  
})
export class AppComponent {
  user:any;
  email:any;
  subscriptions: any;

  constructor( private fetch:FetchService, private event:EventService, private platform:Platform,private router: Router,public menuCtrl: MenuController, private screenOrientation: ScreenOrientation, private storage : StorageService) {
    this.initializeApp();
    this.test2();
   }
   async test2(): Promise<void> {
    await this.platform.ready();
    CapacitorApp.addListener('backButton', ({canGoBack}) => {
     
    });
  }

  async initializeApp() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    this.event.getObservable().subscribe((data) => {
      this.user = data;
    });

    await this.storage.init();
    this.email = await this.storage.get("email");
     
    this.platform.ready().then((readySource) => {
      
      if (this.email) {
        this.menuCtrl.enable(true);
        this.router.navigate(['home']);
        this.fetch.getUser(this.email).then((response) => {
          var json = JSON.parse(response.data);
          this.user = json.response
        }).catch((error) => {
          
        });

      } else {
        this.menuCtrl.enable(false);
        this.router.navigate(['welcome']);
      }
    });
  }
  set userDetails(user){
    this.user = user;
  }
  get userEmail(){
    return this.email
  }
  async logout(){
    await this.storage.clear()
    this.router.navigate(['/welcome']);
  }
}
