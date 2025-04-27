export default class ConversionHelper {
  static convertStringToDate(dateString: string): Date {
    return new Date(dateString);
  }
}
