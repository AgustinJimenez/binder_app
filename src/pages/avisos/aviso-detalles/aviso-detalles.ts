import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { RoutesProvider } from "./../../../providers/config/routes";
import { ToastProvider } from "./../../../providers/config/toasts";
import { Events } from 'ionic-angular';
import { AppPreferences } from '@ionic-native/app-preferences';

@IonicPage()
@Component({
  selector: 'page-aviso-detalles',
  templateUrl: 'aviso-detalles.html',
})
export class AvisoDetallesPage
{
  public aviso_id: string;
  public aviso: { id: number, titulo: string, fecha: string, contenido: string, grado_nombre: string, firma: string, archivo: any }
    = { id: null, titulo: '', fecha: '', contenido: '', grado_nombre:'', firma: '', archivo: null };
  public response: any;
  public user: any;
  public leido:boolean = false;
  public params_for_create_visto: any;
  public responsable_access_token:string = '';
  public params:any;
  public colegio_token: string;

  constructor
  (
    public navCtrl: NavController,
    public navParams: NavParams,
    private native_http: HTTP,
    public routes: RoutesProvider,
    public toasts: ToastProvider,
    public loadingCtrl: LoadingController,
    private appPreferences: AppPreferences,
    public events: Events
  )
  {
    this.init();
  }

  init()
  {
    this.fetch_colegio_token();
  }

  fetch_colegio_token()
  {
    this.appPreferences.fetch('app', 'colegio_token').then( (colegio_token) =>
    {

      //console.log("here access token from app preference =====>"+responsable_access_token );
      if(colegio_token != null || colegio_token != '' || colegio_token != undefined)
        this.colegio_token = colegio_token;
      
        this.fetch_access_data();
      
    });
  }

  fetch_access_data()
  {
    this.appPreferences.fetch('app', 'responsable_access_token').then( (responsable_access_token) =>
    {

      //console.log("here access token from app preference =====>"+responsable_access_token );
      if(responsable_access_token != null || responsable_access_token != '' || responsable_access_token != undefined)
        this.responsable_access_token = responsable_access_token;
      
        this.set_params();
      
    });
  }

  set_params()
  {

    this.params = 
    {
      aviso_id: this.navParams.get('aviso_id'),
      seccion_id: this.navParams.get('seccion_id'),
      responsable_access_token: this.responsable_access_token,
      colegio_token: this.colegio_token
    };
    //console.log("ON SET PARAMS===>", this.params);
    this.getAviso();
  }

  marcar_como_leido_was_clicked()
  {
    if( !this.leido )
    {
      this.leido = true;
      this.send_visto_to_server();
    }
  }

  send_visto_to_server()
  {
    //console.log( "SENDING VISTO", this.visto_url ,params );
    this.native_http.post( this.routes.avisos_visto_post, this.params, this.routes.header )
    .then(res =>
    {
        let response = JSON.parse(res.data);
        if (response.error)
        {
          this.toasts.show_message(response.message);
        }
        else
        {
          //console.log(response);
        }
      })
      .catch(err =>
      {
        console.log(err, err.error);
        //this.toasts.show_message( "no_server_available" );
      });
  }

  

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AvisoDetallesPage');
  }

  getAviso()
  {
    
    
    let loading = this.loadingCtrl.create();
    loading.present();

    if( this.routes.debug )
      console.log("SENDING===>", this.routes.avisos_aviso_get, this.params);
    
      this.native_http.get( this.routes.avisos_aviso_get, this.params, this.routes.header )
    .then(res => 
    {
        this.response = JSON.parse(res.data);

        if( this.routes.debug )
          console.log('GETTING===>', this.response);

        if (this.response.error)
          this.toasts.show_message(this.response.message);
        else if( this.response.data.aviso != undefined )
        {
          if( this.response.data.aviso.tipo == 'general' )
            this.response.data.aviso.grado_nombre = "Aviso General";
          else
          this.response.data.aviso.grado_nombre = (this.response.data.aviso.relaciones_secciones.length > 0)?this.response.data.aviso.relaciones_secciones[0].seccion.grado.nombre + " " + this.response.data.aviso.relaciones_secciones[0].seccion.nombre:'';

          this.aviso = {
                          id: this.response.data.aviso.id,
                          titulo: this.response.data.aviso.titulo,
                          fecha: this.response.data.aviso.fecha,
                          contenido: this.response.data.aviso.contenido,
                          grado_nombre: this.response.data.aviso.grado_nombre,
                          firma: this.response.data.aviso.firma,
                          archivo: this.response.data.aviso.archivo
                        };

          this.leido = (this.response.data.aviso.vistos.length > 0)?true:false;
        }

        loading.dismiss();
      })
      .catch(err => {
        loading.dismiss();
        this.toasts.show_message('no_server_available');

        if( this.routes.debug )
          console.log("ERROR: ", err, err.error);
      
        });

  }

}
