import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Col, Datepicker, Select, TextArea, TextField } from '@folio/stripes/components';

import { useSearchParams } from '../../../../../hooks';
import { LocationControl } from './controls/LocationControl';
import { PatronGroupControl } from './controls/PatronGroupControl';
import { StatusControl } from './controls/StatusControl';
import { LoanTypesControl } from './controls/LoanTypesControl';
import { HoldingNotesControl } from './controls/HoldingNotesControl';
import { ItemNotesControl } from './controls/ItemNotesControl';
import { InstanceNotesControl } from './controls/InstanceNotesControl';
import { DuplicateNoteControl } from './controls/DuplicateNotesControl';
import { ElectronicAccessRelationshipControl } from './controls/ElectronicAccessRelationshipControl';
import { InstanceStatisticalCodesControl } from './controls/InstanceStatisticalCodesControl';
import { BASE_DATE_FORMAT, CAPABILITIES, CONTROL_TYPES } from '../../../../../constants';
import { ActionParameters } from './controls/ActionParameters';
import { getActionsWithRules } from '../helpers';
import { sortAlphabeticallyComponentLabels } from '../../../../../utils/sortAlphabetically';

import css from '../../../BulkEditPane.css';

export const FolioFieldRenderer = memo(({
  field,
  item,
  option,
  path,
  ctx,
  allOptions,
  fields,
  onChange,
  onActionChange,
}) => {
  const { formatMessage } = useIntl();
  const { currentRecordType } = useSearchParams();

  const {
    name,
    type,
    options,
    showWhen,
    itemSchema,
    renderParameters,
    dirty,
  } = field;

  if (showWhen && !showWhen(ctx)) return null;

  const value = item[name];
  const fullPath = [...path, name];
  const isDirty = typeof dirty === 'function' ? dirty(value) : dirty;
  const controlType = typeof type === 'function' ? type({ ...ctx, option, recordType: currentRecordType }) : type;
  const actions = options?.({ ...ctx, option, allOptions, recordType: currentRecordType }) || [];
  const actionsWithRules = getActionsWithRules({
    row: ctx.row,
    option,
    actions,
    fields
  });
  const sortedActionsList = sortAlphabeticallyComponentLabels(actionsWithRules, formatMessage);

  const sharedProps = {
    value,
    path,
    name,
    onChange,
  };

  if (controlType === CONTROL_TYPES.ARRAY) {
    return value?.map((subItem, idx) => {
      if (!subItem) return null;

      return (
        <Fragment key={subItem.id}>
          {itemSchema.map((subField) => {
            return (
              <FolioFieldRenderer
                key={subField.name}
                option={option}
                field={subField}
                fields={fields}
                ctx={{ ...ctx, index: idx, parentArray: value }}
                onChange={onChange}
                onActionChange={onActionChange}
                item={subItem}
                allOptions={allOptions}
                path={[...fullPath, idx]}
              />
            );
          })}
        </Fragment>
      );
    });
  }

  return (
    <Col xs={field.colSize} sm={field.colSize} className={css.column}>
      {controlType === CONTROL_TYPES.ACTION && (
        <Select
          data-testid={`select-actions-${ctx.index}`}
          value={value}
          dataOptions={sortedActionsList}
          name={name}
          aria-label={formatMessage({ id: `ui-bulk-edit.layer.column.${name}` })}
          dirty={isDirty}
          marginBottom0
          fullWidth
          validStylesEnabled
          disabled={sortedActionsList.length === 1}
          onChange={e => onActionChange({ path, val: e.target.value, name, option, ctx })}
        />
      )}

      {controlType === CONTROL_TYPES.INPUT && (
        <TextField
          value={value}
          onChange={e => onChange({ path, val: e.target.value, name })}
          data-testid={`input-email-${path}`}
          aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.textField' })}
          marginBottom0
          dirty={!!value}
        />
      )}

      {controlType === CONTROL_TYPES.TEXTAREA && (
        <TextArea
          value={value}
          onChange={e => onChange({ path, val: e.target.value, name })}
          data-testid={`input-textarea-${path}`}
          aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.textArea' })}
          marginBottom0
          dirty={!!value}
          fullWidth
          lockWidth
        />
      )}

      {controlType === CONTROL_TYPES.DATE && (
        <Datepicker
          value={value}
          onChange={(e, _value, formattedValue) => {
            onChange({ path, val: formattedValue, name });
          }}
          data-testid={`dataPicker-experation-date-${ctx.index}`}
          backendDateStandard={BASE_DATE_FORMAT}
          aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.date' })}
          marginBottom0
          dirty={!!value}
        />
      )}

      {controlType === CONTROL_TYPES.LOCATION && (
        <LocationControl
          key={item.name}
          option={option}
          {...sharedProps}
        />
      )}

      {controlType === CONTROL_TYPES.PATRON_GROUP_SELECT && (
        <PatronGroupControl key={item.name} {...sharedProps} ctx={ctx} />
      )}

      {controlType === CONTROL_TYPES.STATUS_SELECT && (
        <StatusControl key={item.name} {...sharedProps} ctx={ctx} />
      )}

      {controlType === CONTROL_TYPES.LOAN_TYPE && (
        <LoanTypesControl key={item.name} {...sharedProps} />
      )}

      {controlType === CONTROL_TYPES.NOTE_SELECT && (
        <>
          {currentRecordType === CAPABILITIES.HOLDING && (
            <HoldingNotesControl
              key={item.name}
              option={option}
              parameters={ctx.row?.parameters}
              {...sharedProps}
            />
          )}
          {currentRecordType === CAPABILITIES.ITEM && (
            <ItemNotesControl
              key={item.name}
              option={option}
              parameters={ctx.row?.parameters}
              {...sharedProps}
            />
          )}
          {currentRecordType === CAPABILITIES.INSTANCE && (
            <InstanceNotesControl
              key={item.name}
              option={option}
              parameters={ctx.row?.parameters}
              {...sharedProps}
            />
          )}
        </>
      )}

      {controlType === CONTROL_TYPES.NOTE_DUPLICATE_SELECT && (
        <DuplicateNoteControl
          key={item.name}
          option={option}
          controlType={type}
          {...sharedProps}
        />
      )}

      {controlType === CONTROL_TYPES.ELECTRONIC_ACCESS_RELATIONSHIP_SELECT && (
        <ElectronicAccessRelationshipControl
          key={item.name}
          ctx={ctx}
          {...sharedProps}
        />
      )}

      {controlType === CONTROL_TYPES.STATISTICAL_CODES_SELECT && (
        <InstanceStatisticalCodesControl key={item.name} {...sharedProps} />
      )}

      {renderParameters && (
        <ActionParameters
          actionParameters={item.parameters}
          name="parameters"
          path={path}
          action={item.name}
          onChange={onChange}
        />
      )}
    </Col>
  );
});

FolioFieldRenderer.propTypes = {
  option: PropTypes.string.isRequired,
  allOptions: PropTypes.arrayOf(PropTypes.shape({})),
  fields: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    required: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    options: PropTypes.func,
    showWhen: PropTypes.func,
    itemSchema: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        type: PropTypes.string,
        required: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
      })
    ),
    maxLength: PropTypes.number,
    dirty: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    showError: PropTypes.bool,
    renderParameters: PropTypes.bool,
    colSize: PropTypes.number,
  }).isRequired,
  item: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    parameters: PropTypes.shape({}),
  }).isRequired,
  path: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  ctx: PropTypes.shape({
    index: PropTypes.number,
    parentArray: PropTypes.arrayOf(PropTypes.shape({})),
    row: PropTypes.shape({
      parameters: PropTypes.arrayOf(PropTypes.shape({})),
    }),
  }),
  errors: PropTypes.objectOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  onActionChange: PropTypes.func.isRequired,
};
