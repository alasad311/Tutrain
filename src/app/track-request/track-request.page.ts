import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FetchService } from '../service/api/fetch.service';
import { StorageService } from '../service/storage/storage.service';

@Component({
  selector: 'app-track-request',
  templateUrl: './track-request.page.html',
  styleUrls: ['./track-request.page.scss'],
})
export class TrackRequestPage implements OnInit {
  requests: any;
  user: any;
  showNull = false;
  page = 0;
  tutor = false;
  student = false;
  constructor(private navCtrl: NavController,private storage: StorageService,private fetch: FetchService) { }
  
  async ngOnInit() {
    this.user = await this.storage.get('user');

    if(this.user.type == 'student')
    {
      this.student = true;
      this.tutor = false;
    }else {
      this.tutor = true;
      this.student = false;
    }

    this.fetch.getUserRequests(this.user.user_id,this.page).then(async (response) => {
      this.requests = JSON.parse(response.data).response;
      if(this.requests.length == 0)
      {
        this.showNull = true;
      }
    });
  }
  getActualDate(date)
  {
    const newdate = new Date(date);
      return newdate.getDate().toString().padStart(2, '0') + '/' +
      (1 + newdate.getMonth()).toString().padStart(2, '0') + '/' + newdate.getFullYear();
  }
  goBackHome(){
    this.navCtrl.back();
  }
  doInfinite(event) {
    setTimeout(() => {
      this.page = this.page + 1;
      this.fetch.getUserRequests(this.user.user_id,this.page).then((response) => {
        var json = JSON.parse(response.data);
        for (let i = 0; i < json.response.length; i++) {
          this.requests.push(json.response[i])
        }
        if(json.response.length == 0)
          event.target.disabled = true;
        event.target.complete();
      }).catch((error) => {
        
      });
    }, 2000);
  }

}
