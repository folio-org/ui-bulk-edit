import React from 'react';
import { Col, Datepicker, Select, Selection, TextField, TextArea } from '@folio/stripes/components';
import { LocationLookup, LocationSelection } from '@folio/stripes/smart-components';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import {
  BASE_DATE_FORMAT,
  CAPABILITIES,
  CONTROL_TYPES,
  getItemStatusOptions,
  getNotesOptions,
} from '../../../../../constants';
import { FIELD_VALUE_KEY, TEMPORARY_LOCATIONS } from './helpers';
import { useLoanTypes, usePatronGroup } from '../../../../../hooks/api';
import { useItemNotes } from '../../../../../hooks/api/useItemNotes';

export const ValuesColumn = ({ action, actionIndex, onChange, option }) => {
  const { formatMessage } = useIntl();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const capability = search.get('capabilities');

  const isUserCapability = capability === CAPABILITIES.USER;
  const isItemCapability = capability === CAPABILITIES.ITEM;

  const { userGroups } = usePatronGroup({ enabled: isUserCapability });
  const { loanTypes, isLoanTypesLoading } = useLoanTypes({ enabled: isItemCapability });
  const { itemNotes, usItemNotesLoading } = useItemNotes({ enabled: isItemCapability });

  const filteredAndMappedNotes = getNotesOptions(formatMessage, itemNotes)
    .filter(obj => obj.value !== option)
    .map(({ label, value }) => ({ label, value }));
  const sortWithoutPlaceholder = (array) => {
    const [placeholder, ...rest] = array;

    return [placeholder, ...rest.sort((a, b) => a.label.localeCompare(b.label))];
  };

  const sortedNotes = sortWithoutPlaceholder(filteredAndMappedNotes);

  const statuses = getItemStatusOptions(formatMessage);
  const actionValue = action.value;
  const controlType = action.controlType(action.name);

  const renderTextField = () => controlType === CONTROL_TYPES.INPUT && (
    <TextField
      value={actionValue}
      onChange={e => onChange({ actionIndex, value: e.target.value, fieldName: FIELD_VALUE_KEY })}
      data-testid={`input-email-${actionIndex}`}
      aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.textField' })}
    />
  );

  const renderTextArea = () => controlType === CONTROL_TYPES.TEXTAREA && (
    <TextArea
      value={actionValue}
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

    return controlType === CONTROL_TYPES.PATRON_GROUP_SELECT && (
      <Select
        dataOptions={patronGroups}
        value={actionValue}
        onChange={e => onChange({ actionIndex, value: e.target.value, fieldName: FIELD_VALUE_KEY })}
        data-testid={`select-patronGroup-${actionIndex}`}
        aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.patronGroupSelect' })}
      />
    );
  };

  const renderDatepicker = () => controlType === CONTROL_TYPES.DATE && (
    <Datepicker
      value={actionValue}
      onChange={(e, value, formattedValue) => {
        onChange({ actionIndex, value: formattedValue, fieldName: FIELD_VALUE_KEY });
      }}
      data-testid={`dataPicker-experation-date-${actionIndex}`}
      backendDateStandard={BASE_DATE_FORMAT}
      aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.date' })}
    />
  );

  const renderLocationSelect = () => controlType === CONTROL_TYPES.LOCATION && (
    <>
      <LocationSelection
        value={actionValue}
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

  const renderStatusSelect = () => controlType === CONTROL_TYPES.STATUS_SELECT && (
    <Select
      dataOptions={statuses}
      value={actionValue}
      onChange={e => onChange({ actionIndex, value: e.target.value, fieldName: FIELD_VALUE_KEY })}
      data-testid={`select-statuses-${actionIndex}`}
      aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.statusSelect' })}
    />
  );

  const renderLoanTypeSelect = () => controlType === CONTROL_TYPES.LOAN_TYPE && (
    <Selection
      id="loanType"
      value={actionValue}
      loading={isLoanTypesLoading}
      onChange={value => onChange({ actionIndex, value, fieldName: FIELD_VALUE_KEY })}
      placeholder={formatMessage({ id: 'ui-bulk-edit.layer.selectLoanType' })}
      dataOptions={loanTypes}
      aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.loanTypeSelect' })}
    />
  );

  const renderNoteTypeSelect = () => controlType === CONTROL_TYPES.NOTE_SELECT && (
    <Select
      id="noteType"
      value={action.value}
      loading={usItemNotesLoading}
      onChange={e => onChange({ actionIndex, value: e.target.value, fieldName: FIELD_VALUE_KEY })}
      dataOptions={sortedNotes}
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
      {renderNoteTypeSelect()}
    </Col>
  );
};

ValuesColumn.propTypes = {
  option: PropTypes.string,
  action: PropTypes.shape({
    controlType: PropTypes.func,
    name: PropTypes.string,
    value: PropTypes.string,
  }),
  actionIndex: PropTypes.number,
  onChange: PropTypes.func,
};
