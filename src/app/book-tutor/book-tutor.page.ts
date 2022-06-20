import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonDatetime, IonSelect, ModalController } from '@ionic/angular';
@Component({
  selector: 'app-book-tutor',
  templateUrl: './book-tutor.page.html',
  styleUrls: ['./book-tutor.page.scss'],
})
export class BookTutorPage implements OnInit {
  @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;
  @ViewChild(IonSelect) duration: IonSelect;
  @Input() tutorName: any;
  minDate = new Date().toISOString().slice(0, 10);
  maxDate = new Date(new Date().getTime() + (86400000*2)).toISOString().slice(0, 10);
  isDisablied = false;
  isConfirmed = false;
  constructor(public modalController: ModalController) { }
  
  ngOnInit() {
    const time = new Date().getHours()+2;
    const dateToChange = new Date(new Date().getTime()).toISOString().slice(0, 10);
    // this.datetime.hourValues = '15,16,17,18,19';
    
    this.datetime.value = dateToChange+'T'+time+':00:00.136Z';
    this.datetime.hourValues = '0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24';
    this.datetime.max = this.maxDate;
    this.datetime.min = this.minDate;
  }
  async placeOrder(){
    //lets place the order.
    this.isDisablied = true;
    this.isConfirmed = true;
    const data = {
      confirm: this.isConfirmed,
      durationSelect: this.duration.value,
      datetimeSelect: this.datetime.value,
    };
    this.modalController.dismiss(data);
  }
  goBackHome(){
    this.modalController.dismiss({confirm: this.isConfirmed});
  }
}
