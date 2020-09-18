import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class ToastProvider 
{
  toast:ToastController;
  message:any = 
  {
    default:
    {
      message: 'DEFAULT TOAST MESSAGE',
      duration: 5500,
      position: 'middle',
      cssClass: 'toast-error-message',
      dismissOnPageChange: true,
      showCloseButton:true,
      closeButtonText:"CERRAR"
    },
    no_server_available:
    {
      message: 'Hay problemas para conectarse al servidor.',
      duration: 5500,
      position: 'middle',
      cssClass: 'toast-error-message',
      dismissOnPageChange: true,
      showCloseButton:true,
      closeButtonText:"CERRAR"
    },
    no_results:
    {
      message: 'No se encontraron registros.',
      duration: 5500,
      position: 'middle',
      cssClass: 'toast-error-message',
      dismissOnPageChange: true,
      showCloseButton:true,
      closeButtonText:"CERRAR"
    }


  }
  



  constructor
  (
    public toastCtrl: ToastController,
  )
  {
  }

  show_message( message_obj )
  {
    let tmp_toast = this.message[message_obj];
    
    if( typeof(tmp_toast)=="undefined" )
    {
      tmp_toast = this.message['default'];
      tmp_toast.message = message_obj;
    }

    return setTimeout(() => {
            this.toastCtrl.create( tmp_toast ).present();
          }, 1000);
    
    
  }

}
