import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { DataProvider } from '../../providers/data';
import { LoadingProvider } from '../../providers/loading';
import { ImageProvider } from '../../providers/image';
import { AlertProvider } from '../../providers/alert';
import { ImageModalPage } from '../image-modal/image-modal';
import { AddMembersPage } from '../add-members/add-members';
import { UserInfoPage } from '../user-info/user-info';
import * as firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { Camera } from '@ionic-native/camera';

@Component({
  selector: 'page-group-info',
  templateUrl: 'group-info.html'
})
export class GroupInfoPage {
  private groupId: any;
  private group: any;
  private groupMembers: any;
  private alert: any;
  private user: any;
  private subscription: any;
  // GroupInfoPage
  // This is the page where the user can view group information, change group information, add members, and leave/delete group.
  constructor(public navCtrl: NavController, public navParams: NavParams, public dataProvider: DataProvider,
    public loadingProvider: LoadingProvider, public modalCtrl: ModalController, public alertCtrl: AlertController,
    public alertProvider: AlertProvider, public angularfire: AngularFireDatabase, public imageProvider: ImageProvider, public camera: Camera) { }

  ionViewDidLoad() {
    // Initialize
    this.groupId = this.navParams.get('groupId');

    // Get group details.
    this.subscription = this.dataProvider.getGroup(this.groupId).subscribe((group) => {
      if (group.$exists()) {
        this.loadingProvider.show();
        this.group = group;
        if (group.members) {
          group.members.forEach((memberId) => {
            this.dataProvider.getUser(memberId).subscribe((member) => {
              this.addUpdateOrRemoveMember(member);
            });
          });
        }
        this.loadingProvider.hide();
      } else {
        // Group is deleted, go back.
        this.navCtrl.popToRoot();
      }
    });

    // Get user details.
    this.dataProvider.getCurrentUser().subscribe((user) => {
      this.user = user;
    });
  }

  // Delete subscription.
  // ionViewDidLeave() {
  //   if(this.deleteSubscription)
  //
  // }

  // Check if user exists in the group then add/update user.
  // If the user has already left the group, remove user from the list.
  addUpdateOrRemoveMember(member) {
    if (this.group) {
      if (this.group.members.indexOf(member.$key) > -1) {
        // User exists in the group.
        if (!this.groupMembers) {
          this.groupMembers = [member];
        } else {
          var index = -1;
          for (var i = 0; i < this.groupMembers.length; i++) {
            if (this.groupMembers[i].$key == member.$key) {
              index = i;
            }
          }
          // Add/Update User.
          if (index > -1) {
            this.groupMembers[index] = member;
          } else {
            this.groupMembers.push(member);
          }
        }
      } else {
        // User already left the group, remove member from list.
        var index = -1;
        for (var i = 0; i < this.groupMembers.length; i++) {
          if (this.groupMembers[i].$key == member.$key) {
            index = i;
          }
        }
        if (index > -1) {
          this.groupMembers.splice(index, 1);
        }
      }
    }
  }

  // View user info.
  viewUser(userId) {
    if (firebase.auth().currentUser.uid != userId)
      this.navCtrl.push(UserInfoPage, { userId: userId });
  }

  // Back
  back() {
    this.subscription.unsubscribe();
    this.navCtrl.pop();
  }

  // Enlarge group image.
  enlargeImage(img) {
    let imageModal = this.modalCtrl.create(ImageModalPage, { img: img });
    imageModal.present();
  }

  // Change group name.
  setName() {
    this.alert = this.alertCtrl.create({
      title: 'Modifier le nom du groupe',
      message: "Veuillez entrer un nouveau nom de groupe.",
      inputs: [
        {
          name: 'name',
          placeholder: 'Nom du groupe',
          value: this.group.name
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {
            let name = data["name"];
            if (this.group.name != name) {
              this.loadingProvider.show();
              // Add system message.
              this.group.messages.push({
                date: new Date().toString(),
                sender: this.user.$key,
                type: 'system',
                message: this.user.name + ' a modifié le nom du groupe à: ' + name + '.',
                icon: 'md-create'
              });
              // Update group on database.
              this.dataProvider.getGroup(this.groupId).update({
                name: name,
                messages: this.group.messages
              }).then((success) => {
                this.loadingProvider.hide();
                this.alertProvider.showGroupUpdatedMessage();
              }).catch((error) => {
                this.loadingProvider.hide();
                this.alertProvider.showErrorMessage('group/error-update-group');
              });
            }
          }
        }
      ]
    }).present();
  }

