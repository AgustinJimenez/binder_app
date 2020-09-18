import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AvisoIndexPage } from './aviso-index';

@NgModule({
  declarations: [
    AvisoIndexPage,
  ],
  imports: [
    IonicPageModule.forChild(AvisoIndexPage),
  ],
})
export class AvisoIndexPageModule {}
