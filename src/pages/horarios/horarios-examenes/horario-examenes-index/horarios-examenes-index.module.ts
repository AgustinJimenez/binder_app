import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HorariosExamenesIndexPage } from './horarios-examenes-index';

@NgModule({
  declarations: [
    HorariosExamenesIndexPage,
  ],
  imports: [
    IonicPageModule.forChild( HorariosExamenesIndexPage ),
  ],
})
export class HorariosExamenesIndexPageModule {}
