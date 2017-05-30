import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { AddPage } from '../add/add';
import { ListPage } from '../list/list';
import { OptionsPage } from '../options/options';
import { ConfigPage } from '../config/config';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  addPage: any = AddPage;
  listPage: any = ListPage;
  optionsPage: any = OptionsPage;
  configPage: any = ConfigPage;

  constructor(public navCtrl: NavController) {

  }

  goToAdd(): void {
    this.navCtrl.push(this.addPage);
  }

  goToList(): void {
    this.navCtrl.push(this.listPage);
  }

  goToOptions(): void {
    this.navCtrl.push(this.optionsPage);
  }

  goToConfig(): void {
    this.navCtrl.push(this.configPage);
  }

}
