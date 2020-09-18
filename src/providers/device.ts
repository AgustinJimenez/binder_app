import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Device } from '@ionic-native/device';

@Injectable()
export class CustomDeviceProvider
{

  constructor
  (
    public device: Device,
    public platform: Platform
  )
  {

  }

  getOs()
  {
    if (this.platform.is('android'))
      return 'android';
    else if (this.platform.is('ios'))
      return 'ios' ;
    else if (this.platform.is("windows"))
      return 'windows';
    else
      return 'other';
  }

  getInfo()
  {

    return {
      isVirtual: this.device.isVirtual,
      manufacturer: this.device.manufacturer,
      model: this.device.model,
      serial: this.device.serial,
      uuid: this.device.uuid,
      version: this.device.version,
      platform: this.getOs()
    };

  }

  getDevice()
  {
    return this.device;
  }

}
