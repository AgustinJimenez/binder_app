import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { RoutesProvider } from "./../../../providers/config/routes";
import { ParserProvider } from "./../../../providers/parser";
import { ToastProvider } from "./../../../providers/config/toasts";
import { AvisoDetallesPage } from "./../aviso-detalles/aviso-detalles";
import { Events } from 'ionic-angular';
import { AppPreferences } from '@ionic-native/app-preferences';

@IonicPage()
@Component({
  selector: 'page-aviso-index',
  templateUrl: 'aviso-index.html',
})
export class AvisoIndexPage
{
  public id_seccion: string;
  public response: any;
  public url_params: any;
  public loading: any;
  public has_loaded: boolean = false;
  public secciones_ids: Array<string> = [];
  public cabecera_titulo: string = 'AVISOS';
  public avisos: Array<{ id: number ,titulo: string, contenido: string, fecha: any }> = [];
  public responsable_access_token:string = '';
  public colegio_token: string;
  public has_init: false;
  constructor
  (
    public navCtrl: NavController,
    public params: NavParams,
    private native_http: HTTP,
    public routes: RoutesProvider,
    public toasts: ToastProvider,
    public loadingCtrl: LoadingController,
    public events: Events,
    private appPreferences: AppPreferences,
    public parser: ParserProvider
  )
  {
    //console.log(this.avisos);
    this.init();
  }
/*
  ngOnInit()
  {
    //console.log("ngOnInit()");
  }
  ionViewDidLoad()
  {
    //console.log("ionViewDidLoad() ");
  }
  ionViewWillEnter()
  {
    //console.log("ionViewWillEnter()");
  }
  ionViewDidEnter()
  {
    //console.log("ionViewDidEnter()");
  }
  ionViewWillLeave()
  {
    //console.log("ionViewWillLeave()");
  }
  ionViewDidLeave()
  {
    //console.log("ionViewDidLeave()");
  }
  ionViewWillUnload()
  {
    //console.log("ionViewWillUnload()");
  }
  */
  /*
  ionViewCanLeave()
  {
    //console.log("ionViewCanLeave()");
  }
  */


  init()
  {
    this.setVariables();

    //console.log(this.avisos);
  }

  setVariables()
  {
    //console.log("SET VARIABLES FROM NAV=> id_seccion=>"+this.params.get('id_seccion')+", seccion_nombre=>"+this.params.get('seccion_nombre') );
    //console.log( this.params.get('id_seccion') != undefined, this.params.get('seccion_nombre') != undefined )
    if( this.params.get('id_seccion') != undefined)
    {
      //console.log("LOADING ID SECCION FROM PARAMS");
      this.id_seccion = this.params.get('id_seccion');
    }

    this.secciones_ids.push( this.id_seccion );
    
    if( this.params.get('seccion_nombre') != undefined )
    {
      ///console.log("LOADING NOMBRE SECCION FROM PARAMS");
      this.cabecera_titulo = this.params.get('seccion_nombre');
    }
      //console.log('SETTING VARIABLES, SECCION ID==>'+this.id_seccion+" seccion_nombre="+this.cabecera_titulo);


    this.fetch_colegio_token();
  }

  fetch_colegio_token()
  {
    this.appPreferences.fetch('app', 'colegio_token').then( (colegio_token) =>
    {

      //console.log("here colegio token from app preference =====>"+colegio_token );
      if(colegio_token != null || colegio_token != '' || colegio_token != undefined)
        this.colegio_token = colegio_token;
      
      this.fecth_access_data();
      
    });
  }

  fecth_access_data()
  {
    this.appPreferences.fetch('app', 'responsable_access_token').then( (responsable_access_token) =>
    {

      //console.log("here access token from app preference =====>"+responsable_access_token );
      if(responsable_access_token != null || responsable_access_token != '' || responsable_access_token != undefined)
        this.responsable_access_token = responsable_access_token;
      
        this.getAvisos();
      
    });
  }

  

  aviso_was_clicked(aviso)
  {
    //console.log("AVISO WAS CLICKED--->aviso_id=>"+aviso.id+", seccion_id=>"+this.id_seccion )
    this.navCtrl.push(AvisoDetallesPage, { aviso_id: aviso.id, seccion_id: (this.id_seccion != undefined)?this.id_seccion:aviso.relaciones_secciones[0].seccion_id });
  }

  getAvisos(show_loading = true)
  {
    this.avisos = [];
    if( show_loading )
    {
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
    this.load_avisos();

  }

  reload_content( refresher )
  {
    this.has_loaded = false;
    this.getAvisos( false );
    setTimeout(() => 
    {
      refresher.complete();
    }, 2000);


  }

  doInfinite( ): Promise<any>
  {
    return new Promise( (resolve) => 
    {

      setTimeout(() => 
      {
        this.load_avisos();

        resolve();
        
      }, 500);
      

    } );

  }

  load_avisos()
  {
    
    this.url_params = 
    {
      skip: this.avisos.length,
      secciones_ids: this.parser.ArrayToJsonStringify( this.secciones_ids ),
      responsable_access_token: this.responsable_access_token,
      colegio_token: this.colegio_token
    }; 

    if( this.routes.debug )
      console.log("PARAMS===>", this.url_params, this.url_params);

    this.native_http.get( this.routes.avisos_index_get , this.url_params, this.routes.header )
    .then(res =>
    {
      this.response = JSON.parse(res.data);

      if( this.routes.debug )
        console.log('GETTING===>', this.response );
      
      if (this.response.error)
        this.toasts.show_message(this.response.message);
      else
      {
        for (let aviso of this.response.data.avisos )
          this.avisos.push(aviso);
      }
      this.loading.dismiss();
      this.has_loaded = true;
    })
    .catch(err =>
    {
      this.loading.dismiss();
      this.has_loaded = true;
      this.toasts.show_message('no_server_available');

      if( this.routes.debug )
        console.log("ERROR: ", err, err.error);

    });
  }

}
