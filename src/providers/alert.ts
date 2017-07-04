import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Validator } from '../validator';
import { Login } from '../login';
import { LogoutProvider } from './logout';

const errorMessages = {
  // Alert Provider
  // This is the provider class for most of the success and error messages in the app.
  // If you added your own messages don't forget to make a function for them or add them in the showErrorMessage switch block.

  // Firebase Error Messages
  accountExistsWithDifferentCredential: { title: 'Ce compte existe déjà!', subTitle: 'Un compte avec les mêmes coordonnées existe déjà.' },
  invalidCredential: { title: 'Informations de connexion invalides!', subTitle: 'Une erreur est subvenue lorsque vous vous connectez avec ces informations.' },
  operationNotAllowed: { title: 'La connexion a échoué!', subTitle: 'Se connecter de cette façon n est pas permis ! Veuillez contacter le support' },
  userDisabled: { title: 'Compte désactivé!', subTitle: 'Veuillez nous excuser mais ce compte a été suspendu! Veuillez contacter le support.' },
  userNotFound: { title: 'Compte non trouvé!', subTitle: 'Aucun compte avec ces informations de connexion n a pu être trouvé.' },
  wrongPassword: { title: 'Mot de passe incorrect!', subTitle: 'Votre mot de passe est incorrect.' },
  invalidEmail: { title: 'Email invalide!', subTitle: 'Votre email est invalide.' },
  emailAlreadyInUse: { title: 'Email indisponible!', subTitle: 'Cet email est déjà utilisé.' },
  weakPassword: { title: 'Mot de passe faible!', subTitle: 'Le mot de passe entré est trop faible.' },
  requiresRecentLogin: { title: 'Informations de connexion expirés!', subTitle: 'Vos informations de connexion ont expirés! Veuillez vous reconnecter.' },
  userMismatch: { title: 'Utilisateur incompatible!', subTitle: 'Ces informations de connexion sont pour un autre utilisateur!' },
  providerAlreadyLinked: { title: 'Déjà lié!', subTitle: 'Votre compte est déjà lié à ces informations de connexion.' },
  credentialAlreadyInUse: { title: 'Informations de connexion non disponible!', subTitle: 'Ces informations de connexion sont déjà utilisées un autre utilisateur' },
  // Profile Error Messages
  changeName: { title: 'Le changement de nom a échoué!', subTitle: 'Veuillez nous excusez mais nous avons rencontrer une erreur lors du changement de votre nom.' },
  invalidCharsName: Validator.profileNameValidator.patternError,
  nameTooShort: Validator.profileNameValidator.lengthError,
  changeEmail: { title: 'Le changement de votre email a échoué!', subTitle: 'Veuillez nous excusez mais nous avons rencontrer une erreur lors du changement de votre adresse email' },
  invalidProfileEmail: Validator.profileEmailValidator.patternError,
  changePhoto: { title: 'Le changement de votre photo a échoué!', subTitle: 'Veuillez nous excusez mais nous avons rencontrer une erreur lors du changement de votre photo.' },
  passwordTooShort: Validator.profilePasswordValidator.lengthError,
  invalidCharsPassword: Validator.profilePasswordValidator.patternError,
  passwordsDoNotMatch: { title: 'Le changement de votre mot de passe a échoué!', subTitle: 'Veuillez nous excusez mais nous avons rencontrer une erreur lors du changement de votre mot de passe.' },
  updateProfile: { title: 'La mise à jour de votre profil a échoué', subTitle: 'Veuillez nous excusez mais nous avons rencontrer une erreur lors de la mise à jour de votre profil' },
  usernameExists: { title: 'Nom d\'utilisateur déjà pris', subTitle: 'Ce nom d\'utilisateur est déjà pris par un autre utilisateur.' },
  // Image Error Messages
  imageUpload: { title: 'Le téléchargement de votre image a échoué!', subTitle: 'Veuillez nous excusez mais nous avons rencontrer une erreur lors du téléchargement de l\'image que vous avez selectionné' },
  // Group Error Messages
  groupUpdate: { title: 'La mise à jour du groupe a échoué', subTitle: 'Veuillez nous excusez mais nous avons rencontrer une erreur lors de la mise à jour du groupe.' },
  groupLeave: { title: 'Quitter le groupe a échoué!', subTitle: 'Veuillez nous excusez mais nous avons rencontrer une erreur lorsque vous quittiez le groupe.' },
  groupDelete: { title: 'Supprimer le groupe a échoué!', subTitle:'Veuillez nous excusez mais nous avons rencontrer une erreur lorsque vous supprimiez le groupe.' }
};

