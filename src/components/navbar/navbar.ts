import { Component, Input } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { Events } from 'ionic-angular';

/**
 * Generated class for the NavbarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'custom-navbar',
  templateUrl: 'navbar.html'
})
export class NavbarComponent {

  @Input() titulo: string;
  @Input() hide_back_button: boolean = true;

  constructor(public keyboard: Keyboard, public events: Events) {
  }

  menu_toggle_event()
	{
    this.keyboard.close();
    this.events.publish('side-menu-button:tapped', null);
	}

}
