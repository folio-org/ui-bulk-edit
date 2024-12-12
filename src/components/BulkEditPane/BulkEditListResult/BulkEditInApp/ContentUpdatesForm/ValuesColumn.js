import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Datepicker,
  TextField,
  TextArea,
} from '@folio/stripes/components';

import {
  BASE_DATE_FORMAT,
  CAPABILITIES,
  CONTROL_TYPES,
} from '../../../../../constants';
import { FIELD_VALUE_KEY } from './helpers';
import {
  useSearchParams,
  usePathParams
} from '../../../../../hooks';
import { PatronGroupControl } from './controls/PatronGroupControl';
import { LocationControl } from './controls/LocationControl';
import { LoanTypesControl } from './controls/LoanTypesControl';
import { ItemNotesControl } from './controls/ItemNotesControl';
import { HoldingNotesControl } from './controls/HoldingNotesControl';
import { InstanceNotesControl } from './controls/InstanceNotesControl';
import { ElectronicAccessRelationshipControl } from './controls/ElectronicAccessRelationshipControl';
import { DuplicateNoteControl } from './controls/DuplicateNotesControl';
import { StatusControl } from './controls/StatusControl';
import { InstanceStatisticalCodesControl } from './controls/InstanceStatisticalCodesControl';


export const ValuesColumn = ({ action, allActions, actionIndex, onChange, option }) => {
  const { formatMessage } = useIntl();
  const { currentRecordType } = useSearchParams();
  const { id: bulkOperationId } = usePathParams('/bulk-edit/:id');
  const controlType = action.controlType(action.name);

  const isItemCapability = currentRecordType === CAPABILITIES.ITEM;
  const isHoldingsCapability = currentRecordType === CAPABILITIES.HOLDING;
  const isInstanceCapability = currentRecordType === CAPABILITIES.INSTANCE;

  const sharedProps = {
    actionValue: action.value,
    actionIndex,
    onChange,
  };

  const renderTextField = () => controlType === CONTROL_TYPES.INPUT && (
    <TextField
      value={action.value}
      onChange={e => onChange({ actionIndex, value: e.target.value, fieldName: FIELD_VALUE_KEY })}
      data-testid={`input-email-${actionIndex}`}
      aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.textField' })}
      marginBottom0
      dirty={!!action.value}
    />
  );

  const renderTextArea = () => controlType === CONTROL_TYPES.TEXTAREA && (
    <TextArea
      value={action.value}
      onChange={e => onChange({ actionIndex, value: e.target.value, fieldName: FIELD_VALUE_KEY })}
      data-testid={`input-textarea-${actionIndex}`}
      aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.textArea' })}
      marginBottom0
      dirty={!!action.value}
      fullWidth
      lockWidth
    />
  );

  const renderPatronGroupSelect = () => controlType === CONTROL_TYPES.PATRON_GROUP_SELECT && (
    <PatronGroupControl {...sharedProps} />
  );

  const renderDatepicker = () => controlType === CONTROL_TYPES.DATE && (
    <Datepicker
      value={action.value}
      onChange={(e, value, formattedValue) => {
        onChange({ actionIndex, value: formattedValue, fieldName: FIELD_VALUE_KEY });
      }}
      data-testid={`dataPicker-experation-date-${actionIndex}`}
      backendDateStandard={BASE_DATE_FORMAT}
      aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.date' })}
      marginBottom0
      dirty={!!action.value}
    />
  );

  const renderLocationSelect = () => (
    controlType === CONTROL_TYPES.LOCATION && (
      <LocationControl
        bulkOperationId={bulkOperationId}
        option={option}
        {...sharedProps}
      />
    )
  );

  const renderStatusSelect = () => controlType === CONTROL_TYPES.STATUS_SELECT && (
    <StatusControl {...sharedProps} />
  );

  const renderLoanTypeSelect = () => controlType === CONTROL_TYPES.LOAN_TYPE && (
    <LoanTypesControl
      bulkOperationId={bulkOperationId}
      {...sharedProps}
    />
  );

  const renderNoteTypeSelect = () => controlType === CONTROL_TYPES.NOTE_SELECT && (
    <>
      {isHoldingsCapability && (
        <HoldingNotesControl
          bulkOperationId={bulkOperationId}
          option={option}
          {...sharedProps}
        />
      )}
      {isItemCapability && (
        <ItemNotesControl
          bulkOperationId={bulkOperationId}
          option={option}
          {...sharedProps}
        />
      )}
      {isInstanceCapability && (
        <InstanceNotesControl
          option={option}
          {...sharedProps}
        />
      )}
    </>
  );

  const renderNoteDuplicateTypeSelect = () => controlType === CONTROL_TYPES.NOTE_DUPLICATE_SELECT && (
    <DuplicateNoteControl
      option={option}
      action={action}
      actionIndex={actionIndex}
      onChange={onChange}
    />
  );

  const renderElectronicAccessRelationshipSelect = () => controlType === CONTROL_TYPES.ELECTRONIC_ACCESS_RELATIONSHIP_SELECT && (
    <ElectronicAccessRelationshipControl
      bulkOperationId={bulkOperationId}
      allActions={allActions}
      {...sharedProps}
    />
  );

  const renderStatisticalCodesSelect = () => controlType === CONTROL_TYPES.STATISTICAL_CODES_SELECT && (
    <InstanceStatisticalCodesControl
      actionName={action.name}
      {...sharedProps}
    />
  );

  return (
    <>
      {renderTextField()}
      {renderTextArea()}
      {renderPatronGroupSelect()}
      {renderDatepicker()}
      {renderLocationSelect()}
      {renderStatusSelect()}
      {renderLoanTypeSelect()}
      {renderNoteTypeSelect()}
      {renderNoteDuplicateTypeSelect()}
      {renderElectronicAccessRelationshipSelect()}
      {renderStatisticalCodesSelect()}
    </>
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
  allActions: PropTypes.arrayOf(PropTypes.shape({
    controlType: PropTypes.func,
    name: PropTypes.string,
    value: PropTypes.string,
  })),
  onChange: PropTypes.func,
};
