import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { DataProvider } from '../../providers/data';
import { LoadingProvider } from '../../providers/loading';
import { AlertProvider } from '../../providers/alert';
import { FirebaseProvider } from '../../providers/firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { UserInfoPage } from '../user-info/user-info';

@Component({
  selector: 'page-search-people',
  templateUrl: 'search-people.html'
})
export class SearchPeoplePage {
  private accounts: any;
  private alert: any;
  private account: any;
  private excludedIds: any;
  private requestsSent: any;
  private friendRequests: any;
  private searchUser: any;
  // SearchPeoplePage
  // This is the page where the user can search for other users and send a friend request.
  constructor(public navCtrl: NavController, public navParams: NavParams, public dataProvider: DataProvider, public loadingProvider: LoadingProvider,
    public alertCtrl: AlertController, public angularfire: AngularFireDatabase, public alertProvider: AlertProvider, public firebaseProvider: FirebaseProvider) { }

  ionViewDidLoad() {
    // Initialize
    this.loadingProvider.show();
    this.searchUser = '';
    // Get all users.
    this.dataProvider.getUsers().subscribe((accounts) => {
      this.loadingProvider.hide();
      this.accounts = accounts;
      this.dataProvider.getCurrentUser().subscribe((account) => {
        // Add own userId as exludedIds.
        this.excludedIds = [];
        this.account = account;
        if (this.excludedIds.indexOf(account.$key) == -1) {
          this.excludedIds.push(account.$key);
        }
        // Get friends which will be filtered out from the list using searchFilter pipe pipes/search.ts.
        if (account.friends) {
          account.friends.forEach(friend => {
            if (this.excludedIds.indexOf(friend) == -1) {
              this.excludedIds.push(friend);
            }
          });
        }
        // Get requests of the currentUser.
        this.dataProvider.getRequests(account.$key).subscribe((requests) => {
          this.requestsSent = requests.requestsSent;
          this.friendRequests = requests.friendRequests;
        });
      });
    });
  }

  // Back
  back() {
    this.navCtrl.pop();
  }

  // Get the status of the user in relation to the logged in user.
  getStatus(user) {
    // Returns:
    // 0 when user can be requested as friend.
    // 1 when a friend request was already sent to this user.
    // 2 when this user has a pending friend request.
    if (this.requestsSent) {
      for (var i = 0; i < this.requestsSent.length; i++) {
        if (this.requestsSent[i] == user.$key) {
          return 1;
        }
      }
    }
    if (this.friendRequests) {
      for (var i = 0; i < this.friendRequests.length; i++) {
        if (this.friendRequests[i] == user.$key) {
          return 2;
        }
      }
    }
    return 0;
  }

  // Send friend request.
  sendFriendRequest(user) {
    this.alert = this.alertCtrl.create({
      title: 'Envoyer une demande d\'ami',
      message: 'Vous voulez envoyer une demande d\'ami à <b>' + user.name + '</b>?',
      buttons: [
        {
          text: 'Annuler',
          handler: data => { }
        },
        {
          text: 'Envoyer',
          handler: () => {
            this.firebaseProvider.sendFriendRequest(user.$key);
          }
        }
      ]
    }).present();
  }

  // Cancel friend request sent.
  cancelFriendRequest(user) {
    this.alert = this.alertCtrl.create({
      title: 'Demande d\'ami en attente',
      message: 'Vous voulez supprimer votre demande d\'ami à <b>' + user.name + '</b>?',
      buttons: [
        {
          text: 'Annuler',
          handler: data => { }
        },
        {
          text: 'Supprimer',
          handler: () => {
            this.firebaseProvider.cancelFriendRequest(user.$key);
          }
        }
      ]
    }).present();
  }

  // Accept friend request.
  acceptFriendRequest(user) {
    this.alert = this.alertCtrl.create({
      title: 'Confirmer la demande d\'ami',
      message: 'Vous voulez accepter <b>' + user.name + '</b> en tant qu\'ami?',
      buttons: [
        {
          text: 'Annuler',
          handler: data => { }
        },
        {
          text: 'Rejeter la demande',
          handler: () => {
            this.firebaseProvider.deleteFriendRequest(user.$key);
          }
        },
        {
          text: 'Accepter la demande',
          handler: () => {
            this.firebaseProvider.acceptFriendRequest(user.$key);
          }
        }
      ]
    }).present();
  }

  // View user.
viewUser(userId) {
    this.navCtrl.push(UserInfoPage, {userId: userId});
  }

}
