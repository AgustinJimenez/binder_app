import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PerfilUsuarioShowPage } from './perfil-usuario-show';

@NgModule({
  declarations: [
    PerfilUsuarioShowPage,
  ],
  imports: [
    IonicPageModule.forChild(PerfilUsuarioShowPage),
  ],
})
export class PerfilUsuarioShowPageModule {}
