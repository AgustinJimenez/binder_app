import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

/*PAGES */
import { LoginPage } from '../pages/auth/login/login';
import { RegistrarsePage } from '../pages/auth/registrarse/registrarse';
import { HomePage } from '../pages/home/home';
import { ForgotPasswordPage } from '../pages/auth/forgot-password/forgot-password';
import { PerfilUsuarioShowPage } from '../pages/perfil-usuario/show/perfil-usuario-show';
import { PerfilUsuarioEditPage } from '../pages/perfil-usuario/edit/perfil-usuario-edit';
import { AvisoIndexPage } from './../pages/avisos/aviso-index/aviso-index';
import { AvisoDetallesPage } from './../pages/avisos/aviso-detalles/aviso-detalles';
import { NoticiasIndexPage } from './../pages/noticias/noticias-index/noticias-index';
import { NoticiasDetallesPage } from './../pages/noticias/noticias-detalles/noticias-detalles';
import { SeleccionColegioPage } from '../pages/seleccion-colegio/seleccion-colegio';
import { HorariosClasesIndexPage } from './../pages/horarios/horarios-clases/horario-clases-index/horarios-clases-index';
import { HorariosExamenesIndexPage } from './../pages/horarios/horarios-examenes/horario-examenes-index/horarios-examenes-index';
import { ContactoPage } from '../pages/contacto/contacto';
import { HorariosExamenesDetallePage } from './../pages/horarios/horarios-examenes/horario-examenes-detalles/horarios-examenes-detalle';
import { HorariosClasesDetallePage } from './../pages/horarios/horarios-clases/horarios-clases-detalle/horarios-clases-detalle';
/*PROVIDERS */
import { RoutesProvider } from '../providers/config/routes';
import { ToastProvider } from "../providers/config/toasts";
import { ParserProvider } from '../providers/parser';
import { CustomDeviceProvider } from '../providers/device';


/* PLUGINS */
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { HTTP } from '@ionic-native/http';
import { Device } from '@ionic-native/device';
import { FCM } from '@ionic-native/fcm';
import { AppPreferences } from '@ionic-native/app-preferences';

/*COMPONENT*/
import { NavbarComponent } from '../components/navbar/navbar';


@NgModule({
  declarations:
  [
    MyApp,

    LoginPage,
    RegistrarsePage,
    HomePage,
    NavbarComponent,
    ForgotPasswordPage,
    PerfilUsuarioShowPage,
    PerfilUsuarioEditPage,
    AvisoIndexPage,
    AvisoDetallesPage,
    NoticiasIndexPage,
    NoticiasDetallesPage,
    SeleccionColegioPage,
    HorariosClasesIndexPage,
    HorariosExamenesIndexPage,
    ContactoPage,
    HorariosExamenesDetallePage,
    HorariosClasesDetallePage

  ],
  imports:
  [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents:
  [
    MyApp,

    LoginPage,
    RegistrarsePage,
    HomePage,
    ForgotPasswordPage,
    PerfilUsuarioShowPage,
    PerfilUsuarioEditPage,
    AvisoIndexPage,
    AvisoDetallesPage,
    NoticiasIndexPage,
    NoticiasDetallesPage,
    SeleccionColegioPage,
    HorariosClasesIndexPage,
    HorariosExamenesIndexPage,
    ContactoPage,
    HorariosExamenesDetallePage,
    HorariosClasesDetallePage

  ],
  providers:
  [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},

    RoutesProvider,
    Keyboard,
    ToastProvider,
    HTTP,
    Device,
    FCM,
    AppPreferences,
    ParserProvider,
    CustomDeviceProvider

  ]
})
export class AppModule {}
