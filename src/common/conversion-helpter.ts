export default class ConversionHelper {
  static convertStringToDate(dateString: string): Date {
    return new Date(dateString);
  }

  static convertToInt(stringValue: string | undefined) {
    if (stringValue != undefined) {
      return parseInt(stringValue);
    }

    return 0;
  }
}
