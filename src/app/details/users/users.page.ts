import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,NavigationExtras,Router } from '@angular/router';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  id: any;
  page: any;
  courseID: any;
  constructor(private router: Router,private route: ActivatedRoute,private nav: NavController) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = params.id;
      this.page = params.page;
      if(params.courseid.length !== 0)
      {
        this.courseID = params.courseid;
      }
  });
  }
  goBackHome(){
    if(this.courseID.length !== 0)
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
