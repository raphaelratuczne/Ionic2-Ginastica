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

  /** referencias aos controllers */
  addPage: any = AddPage;
  listPage: any = ListPage;
  optionsPage: any = OptionsPage;
  configPage: any = ConfigPage;

  constructor(public navCtrl: NavController) {}

  /**
   * carrega pg Adicionar
   */
  goToAdd(): void {
    this.navCtrl.push(this.addPage);
  }

  /**
   * carrega pg Listar
   */
  goToList(): void {
    this.navCtrl.push(this.listPage);
  }

  /**
   * carrega pg Opcoes
   */
  goToOptions(): void {
    this.navCtrl.push(this.optionsPage);
  }

  /**
   * carrega pg Configuracoes
   */
  goToConfig(): void {
    this.navCtrl.push(this.configPage);
  }

}
