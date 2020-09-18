import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { HTTP } from '@ionic-native/http';
import { RoutesProvider } from "./../../providers/config/routes";
import { ToastProvider } from "./../../providers/config/toasts";
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { SeleccionColegioPage } from "../seleccion-colegio/seleccion-colegio";

@IonicPage()
@Component({
  selector: 'page-contacto',
  templateUrl: 'contacto.html',
})
export class ContactoPage 
{

  @ViewChild('nombreInput') nombre_input

  private contact_form : FormGroup;
  private response: any;
  private loading: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,

    private native_http: HTTP,
    public routes: RoutesProvider,
    public toasts: ToastProvider,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController
  ) 
  {
    this.init();

  }

  init()
  {
    this.set_variables();
  }
  set_variables()
  {
    this.contact_form = this.formBuilder.group
    ({
      nombre: ['', Validators.required],
      institucion: ['', Validators.required],
      email: ['', Validators.compose([ Validators.required, Validators.email ])],
      numero: ['', Validators.required]
    });
  }

  init_focus()
	{

    setTimeout(() => {
      this.nombre_input.setFocus();
    }, 2500);

  }

  enviar()
  {
    //console.log( "ENVIANDO==>", this.contact_form.value );
    this.loading = this.loadingCtrl.create();

    this.loading.present();

    if( this.routes.debug )
      console.log("SENDING===>", this.contact_form.value);

    this.native_http.post( this.routes.contacto_url , this.contact_form.value, this.routes.header )
    .then(res =>
    {
      this.response = JSON.parse(res.data);

      if( this.routes.debug )
        console.log('RESPONSE===>', this.response );

      this.loading.dismiss();

      if ( this.response.error )
        this.toasts.show_message( this.response.message );
      else
        this.navCtrl.setRoot( SeleccionColegioPage, { show_message: { title: 'Mensaje Enviado.', message: 'Su mensaje ha sido enviado. Nos pondremos en contacto en la brevedad.' } } );

        

    })
    .catch(err =>
    {
      this.loading.dismiss();
      this.toasts.show_message('no_server_available');

      if( this.routes.debug )
        console.log("ERROR: ", err, err.error);

    });


  }

}
