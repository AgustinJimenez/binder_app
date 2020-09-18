import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NoticiasDetallesPage } from './noticias-detalles';

@NgModule({
  declarations: [
    NoticiasDetallesPage,
  ],
  imports: [
    IonicPageModule.forChild(NoticiasDetallesPage),
  ],
})
export class NoticiasDetallesPageModule {}
