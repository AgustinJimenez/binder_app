import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HorariosClasesDetallePage } from './horarios-clases-detalle';

@NgModule({
  declarations: [
    HorariosClasesDetallePage,
  ],
  imports: [
    IonicPageModule.forChild(HorariosClasesDetallePage),
  ],
})
export class HorariosClasesDetallePageModule {}
