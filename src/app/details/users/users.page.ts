import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,NavigationExtras,Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FetchService } from 'src/app/service/api/fetch.service';
@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  id: any;
  page: any;
  courseID: any;
  user: any;
  constructor(private router: Router,private route: ActivatedRoute,private nav: NavController,private fetch: FetchService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = params.id;
      this.page = params.page;
      if(params.courseid)
      {
        this.courseID = params.courseid;
      }
  });
  }
  ionViewWillEnter(){
    this.getUserDetails(this.id);
  }
  getUserDetails(id)
  {
    this.user = null;
    this.fetch.getUserDetailByID(id).then((response) => {
      this.user = JSON.parse(response.data).response[0];

    }).catch((error) => {
      
    });
  }
  goBackHome(){
    console.log(this.courseID);
    if(this.courseID)
    {
      const navigationExtras: NavigationExtras = {
        queryParams: {
            page: '/search',
            id:this.courseID
        }
      };
      this.nav.navigateForward('/details/courses',navigationExtras);
    }else{
      this.router.navigate([this.page]);
    }
  }

}
