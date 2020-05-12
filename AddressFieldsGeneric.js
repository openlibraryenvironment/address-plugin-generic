import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Row, Col } from '@folio/stripes/components';
import { AddressTextField } from '@folio/address-utils';

import backendToFields from './backendToFields';

class AddressFieldsGeneric extends React.Component {
  render() {
    const { name, requiredValidator, savedAddress, textFieldComponent } = this.props;
    const initialValues = backendToFields(savedAddress);
    return (
      <> 
        <Row>
          <Col xs={6} >
            <AddressTextField
              name={name ? `${name}.department` : "department"}
              label={<FormattedMessage id="ui-address-plugin-generic.department" />}
              component={textFieldComponent}
              initialValue={initialValues.department}
            />
          </Col>
          <Col xs={6} >
            <AddressTextField
              name={name ? `${name}.premise` : "premise"}
              label={<FormattedMessage id="ui-address-plugin-generic.premise" />}
              component={textFieldComponent}
              initialValue={initialValues.premise}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6} >
            <AddressTextField
              name={name ? `${name}.thoroughfare` : "thoroughfare"}
              label={<FormattedMessage id="ui-address-plugin-generic.thoroughfare" />}
              component={textFieldComponent}
              required={true}
              validator={requiredValidator}
              initialValue={initialValues.thoroughfare}
            />
          </Col>
          <Col xs={6} >
            <AddressTextField
              name={name ? `${name}.postalCodeOrTown` : "postalCodeOrTown"}
              label={<FormattedMessage id="ui-address-plugin-generic.postalCodeOrTown" />}
              component={textFieldComponent}
              initialValue={initialValues.postalCodeOrTown}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <AddressTextField
              name={name ? `${name}.locality` : "locality"}
              label={<FormattedMessage id="ui-address-plugin-generic.locality" />}
              component={textFieldComponent}
              required={true}
              validator={requiredValidator}
              initialValue={initialValues.locality}
            />
          </Col>
          <Col xs={6}>
            <AddressTextField
              name={name ? `${name}.administrativeArea` : "administrativeArea"}
              label={<FormattedMessage id="ui-address-plugin-generic.administrativeArea" />}
              component={textFieldComponent}
              required={true}
              validator={requiredValidator}
              initialValue={initialValues.administrativeArea}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <AddressTextField
              name={name ? `${name}.postalCode` : "postalCode"}
              label={<FormattedMessage id="ui-address-plugin-generic.postalCode" />}
              component={textFieldComponent}
              required={true}
              validator={requiredValidator}
              initialValue={initialValues.postalCode}
            />
          </Col>
          <Col xs={4}>
            <AddressTextField
              name={name ? `${name}.postBox` : "postBox"}
              label={<FormattedMessage id="ui-address-plugin-generic.postBox" />}
              component={textFieldComponent}
              required={false}
              initialValue={initialValues.postBox}
            />
          </Col>
          <Col xs={4}>
            <AddressTextField
              name={name ? `${name}.postOffice` : "postOffice"}
              label={<FormattedMessage id="ui-address-plugin-generic.postOffice" />}
              component={textFieldComponent}
              required={false}
              initialValue={initialValues.postOffice}
            />
          </Col>
        </Row>
      </>
    );
  }
}
export default AddressFieldsGeneric;