const successMessages = {
  passwordResetSent: { title: 'Mot de passe réinitialisé envoyé!', subTitle: 'Un email pour la réinitialisation du mot de passe a été envoyé à: ' },
  profileUpdated: { title: 'Profil mis à jour!', subTitle: 'Votre profil a été correctement mis à jour!' },
  emailVerified: { title: 'Votre email a été confirmé!', subTitle: 'Félicitations! Votre email vient d\'être confirmé!' },
  emailVerificationSent: { title: 'Email de confirmation envoyé!', subTitle: 'Un email de confirmation a été envoyé à: ' },
  accountDeleted: { title: 'Compte supprimé!', subTitle: 'Votre compte a été supprimé avec succès.' },
  passwordChanged: { title: 'Mot de passe modifié!', subTitle: 'Votre mot de passe a été modifié avec succès.' },
  friendRequestSent: { title: 'Demande d\'ami envoyée!', subTitle: 'Votre demande d\'ami a été envoyé avec succès!' },
  friendRequestRemoved: { title: 'Demande en ami supprimé!', subTitle: 'Votre demande d\'ami a été supprimé avec succès!'},
  groupUpdated: { title: 'Groupe mis à jour!', subTitle: 'Ce groupe a été mis à jour avec succès!' },
  groupLeft: { title: 'Quitter le groupe', subTitle: 'Vous avez quitter ce groupe avec succès.' }
};

@Injectable()
export class AlertProvider {
  private alert;

  constructor(public alertCtrl: AlertController, public logoutProvider: LogoutProvider) {
    console.log("Initialisation du fournisseur d'alerter");
  }

  // Show profile updated
  showProfileUpdatedMessage() {
    this.alert = this.alertCtrl.create({
      title: successMessages.profileUpdated["title"],
      subTitle: successMessages.profileUpdated["subTitle"],
      buttons: ['OK']
    }).present();
  }

  // Show password reset sent
  showPasswordResetMessage(email) {
    this.alert = this.alertCtrl.create({
      title: successMessages.passwordResetSent["title"],
      subTitle: successMessages.passwordResetSent["subTitle"] + email,
      buttons: ['OK']
    }).present();
  }

  // Show email verified and redirect to homePage
  showEmailVerifiedMessageAndRedirect(navCtrl) {
    this.alert = this.alertCtrl.create({
      title: successMessages.emailVerified["title"],
      subTitle: successMessages.emailVerified["subTitle"],
      buttons: [{
        text: 'OK',
        handler: () => {
          navCtrl.setRoot(Login.homePage);
        }
      }]
    }).present();
  }

  // Show email verification sent
  showEmailVerificationSentMessage(email) {
    this.alert = this.alertCtrl.create({
      title: successMessages.emailVerificationSent["title"],
      subTitle: successMessages.emailVerificationSent["subTitle"] + email,
      buttons: ['OK']
    }).present();
  }

  // Show account deleted
  showAccountDeletedMessage() {
    this.alert = this.alertCtrl.create({
      title: successMessages.accountDeleted["title"],
      subTitle: successMessages.accountDeleted["subTitle"],
      buttons: ['OK']
    }).present();
  }

  // Show password changed
  showPasswordChangedMessage() {
    this.alert = this.alertCtrl.create({
      title: successMessages.passwordChanged["title"],
      subTitle: successMessages.passwordChanged["subTitle"],
      buttons: ['OK']
    }).present();
  }

  // Show friend request sent
  showFriendRequestSent() {
    this.alert = this.alertCtrl.create({
      title: successMessages.friendRequestSent["title"],
      subTitle: successMessages.friendRequestSent["subTitle"],
      buttons: ['OK']
    }).present();
  }

