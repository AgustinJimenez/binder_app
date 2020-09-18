import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NoticiasIndexPage } from './noticias-index';

@NgModule({
  declarations: [
    NoticiasIndexPage,
  ],
  imports: [
    IonicPageModule.forChild(NoticiasIndexPage),
  ],
})
export class NoticiasIndexPageModule {}
