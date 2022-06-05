import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,NavigationExtras,Router } from '@angular/router';
import { AlertController, IonRouterOutlet, ModalController, NavController } from '@ionic/angular';
import { FetchService } from 'src/app/service/api/fetch.service';
import { ReportUserPage } from '../../report-user/report-user.page'
import { BookTutorPage } from "../../book-tutor/book-tutor.page"
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
  constructor(private router: Router,private routerOutlet: IonRouterOutlet,public modalController: ModalController,private route: ActivatedRoute,private nav: NavController,private fetch: FetchService,public alertController: AlertController) { }

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
  async reportTutor(){
    //lets add the report to the DB
    const modal = await this.modalController.create({
      component: ReportUserPage,
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.5, 1],
      presentingElement: await this.modalController.getTop(),
      componentProps: {
        'tutorID': this.id,
        'tutorName': this.user.fullname,
      }
    });
    modal.onDidDismiss()
    .then((data) => {
       const response = data.data.isReported; // Here's your selected user!
      if(response === true)
      {
        this.alertMessage("Report","You have successfully reported "+ this.user.fullname);
      }else
      {
        this.alertMessage("Report","An error occured while reporting tutor please try again later");
      }
    });
    await modal.present();
  }
  async alertMessage(header,message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
  async bookTutor(){
    //lets add the report to the DB
    const modal = await this.modalController.create({
      component: BookTutorPage,
      initialBreakpoint: 0.6,
      breakpoints: [0, 0.6, 1],
      presentingElement: await this.modalController.getTop(),
      componentProps: {
        'tutorID': this.id,
        'tutorName': this.user.fullname,
      }
    });
    modal.onDidDismiss()
    .then((data) => {
       const response = data.data.isReported; // Here's your selected user!
      if(response === true)
      {
        this.alertMessage("Report","You have successfully reported "+ this.user.fullname);
      }else
      {
        this.alertMessage("Report","An error occured while reporting tutor please try again later");
      }
    });
    await modal.present();
  }
}
