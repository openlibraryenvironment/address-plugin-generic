import { deleteFieldIfExists, getExistingLineField } from '@folio/address-utils';

const fieldsToBackend = (address) => {
  const addressId = address.id || null;
  const countryCode = address.countryCode || null;
  const newAddress = {};
  let lines = [];

  if (address.department) {
    const id = getExistingLineField(address.lines, 'department')?.id;
    lines.push({ type: { value: 'Department' }, value: address.department, id });
  } else {
    lines.push(deleteFieldIfExists(address.lines, 'department'));
  }
  if (address.premise) {
    const id = getExistingLineField(address.lines, 'premise')?.id;
    lines.push({ type: { value: 'Premise' }, value: address.premise, id });
  } else {
    lines.push(deleteFieldIfExists(address.lines, 'premise'));
  }
  if (address.thoroughfare) {
    const id = getExistingLineField(address.lines, 'thoroughfare')?.id;
    lines.push({ type: { value: 'Thoroughfare' }, value: address.thoroughfare, id });
  }
  if (address.postalCodeOrTown) {
    const id = getExistingLineField(address.lines, 'postalcodeortown')?.id;
    lines.push({ type: { value: 'PostalCodeOrTown' }, value: address.postalCodeOrTown, id });
  } else {
    lines.push(deleteFieldIfExists(address.lines, 'postalcodeortown'));
  }
  if (address.locality) {
    const id = getExistingLineField(address.lines, 'locality')?.id;
    lines.push({ type: { value: 'Locality' }, value: address.locality, id });
  }
  if (address.administrativeArea) {
    const id = getExistingLineField(address.lines, 'administrativearea')?.id;
    lines.push({ type: { value: 'AdministrativeArea' }, value: address.administrativeArea, id });
  }
  if (address.postalCode) {
    const id = getExistingLineField(address.lines, 'postalcode')?.id;
    lines.push({ type: { value: 'PostalCode' }, value: address.postalCode, id });
  }
  if (address.postBox) {
    const id = getExistingLineField(address.lines, 'postbox')?.id;
    lines.push({ type: { value: 'PostBox' }, value: address.postBox, id });
  } else {
    lines.push(deleteFieldIfExists(address.lines, 'postbox'));
  }
  if (address.postOffice) {
    const id = getExistingLineField(address.lines, 'postoffice')?.id;
    lines.push({ type: { value: 'PostOffice' }, value: address.postOffice, id });
  } else {
    lines.push(deleteFieldIfExists(address.lines, 'postoffice'));
  }
  if (address.country) {
    const id = getExistingLineField(address.lines, 'country')?.id;
    lines.push({ type: { value: 'Country' }, value: address.country, id });
  }

  lines = lines.filter(line => (line !== null));
  newAddress.addressLabel = address.addressLabel;
  newAddress.lines = lines;
  newAddress.id = addressId;
  newAddress.countryCode = countryCode;
  return newAddress;
};

export default fieldsToBackend;
