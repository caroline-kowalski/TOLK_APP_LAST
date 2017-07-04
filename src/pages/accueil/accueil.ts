import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { LoginPage } from '../login/login';


/*
  Generated class for the Accueil page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-accueil',
  templateUrl: 'accueil.html'
})
export class AccueilPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccueilPage');
  }

  redirectionLogin()
  {
	//window.location.href = LoginPage;
	this.app.getRootNav().push(LoginPage);
  }

  

}
