import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { FetchService } from '../service/api/fetch.service';
import { StorageService } from '../service/storage/storage.service';

@Component({
  selector: 'app-report-user',
  templateUrl: './report-user.page.html',
  styleUrls: ['./report-user.page.scss'],
})
export class ReportUserPage implements OnInit {
  @Input() tutorID: any;
  @Input() tutorName: any;
  feedback: any;
  isDisablied = false;
  constructor(public alertController: AlertController,private storage: StorageService,public modalController: ModalController,public fetchServices: FetchService,public loadingController: LoadingController) { }
  
  ngOnInit() {
  }
  async submitReport(){
    //begin by evaluating data.
    if(this.feedback.length > 10)
    {
      const user = await this.storage.get('user');
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Please wait...',
      });
      await loading.present();
      this.isDisablied = true;
      //lets start sending data
      const data = {
        user_id: user.user_id,
        tutor_id : this.tutorID,
        feedback : this.feedback,
      };
      this.fetchServices.submitReport(data).then(async (response) => {
        const json = JSON.parse(response.data).response;
        await loading.dismiss();
        if(json.id){
          this.modalController.dismiss({isReported:true});
        }

      }).catch((error) => {
        this.isDisablied = false;
      });
      
    }else{
      this.alertMessage("Error","Your feedback is less than 10 characters")
    }

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
}
