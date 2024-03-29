import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,NavigationExtras,Router } from '@angular/router';
import { AlertController, ModalController,IonRouterOutlet, NavController } from '@ionic/angular';
import { FetchService } from './../../service/api/fetch.service';
import { Capacitor } from '@capacitor/core';
import { CapacitorVideoPlayer } from 'capacitor-video-player';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { PaymentPage } from '../../payment/payment.page'
import { UtilService } from 'src/app/service/util.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
})
export class CoursesPage implements OnInit {
  contest: any;
  contestBadge: any;
  id: any;
  page: any;
  course: any;
  duration = [];
  videos: any;
  pictures: any;
  contents: any;
  durationName: any;
  sections: any;
  content: any;
  videoPlayer: any;
  paid: any;
  trailer: any;
  constructor(private routerOutlet: IonRouterOutlet,private screenOrientation: ScreenOrientation,public alertController: AlertController,
    public modalController: ModalController,private router: Router,private route: ActivatedRoute,private fetch: FetchService,
    private nav: NavController,public util: UtilService,public translate: TranslateService) { }

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
  ionViewDidEnter() {
    this.util.refreshUserData();
    this.util.checkContest().then((response) => {
      this.contest = response;
      if(this.contest)
      {
        this.contestBadge = 1;
      }
    });

  }
  ionViewDidLeave() {
    this.util.refreshUserData();
  }
  goToUser(){
    const navigationExtras: NavigationExtras = {
      queryParams: {
          page: '/details/courses/',
          id: this.course.user_id,
          courseid:this.id
      }
    };
    this.nav.navigateForward('/details/users',navigationExtras);
  }
  getCourseDetails(id: any) {
    this.course = null;
    this.sections = null;
    this.fetch.getCourseDetail(id).then((response) => {
      this.course = JSON.parse(response[0].data).response[0];
      this.sections = JSON.parse(response[1].data).response;
      if(JSON.parse(response[2].data).response.length === 0){
          this.paid = false;
      }else{
        this.paid = true;
      }
      this.trailer = JSON.parse(response[3].data).response[0];
      this.durationName = this.course.duration.replace(/[0-9]/g, '');
    }).catch((error) => {});
  }
  setVideoPlayer = async (): Promise<any>=> {
    const platform = Capacitor.getPlatform();
    return {plugin:CapacitorVideoPlayer, platform};
  };
  private async playerReady(data: any): Promise<void> {
    this.screenOrientation.unlock();
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY);
    return;
  }
  private async playerPlay(data: any): Promise<void> {
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
    this.nav.back();
  }
  purchaseCourse(){
    this.alertMessage(this.translate.instant('messages.purchase'),
    this.translate.instant('messages.areyousurebuy')+this.course.name);
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
    modal.onDidDismiss()
    .then((data) => {
       const response = data.data.dismissed; // Here's your selected user!
      if(response === true)
      {
        this.getCourseDetails(this.id);
      }else
      {

      }
    });
    await modal.present();

  }
  async alertMessage(header,message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      message: message,
      buttons: [
        {
          text: this.translate.instant('messages.ok'),
          id: 'confirm-button',
          handler: () => {
            this.showPaymentPage()
          }
        },{
          text: this.translate.instant('messages.cancel'),
          id: 'cancel-button',
          handler: () => {
            
          }
        }
      ]
    });

    await alert.present();
  }
 
}

