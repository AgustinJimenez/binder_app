import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { AppPreferences } from '@ionic-native/app-preferences';
import { ToastProvider } from "./../../providers/config/toasts";
import { RoutesProvider } from "./../../providers/config/routes";
import { LoginPage } from "../auth/login/login";
import { StatusBar } from '@ionic-native/status-bar';
import { ContactoPage } from '../contacto/contacto';
import { Keyboard } from '@ionic-native/keyboard';

@IonicPage()
@Component({
  selector: 'page-seleccion-colegio',
  templateUrl: 'seleccion-colegio.html',
})
export class SeleccionColegioPage
{
  public show_contacto_button: boolean = true;
  public nombre: string = '';
  public params: any;
  public url: string;
  public response: any;
  public colegios: Array<any> = [];
  public searched: boolean = false;
  public colegio_token: string;
  public show_loading_spinner: boolean = false;
  constructor
  (
    public navCtrl: NavController,
    public navParams: NavParams,
    private native_http: HTTP,
    public toasts: ToastProvider,
    public routes: RoutesProvider,
    public statusBar: StatusBar,
    private appPreferences: AppPreferences,
    public alertCtrl: AlertController,
    public keyboard: Keyboard

  )
  {
    this.init();
  }

  check_message_to_show()
  {
    let show_message = this.navParams.get('show_message');
    if( show_message != undefined && show_message != null )
      this.show_alert( show_message.title, show_message.message );
  }

  show_alert( title = '', message = '' )
  {
    this.alertCtrl.create
    ({
      title: title,
      message: message,
      buttons:
      [{
          text: 'Cerrar',
          role: 'cancel',
          handler: () => {}
      }]
    })
    .present();
  }

  init()
  {
    this.check_message_to_show();
    this.set_variables();
    this.keyboard.onKeyboardShow().subscribe( () => { this.show_contacto_button = false; } );
    this.keyboard.onKeyboardHide().subscribe( () => { this.show_contacto_button = true;} );
    //iOS note: you must call StatusBar.overlaysWebView(false) to enable color changing.
    // let status bar overlay webview
    // this.statusBar.overlaysWebView(false);
    //
    // this.statusBar.backgroundColorByHexString(primaryhex);

  }

  set_variables()
  {
    this.url = this.routes.seleccion_colegio;
  }

  search_colegios( cancel = false )
  {
    if( this.nombre.length == 0 )
    {
      this.colegios = [];
      this.searched = false;
    }
    else
    {
      this.params = { nombre: this.nombre };
      this.get_colegios();
    }
  }

  colegio_was_clicked( token )
  {
    this.colegio_token = token;
    //this.store_colegio_token();
    this.go_to_login_page();
  }

  contacto_was_clicked()
  {
    this.go_to_contacto_page();
  }

  store_colegio_token()
  {
    this.appPreferences.store('app', 'token', this.colegio_token);
  }

  go_to_login_page()
  {
    this.navCtrl.push( LoginPage, { colegio_token: this.colegio_token } );
  }

  go_to_contacto_page()
  {
    this.navCtrl.push( ContactoPage );
  }

  get_colegios()
  {
    this.show_loading_spinner = true;

    if( this.routes.debug )
      console.log("SENDING==>", this.url, this.params );

    this.native_http.get( this.url , this.params, this.routes.header )
    .then(res =>
    {
      this.searched = true;
      this.show_loading_spinner = false;
      this.response = JSON.parse(res.data);
      
      if( this.routes.debug )
        console.log('GETTING===>', this.response );
      
      if ( this.response.error )
        this.toasts.show_message( this.response.message );
      else
      {
        this.colegios = [];
        //this.colegios = this.response.data.colegios;
        for (let colegio of this.response.data.colegios )
          this.colegios.push( colegio );
      }

    })
    .catch(err =>
    {
      this.show_loading_spinner = false;
      this.searched = true;
      this.toasts.show_message('no_server_available');

      if( this.routes.debug )
        console.log("ERROR: ", err, err.error);

    });
  }

}