  // Change group image, the user is asked if they want to take a photo or choose from gallery.
  setPhoto() {
    this.alert = this.alertCtrl.create({
      title: 'Modifier le photo de groupe',
      message: 'Voulez-vous prendre une photo ou la choisir à partir de la galerie ?',
      buttons: [
        {
          text: 'Annuler',
          handler: data => { }
        },
        {
          text: 'Choisir à partir de la galerie',
          handler: () => {
            this.loadingProvider.show();
            // Upload photo and set to group photo, afterwards, return the group object as promise.
            this.imageProvider.setGroupPhotoPromise(this.group, this.camera.PictureSourceType.PHOTOLIBRARY).then((group) => {
              // Add system message.
              this.group.messages.push({
                date: new Date().toString(),
                sender: this.user.$key,
                type: 'system',
                message: this.user.name + ' a changé la photo du groupe.',
                icon: 'ios-camera'
              });
              // Update group image on database.
              this.dataProvider.getGroup(this.groupId).update({
                img: group.img,
                messages: this.group.messages
              }).then((success) => {
                this.loadingProvider.hide();
                this.alertProvider.showGroupUpdatedMessage();
              }).catch((error) => {
                this.loadingProvider.hide();
                this.alertProvider.showErrorMessage('group/error-update-group');
              });
            });
          }
        },
        {
          text: 'Prendre une photo',
          handler: () => {
            this.loadingProvider.show();
            // Upload photo and set to group photo, afterwwards, return the group object as promise.
            this.imageProvider.setGroupPhotoPromise(this.group, this.camera.PictureSourceType.CAMERA).then((group) => {
              // Add system message.
              this.group.messages.push({
                date: new Date().toString(),
                sender: this.user.$key,
                type: 'system',
                message: this.user.name + ' a changé la photo du groupe.',
                icon: 'ios-camera'
              });
              // Update group image on database.
              this.dataProvider.getGroup(this.groupId).update({
                img: group.img,
                messages: this.group.messages
              }).then((success) => {
                this.loadingProvider.hide();
                this.alertProvider.showGroupUpdatedMessage();
              }).catch((error) => {
                this.loadingProvider.hide();
                this.alertProvider.showErrorMessage('group/error-update-group');
              });
            });
          }
        }
      ]
    }).present();
  }

  // Change group description.
  setDescription() {
    this.alert = this.alertCtrl.create({
      title: 'Changer la description du groupe',
      message: "Veuillez entrer une nouvelle description du groupe.",
      inputs: [
        {
          name: 'description',
          placeholder: 'Description du groupe',
          value: this.group.description
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {
            let description = data["description"];
            if (this.group.description != description) {
              this.loadingProvider.show();
              // Add system message.
              this.group.messages.push({
                date: new Date().toString(),
                sender: this.user.$key,
                type: 'system',
                message: this.user.name + ' a changé la description du groupe.',
                icon: 'md-clipboard'
              });
              // Update group on database.
              this.dataProvider.getGroup(this.groupId).update({
                description: description,
                messages: this.group.messages
              }).then((success) => {
                this.loadingProvider.hide();
                this.alertProvider.showGroupUpdatedMessage();
              }).catch((error) => {
                this.loadingProvider.hide();
                this.alertProvider.showErrorMessage('group/error-update-group');
              });
            }
          }
        }
      ]
    }).present();
  }

  // Leave group.
  leaveGroup() {
    this.alert = this.alertCtrl.create({
      title: 'Quitter le groupe',
      message: 'Êtes vous certain de vouloir quitter ce groupe ?',
      buttons: [
        {
          text: 'Annuler'
        },
        {
          text: 'Quitter',
          handler: data => {
            this.loadingProvider.show();
            // Remove member from group.
            this.group.members.splice(this.group.members.indexOf(this.user.$key), 1);
            // Add system message.
            this.group.messages.push({
              date: new Date().toString(),
              sender: this.user.$key,
              type: 'system',
              message: this.user.name + ' a quitté le groupe.',
              icon: 'md-log-out'
            });
            // Update group on database.
            this.dataProvider.getGroup(this.groupId).update({
              members: this.group.members,
              messages: this.group.messages
            }).then((success) => {
              // Remove group from user's group list.
              this.angularfire.object('/accounts/' + firebase.auth().currentUser.uid + '/groups/' + this.groupId).remove().then(() => {
                // Pop this view because user already has left this group.
                this.group = null;
                setTimeout(() => {
                  this.loadingProvider.hide();
                  this.navCtrl.popToRoot();
                }, 300);
              });
            }).catch((error) => {
              this.alertProvider.showErrorMessage('group/error-leave-group');
            });
          }
        }
      ]
    }).present();
  }

  // Delete group.
  deleteGroup() {
    this.alert = this.alertCtrl.create({
      title: 'Suppression',
      message: 'Êtes vous certain de vouloir supprimer ce groupe?',
      buttons: [
        {
          text: 'Annuler'
        },
        {
          text: 'Supprimer',
          handler: data => {
            let group = JSON.parse(JSON.stringify(this.group));
            // Delete all images of image messages.
            group.messages.forEach((message) => {
              if (message.type == 'image') {
                console.log("Supprimer: " + message.url + " de " + group.$key);
                this.imageProvider.deleteGroupImageFile(group.$key, message.url);
              }
            });
            // Delete group image.
            console.log("Supprimer: " + group.img);
            this.imageProvider.deleteImageFile(group.img);
            this.angularfire.object('/accounts/' + firebase.auth().currentUser.uid + '/groups/' + group.$key).remove().then(() => {
              this.dataProvider.getGroup(group.$key).remove();
            });
          }
        }
      ]
    }).present();
  }

  // Add members.
  addMembers() {
    this.navCtrl.push(AddMembersPage, { groupId: this.groupId });
  }
}
