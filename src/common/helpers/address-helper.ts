import Clinic from '../../app/donation/shared/clinic.model';

export default class AddressHelper {
  static getClinicAddress(clinic: Clinic) {
    ` ${
      clinic?.addressLine2
        ? clinic?.addressLine1 + ' ' + clinic?.addressLine2
        : clinic?.addressLine1
    }, 
    ${clinic?.city}, 
    ${clinic?.state}   
    ${clinic?.postalCode} 
    ${clinic?.country}`;
  }
}
