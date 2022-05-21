import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FetchService } from './../../service/api/fetch.service';
import { Capacitor } from '@capacitor/core';
import { CapacitorVideoPlayer } from 'capacitor-video-player';

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
  constructor(public modalController: ModalController,private router: Router,private route: ActivatedRoute,private fetch: FetchService) { }

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = params.id;
      this.page = params.page;
    });
    const player: any = await this.setVideoPlayer();
    this.videoPlayer = player.plugin;
  }
  segmentChange(val) {
    this.seg_id = val;
  }
  ionViewWillEnter(){
    this.getCourseDetails(this.id);
  }
  getCourseDetails(id: any) {
    this.fetch.getCourseDetail(id).then((response) => {
      this.course = JSON.parse(response[0].data).response[0];
      this.sections = JSON.parse(response[1].data).response;
      this.durationName = this.course.duration.replace(/[0-9]/g, '');
    }).catch((error) => {
      
    });
  }
  setVideoPlayer = async (): Promise<any>=> {
    const platform = Capacitor.getPlatform();
    console.log(`platform ${platform}`);
    return {plugin:CapacitorVideoPlayer, platform};
  };

  async playYoutubeVideo(){
    //return this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/HdU_rf7eMTI?modestbranding=1&autoplay=0&showinfo=0&controls=0&rel=0")
    document.addEventListener('jeepCapVideoPlayerPlay', (e: CustomEvent) => { console.log('Event jeepCapVideoPlayerPlay ', e.detail) }, false);
    document.addEventListener('jeepCapVideoPlayerPause', (e: CustomEvent) => { console.log('Event jeepCapVideoPlayerPause ', e.detail) }, false);
    document.addEventListener('jeepCapVideoPlayerEnded', (e: CustomEvent) => { console.log('Event jeepCapVideoPlayerEnded ', e.detail) }, false);
    await this.videoPlayer.initPlayer({
      mode: 'fullscreen',
      url: "http://static.videogular.com/assets/videos/elephants-dream.mp4",
      playerId: 'fullscreen',
      componentTag: 'app-home'
    }); 
  }
 
  goBackHome(){
    this.router.navigate([this.page]);
  }
}

