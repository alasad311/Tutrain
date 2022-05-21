import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {DomSanitizer} from '@angular/platform-browser';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.page.html',
  styleUrls: ['./video-player.page.scss'],
})
export class VideoPlayerPage implements OnInit {
  url :any;
  videoPlayer: any;
  constructor(public modalController: ModalController,public  sanitizer:DomSanitizer,private screenOrientation: ScreenOrientation) { }
  ionViewWillEnter(){
    this.screenOrientation.unlock();
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY);
  }
  ionViewWillLeave(){
    this.screenOrientation.unlock();
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
  }

  ngOnInit() {
  }
  dismiss() {
    this.modalController.dismiss();
  }

}
