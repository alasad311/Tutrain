import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { FetchService } from './../../service/api/fetch.service';

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
  constructor(private router: Router,private route: ActivatedRoute,private fetch: FetchService) { }

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
      var json = JSON.parse(response.data);
      this.course = json.response[0]
      for(var x=1; x<=this.course.duration.match(/\d+/); x++)
      {
        this.duration.push(x);
      }
      this.durationName = this.course.duration.replace(/[0-9]/g, '');
    }).catch((error) => {
      
    });
  }
  goBackHome(){
    this.router.navigate([this.page]);
  }
}

