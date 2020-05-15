import { getExistingLineField } from '@folio/address-utils';

const backendToFields = (address) => {
  const addressFields = {};

  const department = getExistingLineField(address.lines, 'department')?.value
  const premise = getExistingLineField(address.lines, 'premise')?.value
  const thoroughfare = getExistingLineField(address.lines, 'thoroughfare')?.value
  const postalCodeOrTown = getExistingLineField(address.lines, 'postalcodeortown')?.value
  const locality = getExistingLineField(address.lines, 'locality')?.value
  const administrativeArea = getExistingLineField(address.lines, 'administrativearea')?.value
  const postalCode = getExistingLineField(address.lines, 'postalcode')?.value
  const postBox = getExistingLineField(address.lines, 'postbox')?.value
  const postOffice = getExistingLineField(address.lines, 'postoffice')?.value
  const country = getExistingLineField(address.lines, 'country')?.value

  if (department) {
    addressFields.department = department;
  }
  if (premise) {
    addressFields.premise = premise;
  }
  if (thoroughfare) {
    addressFields.thoroughfare = thoroughfare;
  }
  if (postalCodeOrTown) {
    addressFields.postalCodeOrTown = postalCodeOrTown;
  }
  if (locality) {
    addressFields.locality = locality;
  }
  if (administrativeArea) {
    addressFields.administrativeArea = administrativeArea;
  }
  if (postalCode) {
    addressFields.postalCode = postalCode;
  }
  if (postBox) {
    addressFields.postBox = postBox;
  }
  if (postOffice) {
    addressFields.postOffice = postOffice;
  }
  if (country) {
    addressFields.country = country;
  }

  return addressFields;
}
export default backendToFields;