  // Show friend request removed
  showFriendRequestRemoved() {
    this.alert = this.alertCtrl.create({
      title: successMessages.friendRequestRemoved["title"],
      subTitle: successMessages.friendRequestRemoved["subTitle"],
      buttons: ['OK']
    }).present();
  }

  // Show group updated.
  showGroupUpdatedMessage() {
    this.alert = this.alertCtrl.create({
      title: successMessages.groupUpdated["title"],
      subTitle: successMessages.groupUpdated["subTitle"],
      buttons: ['OK']
    }).present();
  }

  // Show error messages depending on the code
  // If you added custom error codes on top, make sure to add a case block for it.
  showErrorMessage(code) {
    switch (code) {
      // Firebase Error Messages
      case 'auth/account-exists-with-different-credential':
        this.alert = this.alertCtrl.create({
          title: errorMessages.accountExistsWithDifferentCredential["title"],
          subTitle: errorMessages.accountExistsWithDifferentCredential["subTitle"],
          buttons: ['OK']
        }).present();
        break;
      case 'auth/invalid-credential':
        this.alert = this.alertCtrl.create({
          title: errorMessages.invalidCredential["title"],
          subTitle: errorMessages.invalidCredential["subTitle"],
          buttons: ['OK']
        }).present();
        break;
      case 'auth/operation-not-allowed':
        this.alert = this.alertCtrl.create({
          title: errorMessages.operationNotAllowed["title"],
          subTitle: errorMessages.operationNotAllowed["subTitle"],
          buttons: ['OK']
        }).present();
        break;
      case 'auth/user-disabled':
        this.alert = this.alertCtrl.create({
          title: errorMessages.userDisabled["title"],
          subTitle: errorMessages.userDisabled["subTitle"],
          buttons: ['OK']
        });
        this.alert.present();
        break;
      case 'auth/user-not-found':
        this.alert = this.alertCtrl.create({
          title: errorMessages.userNotFound["title"],
          subTitle: errorMessages.userNotFound["subTitle"],
          buttons: ['OK']
        }).present();
        break;
      case 'auth/wrong-password':
        this.alert = this.alertCtrl.create({
          title: errorMessages.wrongPassword["title"],
          subTitle: errorMessages.wrongPassword["subTitle"],
          buttons: ['OK']
        }).present();
        break;
      case 'auth/invalid-email':
        this.alert = this.alertCtrl.create({
          title: errorMessages.invalidEmail["title"],
          subTitle: errorMessages.invalidEmail["subTitle"],
          buttons: ['OK']
        }).present();
        break;
      case 'auth/email-already-in-use':
        this.alert = this.alertCtrl.create({
          title: errorMessages.emailAlreadyInUse["title"],
          subTitle: errorMessages.emailAlreadyInUse["subTitle"],
          buttons: ['OK']
        }).present();
        break;
      case 'auth/weak-password':
        this.alert = this.alertCtrl.create({
          title: errorMessages.weakPassword["title"],
          subTitle: errorMessages.weakPassword["subTitle"],
          buttons: ['OK']
        }).present();
        break;
      case 'auth/requires-recent-login':
        this.alert = this.alertCtrl.create({
          title: errorMessages.requiresRecentLogin["title"],
          subTitle: errorMessages.requiresRecentLogin["subTitle"],
          buttons: ['OK']
        }).present();
        break;
      case 'auth/user-mismatch':
        this.alert = this.alertCtrl.create({
          title: errorMessages.userMismatch["title"],
          subTitle: errorMessages.userMismatch["subTitle"],
          buttons: ['OK']
        }).present();
        break;
      case 'auth/provider-already-linked':
        this.alert = this.alertCtrl.create({
          title: errorMessages.providerAlreadyLinked["title"],
          subTitle: errorMessages.providerAlreadyLinked["subTitle"],
          buttons: ['OK']
        }).present();
        break;
      case 'auth/credential-already-in-use':
        this.alert = this.alertCtrl.create({
          title: errorMessages.credentialAlreadyInUse["title"],
          subTitle: errorMessages.credentialAlreadyInUse["subTitle"],
          buttons: ['OK']
        }).present();
        break;
      // Profile Error Messages
      case 'profile/error-change-name':
        this.alert = this.alertCtrl.create({
          title: errorMessages.changeName["title"],
          subTitle: errorMessages.changeName["subTitle"],
          buttons: ['OK']
        }).present();
        break;
      case 'profile/invalid-chars-name':
        this.alert = this.alertCtrl.create({
          title: errorMessages.invalidCharsName["title"],
          subTitle: errorMessages.invalidCharsName["subTitle"],
          buttons: ['OK']
        }).present();
        break;
      case 'profile/name-too-short':
        this.alert = this.alertCtrl.create({
          title: errorMessages.nameTooShort["title"],
          subTitle: errorMessages.nameTooShort["subTitle"],
          buttons: ['OK']
        }).present();
        break;
      case 'profile/error-change-email':
        this.alert = this.alertCtrl.create({
          title: errorMessages.changeEmail["title"],
          subTitle: errorMessages.changeEmail["subTitle"],
          buttons: ['OK']
        }).present();
        break;
      case 'profile/invalid-email':
        this.alert = this.alertCtrl.create({
          title: errorMessages.invalidProfileEmail["title"],
          subTitle: errorMessages.invalidProfileEmail["subTitle"],
          buttons: ['OK']
        }).present();
        break;
      case 'profile/error-change-photo':
        this.alert = this.alertCtrl.create({
          title: errorMessages.changePhoto["title"],
          subTitle: errorMessages.changePhoto["subTitle"],
          buttons: ['OK']
        }).present();
        break;
      case 'profile/password-too-short':
        this.alert = this.alertCtrl.create({
          title: errorMessages.passwordTooShort["title"],
          subTitle: errorMessages.passwordTooShort["subTitle"],
          buttons: ['OK']
        }).present();
        break;
      case 'profile/invalid-chars-password':
        this.alert = this.alertCtrl.create({
          title: errorMessages.invalidCharsPassword["title"],
          subTitle: errorMessages.invalidCharsPassword["subTitle"],
          buttons: ['OK']
        }).present();
        break;
      case 'profile/passwords-do-not-match':
        this.alert = this.alertCtrl.create({
          title: errorMessages.passwordsDoNotMatch["title"],
          subTitle: errorMessages.passwordsDoNotMatch["subTitle"],
          buttons: ['OK']
        }).present();
        break;
      case 'profile/error-update-profile':
        this.alert = this.alertCtrl.create({
          title: errorMessages.updateProfile["title"],
          subTitle: errorMessages.updateProfile["subTitle"],
          buttons: ['OK']
        }).present();
        break;
      case 'profile/error-same-username':
        this.alert = this.alertCtrl.create({
          title: errorMessages.usernameExists["title"],
          subTitle: errorMessages.usernameExists["subTitle"],
          buttons: ['OK']
        }).present();
        break;
      //Image Error Messages
      case 'image/error-image-upload':
        this.alert = this.alertCtrl.create({
          title: errorMessages.imageUpload["title"],
          subTitle: errorMessages.imageUpload["subTitle"],
          buttons: ['OK']
        }).present();
        break;
      // Group Error MEssages
      case 'group/error-update-group':
        this.alert = this.alertCtrl.create({
          title: errorMessages.groupUpdate["title"],
          subTitle: errorMessages.groupUpdate["subTitle"],
          buttons: ['OK']
        }).present();
        break;
      case 'group/error-leave-group':
        this.alert = this.alertCtrl.create({
          title: errorMessages.groupLeave["title"],
          subTitle: errorMessages.groupLeave["subTitle"],
          buttons: ['OK']
        }).present();
        break;
      case 'group/error-delete-group':
        this.alert = this.alertCtrl.create({
          title: errorMessages.groupDelete["title"],
          subTitle: errorMessages.groupDelete["subTitle"],
          buttons: ['OK']
        }).present();
        break;
    }
  }
}
