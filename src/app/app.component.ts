import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController/*, AlertController*/ } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppPreferences } from '@ionic-native/app-preferences';
import { Events } from 'ionic-angular';

/*PAGES */
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/auth/login/login';
import { SeleccionColegioPage } from '../pages/seleccion-colegio/seleccion-colegio';
import { PerfilUsuarioShowPage } from './../pages/perfil-usuario/show/perfil-usuario-show';
import { ToastProvider } from "./../providers/config/toasts";
import { AvisoIndexPage } from './../pages/avisos/aviso-index/aviso-index';
import { NoticiasIndexPage } from './../pages/noticias/noticias-index/noticias-index';
import { HorariosClasesIndexPage } from './../pages/horarios/horarios-clases/horario-clases-index/horarios-clases-index';
import { HorariosExamenesIndexPage } from './../pages/horarios/horarios-examenes/horario-examenes-index/horarios-examenes-index';


/*PLUGIN*/
import { HTTP } from '@ionic-native/http';
import { FCM } from '@ionic-native/fcm';

/*PROVIDER*/
import { RoutesProvider } from "./../providers/config/routes";

@Component({
  templateUrl: 'app.html'
})
export class MyApp
{
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  PagesShowLevel1 = null;
  PagesShowLevel2 = null;

  pages:
  Array<{
    title: string,
    component: any,
    icon: string,
      items: Array< any >
  }>;

