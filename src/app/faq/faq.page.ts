import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }
  onClick(id)
  {
    if(document.getElementById(id).classList.contains('hide'))
    {
      document.getElementById(id).classList.remove('hide');
      document.getElementById(id).classList.add('show');
    }else{
      document.getElementById(id).classList.add('hide');
      document.getElementById(id).classList.remove('show');
    }
  }
  goBackHome(){
    this.navCtrl.back();
  }
}