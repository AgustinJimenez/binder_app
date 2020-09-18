import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SeleccionColegioPage } from './seleccion-colegio';

@NgModule({
  declarations: [
    SeleccionColegioPage,
  ],
  imports: [
    IonicPageModule.forChild(SeleccionColegioPage),
  ],
})
export class SeleccionColegioPageModule {}
