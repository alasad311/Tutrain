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
  maxDate = new Date(new Date().getTime() + 86400000).toISOString().slice(0, 10);
  isDisablied = false;
  isConfirmed = false;
  constructor(public modalController: ModalController) { }
  
  ngOnInit() {
    const time = new Date().getHours();
    this.datetime.hourValues = '15,16,17,18,19';
    if(time > 18)
    {
      const maxAntherDay = new Date(new Date().getTime() + (86400000*2)).toISOString().slice(0, 10);
      this.datetime.max = maxAntherDay;
      this.datetime.min = this.maxDate;
      this.datetime.value = this.maxDate+'T15:00:00.136Z';
    }else if(time < 15){
      this.datetime.max = this.maxDate;
      this.datetime.min = this.minDate;
      this.datetime.value = this.minDate+'T15:00:00.136Z';
    }else
    {
      this.datetime.max = this.maxDate;
      this.datetime.min = this.minDate;
      this.datetime.value = this.minDate+'T'+(time+1)+':00:00.136Z';
    }

  }
  async placeOrder(){
    //lets place the order.
    this.isDisablied = true;
    this.isConfirmed = true;
    const data = {
      confirm: this.isConfirmed,
      durationSelect: this.duration.value,
      datetimeSelect: this.datetime.value
    };
    this.modalController.dismiss(data);
  }
  goBackHome(){
    this.modalController.dismiss({confirm: this.isConfirmed});
  }
}
