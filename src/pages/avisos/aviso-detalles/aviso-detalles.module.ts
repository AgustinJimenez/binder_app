import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AvisoDetallesPage } from './aviso-detalles';

@NgModule({
  declarations: [
    AvisoDetallesPage,
  ],
  imports: [
    IonicPageModule.forChild(AvisoDetallesPage),
  ],
})
export class AvisoDetallesPageModule {}
