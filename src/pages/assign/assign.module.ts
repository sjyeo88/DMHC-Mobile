import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssignPage } from './assign';
import { PdfViewerModule } from 'ng2-pdf-viewer'
import { EmojiPickerModule } from '@ionic-tools/emoji-picker'
import { DirectivesModule } from '../../directives/directives.module'

@NgModule({
  declarations: [
    AssignPage,
  ],
  imports: [
    IonicPageModule.forChild(AssignPage),
    EmojiPickerModule.forRoot(),
    DirectivesModule, 
    PdfViewerModule,
  ],
})
export class AssignPageModule {}
