import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FetchService } from '../service/api/fetch.service';
import { StorageService } from '../service/storage/storage.service';
import { UtilService } from '../service/util.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage implements OnInit {
  subs: any;
  slideOpts = {
    speed: 500,
    loop: false,
    slidesPerView: 2.3,
    slidesToScroll: 1,
    initialSlide: 2,
    swipeToSlide: true,
    centeredSlides: true,
    // autoplay: true,
  };
  constructor(private navCtrl: NavController,public util: UtilService,private storage: StorageService,private fetch: FetchService) { }

  async ngOnInit() {
   this.fetch.getSubscriptions().then((response) => {
    this.subs = JSON.parse(response.data).response;
  });

  }
  goBackHome(){
    this.navCtrl.back();
  }
}
