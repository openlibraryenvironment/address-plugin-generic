import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid';
import { AddressTextField } from '@folio/address-utils';

import backendToFields from './backendToFields';

class AddressFieldsGeneric extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    requiredValidator: PropTypes.func,
    savedAddress: PropTypes.shape({
      addressLabel: PropTypes.string,
      countryCode: PropTypes.string,
      id: PropTypes.string,
      lines: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.shape({
          value: PropTypes.string.isRequired
        }).isRequired,
        value: PropTypes.string.isRequired
      })),
    }),
    textFieldComponent: PropTypes.object
  };

  render() {
    const { name, requiredValidator, savedAddress, textFieldComponent } = this.props;
    const initialValues = backendToFields(savedAddress);
    return (
      <>
        <Row>
          <Col xs={6}>
            <AddressTextField
              name={name ? `${name}.department` : 'department'}
              label={<FormattedMessage id="ui-address-plugin-generic.department" />}
              component={textFieldComponent}
              initialValue={initialValues.department}
            />
          </Col>
          <Col xs={6}>
            <AddressTextField
              name={name ? `${name}.premise` : 'premise'}
              label={<FormattedMessage id="ui-address-plugin-generic.premise" />}
              component={textFieldComponent}
              initialValue={initialValues.premise}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <AddressTextField
              name={name ? `${name}.thoroughfare` : 'thoroughfare'}
              label={<FormattedMessage id="ui-address-plugin-generic.thoroughfare" />}
              component={textFieldComponent}
              required
              validator={requiredValidator}
              initialValue={initialValues.thoroughfare}
            />
          </Col>
          <Col xs={6}>
            <AddressTextField
              name={name ? `${name}.postalCodeOrTown` : 'postalCodeOrTown'}
              label={<FormattedMessage id="ui-address-plugin-generic.postalCodeOrTown" />}
              component={textFieldComponent}
              initialValue={initialValues.postalCodeOrTown}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <AddressTextField
              name={name ? `${name}.locality` : 'locality'}
              label={<FormattedMessage id="ui-address-plugin-generic.locality" />}
              component={textFieldComponent}
              required
              validator={requiredValidator}
              initialValue={initialValues.locality}
            />
          </Col>
          <Col xs={6}>
            <AddressTextField
              name={name ? `${name}.administrativeArea` : 'administrativeArea'}
              label={<FormattedMessage id="ui-address-plugin-generic.administrativeArea" />}
              component={textFieldComponent}
              required
              validator={requiredValidator}
              initialValue={initialValues.administrativeArea}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <AddressTextField
              name={name ? `${name}.postalCode` : 'postalCode'}
              label={<FormattedMessage id="ui-address-plugin-generic.postalCode" />}
              component={textFieldComponent}
              required
              validator={requiredValidator}
              initialValue={initialValues.postalCode}
            />
          </Col>
          <Col xs={4}>
            <AddressTextField
              name={name ? `${name}.postBox` : 'postBox'}
              label={<FormattedMessage id="ui-address-plugin-generic.postBox" />}
              component={textFieldComponent}
              required={false}
              initialValue={initialValues.postBox}
            />
          </Col>
          <Col xs={4}>
            <AddressTextField
              name={name ? `${name}.postOffice` : 'postOffice'}
              label={<FormattedMessage id="ui-address-plugin-generic.postOffice" />}
              component={textFieldComponent}
              required={false}
              initialValue={initialValues.postOffice}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <AddressTextField
              name={name ? `${name}.country` : 'country'}
              label={<FormattedMessage id="ui-address-plugin-generic.country" />}
              component={textFieldComponent}
              required
              validator={requiredValidator}
              initialValue={initialValues.country}
            />
          </Col>
        </Row>
      </>
    );
  }
}
export default AddressFieldsGeneric;
