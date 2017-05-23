import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { AddPage } from '../add/add';
import { ListPage } from '../list/list';
import { ConfigPage } from '../config/config';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  addPage: any = AddPage;
  listPage: any = ListPage;
  configPage: any = ConfigPage;

  constructor(public navCtrl: NavController) {

  }

  goToAdd() {
    this.navCtrl.push(this.addPage);
  }

  goToList() {
    this.navCtrl.push(this.listPage);
  }

  goToConfig() {
    this.navCtrl.push(this.configPage);
  }

}
