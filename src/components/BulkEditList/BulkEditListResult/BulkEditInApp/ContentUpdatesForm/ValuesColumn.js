import React from 'react';
import { Col, Datepicker, Select, Selection, TextField, TextArea } from '@folio/stripes/components';
import { LocationLookup, LocationSelection } from '@folio/stripes/smart-components';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { BASE_DATE_FORMAT, CONTROL_TYPES, getItemStatusOptions } from '../../../../../constants';
import { FIELD_VALUE_KEY, TEMPORARY_LOCATIONS } from './helpers';
import { useLoanTypes, usePatronGroup } from '../../../../../hooks/api';

export const ValuesColumn = ({ action, actionIndex, onChange, option }) => {
  const { formatMessage } = useIntl();
  const { userGroups } = usePatronGroup();
  const { loanTypes, isLoanTypesLoading } = useLoanTypes();
  const statuses = getItemStatusOptions(formatMessage);

  const renderTextField = () => action.type === CONTROL_TYPES.INPUT && (
    <TextField
      value={action.value}
      onChange={e => onChange({ actionIndex, value: e.target.value, fieldName: FIELD_VALUE_KEY })}
      data-testid={`input-email-${actionIndex}`}
      aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.textField' })}
    />
  );

  const renderTextArea = () => action.type === CONTROL_TYPES.TEXTAREA && (
    <TextArea
      value={action.value}
      onChange={e => onChange({ actionIndex, value: e.target.value, fieldName: FIELD_VALUE_KEY })}
      data-testid={`input-textarea-${actionIndex}`}
      aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.textArea' })}
    />
  );

  const renderPatronGroupSelect = () => {
    const patronGroups = Object.values(userGroups).reduce(
      (acc, { id, group, desc }) => {
        const description = desc ? `(${desc})` : '';
        const groupObject = {
          value: id,
          label: `${group} ${description}`,
        };

        acc.push(groupObject);

        return acc;
      },
      [
        {
          value: '',
          label: formatMessage({ id: 'ui-bulk-edit.layer.selectPatronGroup' }),
        },
      ],
    );

    return action.type === CONTROL_TYPES.PATRON_GROUP_SELECT && (
      <Select
        dataOptions={patronGroups}
        value={action.value}
        onChange={e => onChange({ actionIndex, value: e.target.value, fieldName: FIELD_VALUE_KEY })}
        data-testid={`select-patronGroup-${actionIndex}`}
        aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.patronGroupSelect' })}
      />
    );
  };

  const renderDatepicker = () => action.type === CONTROL_TYPES.DATE && (
    <Datepicker
      value={action.value}
      onChange={(e, value, formattedValue) => {
        onChange({ actionIndex, value: formattedValue, fieldName: FIELD_VALUE_KEY });
      }}
      data-testid={`dataPicker-experation-date-${actionIndex}`}
      backendDateStandard={BASE_DATE_FORMAT}
      aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.date' })}
    />
  );

  const renderLocationSelect = () => action.type === CONTROL_TYPES.LOCATION && (
    <>
      <LocationSelection
        value={action.value}
        onSelect={location => onChange({ actionIndex, value: location.id, fieldName: FIELD_VALUE_KEY })}
        placeholder={formatMessage({ id: 'ui-bulk-edit.layer.selectLocation' })}
        data-test-id={`textField-${actionIndex}`}
        aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.location' })}
      />
      <LocationLookup
        marginBottom0
        isTemporaryLocation={TEMPORARY_LOCATIONS.includes(option)}
        onLocationSelected={(location) => onChange({
          actionIndex, value: location.id, fieldName: FIELD_VALUE_KEY,
        })}
        data-testid={`locationLookup-${actionIndex}`}
      />
    </>
  );

  const renderStatusSelect = () => action.type === CONTROL_TYPES.STATUS_SELECT && (
    <Select
      dataOptions={statuses}
      value={action.value}
      onChange={e => onChange({ actionIndex, value: e.target.value, fieldName: FIELD_VALUE_KEY })}
      data-testid={`select-statuses-${actionIndex}`}
      aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.statusSelect' })}
    />
  );

  const renderLoanTypeSelect = () => action.type === CONTROL_TYPES.LOAN_TYPE && (
    <Selection
      id="loanType"
      value={action.value}
      loading={isLoanTypesLoading}
      onChange={value => onChange({ actionIndex, value, fieldName: FIELD_VALUE_KEY })}
      placeholder={formatMessage({ id: 'ui-bulk-edit.layer.selectLoanType' })}
      dataOptions={loanTypes}
      aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.loanTypeSelect' })}
    />
  );

  return (
    <Col xs={2} sm={2}>
      {renderTextField()}
      {renderTextArea()}
      {renderPatronGroupSelect()}
      {renderDatepicker()}
      {renderLocationSelect()}
      {renderStatusSelect()}
      {renderLoanTypeSelect()}
    </Col>
  );
};

ValuesColumn.propTypes = {
  option: PropTypes.string,
  action: PropTypes.shape({
    type: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
  }),
  actionIndex: PropTypes.number,
  onChange: PropTypes.func,
};
