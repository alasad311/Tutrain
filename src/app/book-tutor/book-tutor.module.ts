import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookTutorPageRoutingModule } from './book-tutor-routing.module';

import { BookTutorPage } from './book-tutor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookTutorPageRoutingModule
  ],
  declarations: [BookTutorPage]
})
export class BookTutorPageModule {}
