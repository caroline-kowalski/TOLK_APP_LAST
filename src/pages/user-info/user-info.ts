import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { DataProvider } from '../../providers/data';
import { LoadingProvider } from '../../providers/loading';
import { FirebaseProvider } from '../../providers/firebase';
import { MessagePage } from '../message/message';
import { ImageModalPage } from '../image-modal/image-modal';
import * as firebase from 'firebase';

@Component({
  selector: 'page-user-info',
  templateUrl: 'user-info.html'
})
export class UserInfoPage {
  private user: any;
  private userId: any;
  private friendRequests: any;
  private requestsSent: any;
  private friends: any;
  private alert: any;
  // UserInfoPage
  // This is the page where the user can view user information, and do appropriate actions based on their relation to the current logged in user.
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public dataProvider: DataProvider,
    public loadingProvider: LoadingProvider, public alertCtrl: AlertController, public firebaseProvider: FirebaseProvider) { }

  ionViewDidLoad() {
    this.userId = this.navParams.get('userId');
    this.loadingProvider.show();
    // Get user info.
    this.dataProvider.getUser(this.userId).subscribe((user) => {
      this.user = user;
      this.loadingProvider.hide();
    });
    // Get friends of current logged in user.
    this.dataProvider.getUser(firebase.auth().currentUser.uid).subscribe((user) => {
      this.friends = user.friends;
    });
    // Get requests of current logged in user.
    this.dataProvider.getRequests(firebase.auth().currentUser.uid).subscribe((requests) => {
      this.friendRequests = requests.friendRequests;
      this.requestsSent = requests.requestsSent;
    });
  }

  // Back
  back() {
    this.navCtrl.pop();
  }

  // Enlarge user's profile image.
  enlargeImage(img) {
    let imageModal = this.modalCtrl.create(ImageModalPage, { img: img });
    imageModal.present();
  }

  // Accept friend request.
  acceptFriendRequest() {
    this.alert = this.alertCtrl.create({
      title: 'Demande en ami',
      message: 'Voulez-vous accepter <b>' + this.user.name + '</b> en tant qu\'ami?',
      buttons: [
        {
          text: 'Annuler',
          handler: data => { }
        },
        {
          text: 'Accepter',
          handler: () => {
            this.firebaseProvider.acceptFriendRequest(this.userId);
          }
        }
      ]
    }).present();
  }

  // Deny friend request.
  rejectFriendRequest() {
    this.alert = this.alertCtrl.create({
      title: 'Rejeter une demande d\'ami',
      message: 'Vous voulez rejeter <b>' + this.user.name + '</b> en tant qu\'ami?',
      buttons: [
        {
          text: 'Annuler',
          handler: data => { }
        },
        {
          text: 'Rejeter',
          handler: () => {
            this.firebaseProvider.deleteFriendRequest(this.userId);
          }
        }
      ]
    }).present();
  }

  // Cancel friend request sent.
  cancelFriendRequest() {
    this.alert = this.alertCtrl.create({
      title: 'Demande d\'ami en attente',
      message: 'Vous voulez supprimer votre demande d\'ami pour <b>' + this.user.name + '</b>?',
      buttons: [
        {
          text: 'Annuler',
          handler: data => { }
        },
        {
          text: 'Supprimer',
          handler: () => {
            this.firebaseProvider.cancelFriendRequest(this.userId);
          }
        }
      ]
    }).present();
  }

  // Send friend request.
  sendFriendRequest() {
    this.alert = this.alertCtrl.create({
      title: 'Envoyer une demande d\'ami',
      message: 'Vous voulez envoyer une demande d\'ami à <b>' + this.user.name + '</b>?',
      buttons: [
        {
          text: 'Annuler',
          handler: data => { }
        },
        {
          text: 'Envoyer',
          handler: () => {
            this.firebaseProvider.sendFriendRequest(this.userId);
          }
        }
      ]
    }).present();
  }

  // Open chat with this user.
  sendMessage() {
    this.navCtrl.push(MessagePage, { userId: this.userId });
  }

  // Check if user can be added, meaning user is not yet friends nor has sent/received any friend requests.
  canAdd() {
    if (this.friendRequests) {
      if (this.friendRequests.indexOf(this.userId) > -1) {
        return false;
      }
    }
    if (this.requestsSent) {
      if (this.requestsSent.indexOf(this.userId) > -1) {
        return false;
      }
    }
    if (this.friends) {
      if (this.friends.indexOf(this.userId) > -1) {
        return false;
      }
    }
    return true;
  }
}
