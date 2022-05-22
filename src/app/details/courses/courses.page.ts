import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { AlertController, ModalController,IonRouterOutlet } from '@ionic/angular';
import { FetchService } from './../../service/api/fetch.service';
import { Capacitor } from '@capacitor/core';
import { CapacitorVideoPlayer } from 'capacitor-video-player';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { PaymentPage } from '../../payment/payment.page'
@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
})
export class CoursesPage implements OnInit {

  id: any;
  page: any;
  course: any;
  duration = [];
  seg_id = 1;
  videos: any;
  pictures: any;
  contents: any;
  durationName: any;
  sections: any;
  content: any;
  videoPlayer: any;
  paid: any;
  constructor(private routerOutlet: IonRouterOutlet,private screenOrientation: ScreenOrientation,public alertController: AlertController,public modalController: ModalController,private router: Router,private route: ActivatedRoute,private fetch: FetchService) { }

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = params.id;
      this.page = params.page;
    });
    const player: any = await this.setVideoPlayer();
    this.videoPlayer = player.plugin;
  }
  ionViewWillEnter(){
    this.getCourseDetails(this.id);
  }
  getCourseDetails(id: any) {
    this.fetch.getCourseDetail(id).then((response) => {
      this.course = JSON.parse(response[0].data).response[0];

      this.sections = JSON.parse(response[1].data).response;
      if(JSON.parse(response[2].data).response.length === 0)
        this.paid = false;
      else
        this.paid = true;
      
      this.durationName = this.course.duration.replace(/[0-9]/g, '');
    }).catch((error) => {
      
    });
  }
  setVideoPlayer = async (): Promise<any>=> {
    const platform = Capacitor.getPlatform();
    console.log(`platform ${platform}`);
    return {plugin:CapacitorVideoPlayer, platform};
  };
  private async playerReady(data: any): Promise<void> {
    this.screenOrientation.unlock();
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY);
    return;
  }
  private async playerPlay(data: any): Promise<void> {
    console.log(`Event jeepCapVideoPlayer ${data}`);
    return;
  }
  private async playerEnd(data: any): Promise<void> {
    this.screenOrientation.unlock();
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
    return;
  }
  private async playerExit(data: any): Promise<void> {
    this.screenOrientation.unlock();
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
    return;
  }
  private async playerPause(data: any): Promise<void> {
    console.log(`Event jeepCapVideoPlayerPause ${data}`);
    return;
}
  async playYoutubeVideo(url){
   
    await this.videoPlayer.addListener('jeepCapVideoPlayerPlay', (data: any) => this.playerPlay(data), false);
    await this.videoPlayer.addListener('jeepCapVideoPlayerPause', (data: any) => this.playerPause(data), false);
    await this.videoPlayer.addListener('jeepCapVideoPlayerEnded', (data: any) => this.playerEnd(data), false);
    await this.videoPlayer.addListener('jeepCapVideoPlayerExit', (data: any) => this.playerExit(data), false);
    await this.videoPlayer.addListener('jeepCapVideoPlayerReady', async (data: any) => this.playerReady(data), false);

    await this.videoPlayer.initPlayer({
      mode: 'fullscreen',
      url: url,
      playerId: 'fullscreen',
      componentTag: 'app-home'
    }).then(); 
  }
 
  goBackHome(){
    this.router.navigate([this.page]);
  }
  purchaseCourse(){
    this.alertMessage("Purchase","Are you sure you want to buy "+this.course.name);
  }
  async showPaymentPage() {
    const modal = await this.modalController.create({
      component: PaymentPage,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        'course': this.course,
      }
    });
    return await modal.present();
  }
  async alertMessage(header,message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      message: message,
      buttons: [
        {
          text: 'ok',
          id: 'confirm-button',
          handler: () => {
            this.showPaymentPage()
          }
        },{
          text: 'Cancel',
          id: 'cancel-button',
          handler: () => {
            
          }
        }
      ]
    });

    await alert.present();
  }
}

