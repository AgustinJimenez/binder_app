import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PerfilUsuarioEditPage } from './perfil-usuario-edit';

@NgModule({
  declarations: [
    PerfilUsuarioEditPage,
  ],
  imports: [
    IonicPageModule.forChild(PerfilUsuarioEditPage),
  ],
})
export class PerfilUsuarioEditPageModule {}
