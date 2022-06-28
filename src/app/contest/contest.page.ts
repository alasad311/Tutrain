import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilService } from '../service/util.service';

@Component({
  selector: 'app-contest',
  templateUrl: './contest.page.html',
  styleUrls: ['./contest.page.scss'],
})
export class ContestPage implements OnInit {

  constructor(private navCtrl: NavController,public util: UtilService) { }

  ngOnInit() {
  }
  goBackHome(){
    this.navCtrl.back();
  }
}
