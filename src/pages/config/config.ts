import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';

import { OptionsDataService } from '../../providers/options-data.service';

@Component({
  selector: 'page-config',
  templateUrl: 'config.html'
})
export class ConfigPage implements OnInit {

  /** instancia dependencias */
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private alertCtrl: AlertController,
              private optionsDataService: OptionsDataService,
              private toastCtrl: ToastController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigPage');
  }

  /**
   * ao carregar, carrega todos os dados
   */
  ngOnInit(): void {

  }
}
