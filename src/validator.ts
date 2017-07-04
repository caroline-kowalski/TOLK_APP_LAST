// Validators
// This file contains all your validators for the formGroups and for inputPrompts.
// Patterns can be tested by using a RegEx validator such as http://www.regexpal.com, https://regex101.com, among others.

import { Validators } from '@angular/forms';

export namespace Validator {
  // Set your validators here, don't forget to import and use them in the appropriate class that uses formGroups.
  // In this example, they are used on LoginPage where a formGroup for email and passwords is used.
  export const emailValidator = ['', [
    Validators.minLength(5),
    Validators.required,
    Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$')]
  ];
  export const passwordValidator = ['', [
    Validators.minLength(5),
    Validators.required,
    Validators.pattern('^[a-zA-Z0-9!@#$%^&*()_+-=]*$')]
  ];
  // Set your prompt input validators here, don't forget to import and use them on the AlertController prompt.
  // In this example they are used by home.ts where the user are allowed to change their profile.
  // errorMessages are used by the AlertProvider class and is imported inside AlertProvider.errorMessages which is used by showErrorMessage().
  export const profileNameValidator = {
    minLength: 5,
    lengthError: { title: 'Nom trop court!', subTitle: 'Votre nom doit avoir plus de quatre caractères.' },
    pattern: /^[a-zA-Z0-9\s]*$/g,
    patternError: { title: 'Nom invalide!', subTitle: 'Votre nom ne doit pas contenir de caractères spéciaux.' }
  };
  export const profileEmailValidator = {
    pattern: /^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$/g,
    patternError: { title: 'Email invalide!', subTitle: 'Votre email est invalide.' }
  };
  export const profilePasswordValidator = {
    minLength: 5,
    lengthError: { title: 'Mot de passe trop court!', subTitle: 'Votre mot de passe doit contenir plus de quatre caractères.' },
    pattern: /^[a-zA-Z0-9!@#$%^&*()_+-=]*$/g,
    patternError: { title: 'Mot de passe invalide!', subTitle: 'Votre mot de passe ne doit pas contenir de caractères spéciaux.' }
  };
  // Group Form Validators
  export const groupNameValidator = ['', [Validators.required, Validators.minLength(1)]];
  export const groupDescriptionValidator = ['', [Validators.required, Validators.minLength(1)]];
}
