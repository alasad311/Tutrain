import { Component, OnInit, ViewChild } from '@angular/core';
import { IonDatetime } from '@ionic/angular';
@Component({
  selector: 'app-book-tutor',
  templateUrl: './book-tutor.page.html',
  styleUrls: ['./book-tutor.page.scss'],
})
export class BookTutorPage implements OnInit {
  @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;
  minDate = new Date().toISOString().slice(0, 10);
  maxDate = new Date(new Date().getTime() + 86400000).toISOString().slice(0, 10);
  constructor() { }
  ngOnInit() {
    let time = new Date().getHours();
    this.datetime.hourValues = "15,16,17,18,19";
    if(time > 18)
    {
      this.datetime.max = this.maxDate;
      this.datetime.min = this.maxDate;
      this.datetime.value = this.maxDate+"T15:00:00.136Z";
    }else
    {
      this.datetime.max = this.maxDate;
      this.datetime.min = this.minDate;
      this.datetime.value = this.maxDate+"T"+(time+1)+":00:00.136Z";
    }
    
  }

}