  url: string;
  response:any;
  public responsable_access_token:string;
  public colegio_token:string = null;
  public params:any;
  public top_sidebar_colegio_logo_url:string;
  public colegio_nombre: string = '';

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    //private alertCtrl: AlertController,
    //private credentials: Credentials,
    public loadingCtrl: LoadingController,
    private native_http: HTTP,
    private appPreferences: AppPreferences,
    public toasts: ToastProvider,
    public routes: RoutesProvider,
    public events: Events,
    private fcm: FCM
  )
  {
    //console.log("HERE APP COMPONENT CONSTRUCTOR");
    this.initializeApp();
    // used for an example of ngFor and navigation
    //console.log("END INITIALIZE APP");
    this.pages =
    [
      { title: "Inicio", component: HomePage, icon: 'ios-home-outline', items: [] },
      { title: "Avisos", component: null, icon: 'ios-mail-outline', items:[] },
      { title: "Noticias", component: NoticiasIndexPage, icon: 'ios-paper-outline', items:[] },
      { title: "Clases", component: null, icon: 'ios-time-outline', items:[] },
      { title: "Examenes", component: null, icon: 'ios-time-outline', items:[] },
      { title: "Perfil", component: PerfilUsuarioShowPage, icon: 'ios-contact-outline', items: [] }

    ];

  }



















  PageClicked(page, idx)
  {
    if (page.items.length > 0 && idx != 'is_item_of_page'/*grado*/)
      this.toggleLevel1(idx);
    else
      this.openPage(page);
  }



  initializeApp()
  {
    this.platform.ready().then(() =>
    {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.statusBar.styleDefault();
      // this.statusBar.backgroundColorByHexString('#39ae88');
      this.splashScreen.hide();
      this.check_estado_aprobacion();
      this.check_if_show_password_recover_message();
      this.register_side_menu_button_tapp_event();
      //this.FirebaseCloudMessaging();
      this.fetch_colegio_token();
    });
  }

  check_estado_aprobacion()
  {

    this.appPreferences.fetch('app', 'show_pendiente_aprobacion_message').then((show_pendiente) =>
    {
      if (show_pendiente == undefined)
        this.appPreferences.store('app', 'show_pendiente_aprobacion_message', false);
    });

  }

  check_if_show_password_recover_message()
  {

    this.appPreferences.fetch('app', 'show_recover_modal').then((show_recover_modal) =>
    {
      if (show_recover_modal == undefined)
        this.appPreferences.store('app', 'show_recover_modal', false);
    });

    this.appPreferences.fetch('app', 'show_recover_modal_email').then((show_recover_modal_email) =>
    {
      if (show_recover_modal_email == undefined)
        this.appPreferences.store('app', 'show_recover_modal_email', null);
    });

  }

  register_side_menu_button_tapp_event()
  {
    //solo se registra, no se le llama
    this.events.subscribe('side-menu-button:tapped', () =>
    {
      this.fetch_colegio_token();
      this.fetch_colegio_nombre();
    });

  }

  check_if_user_is_logged()
  {
    if( this.colegio_token == null || this.colegio_token == '' || this.colegio_token == undefined)
      this.rootPage = SeleccionColegioPage;
    else
      if ( this.responsable_access_token == null || this.responsable_access_token == '' || this.responsable_access_token == undefined )
        this.rootPage = LoginPage;
      else
        this.rootPage = HomePage;//is logged
  }

  fetch_colegio_nombre()
  {
    this.appPreferences.fetch('app', 'colegio_nombre').then( (colegio_nombre) =>
    {
      //console.log("here access token from app preference =====>"+responsable_access_token );
      if
      (
        colegio_nombre != null ||
        colegio_nombre != '' ||
        colegio_nombre != undefined
      )
      {
        this.colegio_nombre = colegio_nombre;
      }
    });
  }

  fetch_colegio_token()
  {
    this.appPreferences.fetch('app', 'colegio_token').then( (colegio_token) =>
    {
      //console.log("here access token from app preference =====>"+responsable_access_token );
      if
      (
        colegio_token != null ||
        colegio_token != '' ||
        colegio_token != undefined
      )
      {
        this.colegio_token = colegio_token;
        this.fetch_responsable_access();
      }
    });
  }

  fetch_responsable_access()
  {
    this.pages[1].items = [];
    this.appPreferences.fetch('app', 'responsable_access_token').then( (responsable_access_token) =>
    {

      //console.log("here access token from app preference =====>"+responsable_access_token );
      if
      (
        responsable_access_token != null ||
        responsable_access_token != '' ||
        responsable_access_token != undefined
      )
      {
        this.responsable_access_token = responsable_access_token;
        this.fetch_colegio_logo_url();
        //console.log(this.param_access_token);
      }
    });

  }

  fetch_colegio_logo_url()
  {
    this.appPreferences.fetch('app', 'colegio_logo_url').then( (colegio_logo_url) =>
    {

      //console.log("here access token from app preference =====>"+responsable_access_token );
      if
      (
        colegio_logo_url != null ||
        colegio_logo_url != '' ||
        colegio_logo_url != undefined
      )
      {
        this.top_sidebar_colegio_logo_url = colegio_logo_url;

        //console.log(this.param_access_token);
      }
        //console.log("CHECKING PARAMS FOR HTTP==>", this.responsable_access_token, this.colegio_token );
        this.getGradosSuscriptos();
    });
  }

  FirebaseCloudMessaging()
  {
    this.fcm.subscribeToTopic('all');
    this.fcm.onNotification().subscribe(data =>
    {
      //alert(data)
      console.log(data);
      if(data.wasTapped)
      {
        console.info("Received in background");
      }
      else
      {
        console.info("Received in foreground");
      };
    });

    this.fcm.onTokenRefresh().subscribe(token =>
    {
    });

  }








  set_page( component, params? )
  {
    if( component != null )
    {
      if( this.routes.debug )
        console.log("SETTING NEW PAGE===>", component, params?params:{} );

      this.nav.setRoot( component, params?params:{} );
    }
  }

  openPage(page)
  {
    if( this.routes.debug )
      console.log("<=======CLICK NEW PAGE=======>", page);

    if (page.id_seccion != undefined || page.id_seccion != null)
    {
      if( this.routes.debug )
        console.log("OPEN PAGE, ID_SECCION==>", page.id_seccion);

      this.set_page(page.component, { id_seccion: page.id_seccion, seccion_nombre: page.seccion_nombre });
    }
    else if ( (page['type'] != undefined || page['type'] != null) && page['type'] == 'horario-clase' )
    {
      if( this.routes.debug )
        console.log("LOADING CLASE", page.component);

      this.set_page(page.component, { seccion_id: page.seccion_id, nombre_grado_seccion: page.title });
    }
    else if ( (page['type'] != undefined || page['type'] != null) && page['type'] == 'horario-examen' )
    {
      if( this.routes.debug )
        console.log("LOADING EXAMEN", page.component);

      this.set_page(page.component, { seccion_id: page.seccion_id, nombre_grado_seccion: page.title });
    }
    else
    {
      this.set_page(page.component);
      //console.log('PAGE.ID_SECCION UNDEFINED!!! CHECK app.component');
    }

  }



  getGradosSuscriptos()
  {
    this.params =
    {
      responsable_access_token: this.responsable_access_token,
      colegio_token: this.colegio_token
    };
    this.check_if_user_is_logged();
    //console.log('REQUESTING==>', this.params );
    if(
      this.responsable_access_token != null &&
      this.responsable_access_token != undefined &&
      this.responsable_access_token != '' &&
      this.colegio_token != null &&
      this.colegio_token != undefined &&
      this.colegio_token != ''
    )
    this.native_http.get( this.routes.avisos_side_menu_get, this.params, this.routes.header )
    .then(res =>
    {
        this.response = JSON.parse(res.data);
        if (this.response.error)
          this.toasts.show_message(this.response.message);
        else
        {
          if( this.routes.debug )
            console.log( "GETTING SECCIONES FOR SIDE MENU", this.response );
          this.pages[1].items.push
          ({
            id_seccion: null,
            seccion_nombre: 'todos',
            title: "Todos",
            component: AvisoIndexPage,
            badge: "0"
          });

          let count_avisos_no_vistos_total = 0;

          for (let seccion of this.response.data.secciones_suscritas)
          {

            let vistos_count = 0;
            let avisos_count = 0;
            for(let aviso of seccion.avisos)
            {
              avisos_count++;
              if (aviso.vistos != undefined && aviso.vistos.length > 0 )
                vistos_count++;
            }
            let no_vistos = avisos_count - vistos_count;
            count_avisos_no_vistos_total += no_vistos;
            this.pages[1].items.push(
            {
              id_seccion: seccion.id,
              seccion_nombre: seccion.nombre,
              title: (seccion.nombre_grado_seccion.length > 32) ? seccion.nombre_grado_seccion.substring(0, 32) + '...' : seccion.nombre_grado_seccion,
              component: AvisoIndexPage,
              badge: String( no_vistos )
            });

          }
          this.pages[1].items[0].badge = /*String( count_avisos_no_vistos_total )*/'0';



          /* HORARIOS */
          this.pages[3].items = [];
          this.pages[4].items = [];

          for (let seccion of this.response.data.horarios_secciones.secciones_horarios_clases )
            this.pages[3].items.push
            ({
              seccion_id: seccion.id,
              title: seccion.nombre_grado_seccion,
              component: HorariosClasesIndexPage,
              type: "horario-clase"
            });
        
          for (let seccion of this.response.data.horarios_secciones.secciones_horarios_examenes )
            this.pages[4].items.push
            ({
              seccion_id: seccion.id,
              title: seccion.nombre_grado_seccion,
              component: HorariosExamenesIndexPage,
              type: "horario-examen"
            });

        }
      })
      .catch(err =>
      {
        this.toasts.show_message('no_server_available');
        console.log("ERROR: ", err);
      });

  }


  toggleLevel1(idx)
  {
    if (this.isLevel1Shown(idx))
      this.PagesShowLevel1 = null;
    else
      this.PagesShowLevel1 = idx;

  };

  toggleLevel2(idx) {
    if (this.isLevel2Shown(idx)) {
      this.PagesShowLevel1 = null;
      this.PagesShowLevel2 = null;
    }
    else {
      this.PagesShowLevel1 = idx;
      this.PagesShowLevel2 = idx;
    }
  };

  isLevel1Shown(idx) {
    return this.PagesShowLevel1 === idx;
  };

  isLevel2Shown(idx) {
    return this.PagesShowLevel2 === idx;
  };




  


}
