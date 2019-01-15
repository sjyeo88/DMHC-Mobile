import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssignTodayPage } from './assign-today';

@NgModule({
  declarations: [
    AssignTodayPage,
  ],
  imports: [
    IonicPageModule.forChild(AssignTodayPage),
  ],
})
export class AssignTodayPageModule {}
