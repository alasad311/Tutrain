import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,NavigationExtras,Router } from '@angular/router';
import { AlertController, IonRouterOutlet, LoadingController, ModalController, NavController } from '@ionic/angular';
import { FetchService } from 'src/app/service/api/fetch.service';
import { ReportUserPage } from '../../report-user/report-user.page';
import { BookTutorPage } from '../../book-tutor/book-tutor.page';
import { StorageService } from 'src/app/service/storage/storage.service';
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
  constructor(private storage: StorageService,public loadingController: LoadingController,private router: Router,public modalController: ModalController,private routerOutlet: IonRouterOutlet,
    private route: ActivatedRoute,private nav: NavController,private fetch: FetchService,public alertController: AlertController,
    ) { }

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
        tutorID: this.id,
        tutorName: this.user.fullname,
      }
    });
    modal.onDidDismiss()
    .then((data) => {
       const response = data.data.isReported; // Here's your selected user!
      if(response === true)
      {
        this.alertMessage('Report','You have successfully reported '+ this.user.fullname);
      }else
      {
        this.alertMessage('Report','An error occured while reporting tutor please try again later');
      }
    });
    await modal.present();
  }
  async alertMessage(header,message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
  async bookTutor(){
    //lets add the order to the DB
    const modal = await this.modalController.create({
      component: BookTutorPage,
      initialBreakpoint: 0.7,
      breakpoints: [0, 0.7, 1],
      presentingElement: await this.modalController.getTop(),
      componentProps: {
        tutorName: this.user.fullname,
      }
    });
    modal.onDidDismiss()
    .then(async (data) => {
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Please wait...'
      });
      await loading.present();
      const loginUser = await this.storage.get('user');
      const date = new Date(data.data.datetimeSelect);
      let hour = date.getUTCHours();
      let min = date.getUTCMinutes().toString().padStart(2, '0');
      let yourDate = new Date(date.getTime() + (1000 * 60 * 60 * data.data.durationSelect));
      const datas = {
        user_id: loginUser.user_id,
        tutor_id : this.user.user_id,
        duration : data.data.durationSelect,
        slot: date.getFullYear() + "-" + (1 + date.getMonth()).toString().padStart(2, '0') + "-"+date.getDate().toString().padStart(2, '0'),
        timefrom:  hour + ":" + min,
        timeto: yourDate.getUTCHours() + ":" + min
      };
      this.fetch.createSlot(datas).then(async (response) => {
        const json = JSON.parse(response.data).response;
        if(json.id){
          await loading.dismiss();
          this.alertMessage("Booking","Your request is under review by "+ this.user.fullname);
        }else if(json.results === "duplicate"){
          await loading.dismiss();
          this.alertMessage("Duplicate","You have already requested and its under review.");
        }else{
          await loading.dismiss();
          this.alertMessage("Error","Couldn't fullfill your request at the moment please try again later");
        }
      });
    });
    await modal.present();
  } 
}
