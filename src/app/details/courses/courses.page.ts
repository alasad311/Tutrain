import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { FetchService } from './../../service/api/fetch.service';
import { YoutubeVideoPlayer } from '@awesome-cordova-plugins/youtube-video-player/ngx';
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
  constructor(private youtube: YoutubeVideoPlayer,private router: Router,private route: ActivatedRoute,private fetch: FetchService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = params.id;
      this.page = params.page;
    });
    
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
  parser(url){
    const urlObject = new URL(url);
    let urlOrigin = urlObject.origin;
    let urlPath = urlObject.pathname;

    if (urlOrigin.search('youtu.be') > -1) {
        return urlPath.substr(1);
    }

    if (urlPath.search('embed') > -1) {
        // Örneğin "/embed/wCCSEol8oSc" ise "wCCSEol8oSc" return eder.
        return urlPath.substr(7);
    }

    
    return urlObject.searchParams.get('v');
  }
  playYoutubeVideo(id){
    this.youtube.openVideo(id);
  }
  goBackHome(){
    this.router.navigate([this.page]);
  }
}

