import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HorariosClasesIndexPage } from './horarios-clases-index';

@NgModule({
  declarations: [
    HorariosClasesIndexPage,
  ],
  imports: [
    IonicPageModule.forChild( HorariosClasesIndexPage ),
  ],
})
export class HorariosClasesIndexPageModule {}
