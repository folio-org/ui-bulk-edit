import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { Col, InfoPopover, Select, TextArea, TextField } from '@folio/stripes/components';

import { CONTROL_TYPES } from '../../../../../constants';

import css from '../../../BulkEditPane.css';
import { getOverridesByKey, pathArrayToString } from '../helpers';

const popoverMap = {
  'ui-bulk-edit.layer.marc.error.protected' : (
    <InfoPopover
      iconSize="medium"
      content={<FormattedMessage id="ui-bulk-edit.layer.marc.error.protected" />}
    />
  )
};

export const MarcFieldRenderer = memo(({
  field,
  item,
  rootPath,
  ctx,
  errors,
  onChange,
  onFocus,
  onBlur,
  onActionChange,
}) => {
  const { formatMessage } = useIntl();

  const updatedField = item.key ? { ...field, ...getOverridesByKey(item.key) } : field;

  const {
    name,
    type,
    required,
    disabled,
    options,
    showWhen,
    className,
    itemSchema,
    maxLength,
    dirty,
    showError,
  } = updatedField;

  if (showWhen && !showWhen(item, ctx)) return null;

  const value = item[name];
  const fullPath = [...rootPath, name];
  const fullPathString = pathArrayToString(fullPath);

  const errorMessageId = errors[fullPathString];
  const errorMessage = errorMessageId ? formatMessage({ id: errorMessageId }) : '';

  const isDisabled = typeof disabled === 'function' ? disabled(ctx) : disabled;
  const isDirty = typeof dirty === 'function' ? dirty(value) : dirty;
  const isRequired = typeof required === 'function' ? required(ctx) : required;
  const dataOptions = options?.(ctx);
  const ariaLabel = formatMessage({ id: `ui-bulk-edit.layer.column.${name}` });
  const error = showError && value.length === maxLength && errorMessage;

  const commonProps = {
    value,
    name,
    required,
    error,
    'aria-label': ariaLabel,
    dirty: isDirty,
    disabled: isDisabled,
    marginBottom0: true,
    warning: isRequired && !!errorMessageId,
  };

  if (type === CONTROL_TYPES.ARRAY) {
    return value.map((subItem, idx) => (
      <Fragment key={subItem.id}>
        {itemSchema.map((subField) => {
          return (
            <MarcFieldRenderer
              key={subField.name}
              field={subField}
              ctx={{ index: idx, parentArray: value }}
              onChange={onChange}
              onActionChange={onActionChange}
              onFocus={onFocus}
              onBlur={onBlur}
              item={subItem}
              errors={errors}
              rootPath={[...fullPath, idx]}
            />
          );
        })}
      </Fragment>
    ));
  }

  return (
    <Col className={`${css.column} ${css[className]} ${item.margin && css.margin}`}>
      {type === CONTROL_TYPES.INPUT && (
        <TextField
          {...commonProps}
          maxLength={maxLength}
          placeholder=""
          data-testid={`${name}-${ctx.index}`}
          hasClearIcon={false}
          onChange={e => onChange({ path: rootPath, val: e.target.value, key: item.key, name })}
          onBlur={e => onBlur({ path: rootPath, val: e.target.value, name, event: e })}
          onFocus={e => onFocus({ path: rootPath, val: e.target.value, name, event: e })}
        />
      )}

      {type === CONTROL_TYPES.TEXTAREA && (
        <TextArea
          {...commonProps}
          fullWidth
          lockWidth
          validStylesEnabled
          placeholder=""
          hasClearIcon={false}
          onChange={e => onChange({ path: rootPath, val: e.target.value, key: item.key, name })}
        />
      )}

      {type === CONTROL_TYPES.SELECT_MENU && (
        <Select
          {...commonProps}
          dataOptions={dataOptions}
          fullWidth
          validStylesEnabled
          onChange={e => onActionChange({ path: rootPath, val: e.target.value, name })}
        />
      )}

      {popoverMap[errorMessageId]}

      {isRequired && <span className={css.asterisk} aria-hidden>*</span>}
    </Col>
  );
});

MarcFieldRenderer.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    required: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    options: PropTypes.func,
    showWhen: PropTypes.func,
    className: PropTypes.string,
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
  }).isRequired,
  item: PropTypes.shape({
    key: PropTypes.string,
    margin: PropTypes.bool,
  }).isRequired,
  rootPath: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
  ctx: PropTypes.shape({
    index: PropTypes.number,
    parentArray: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  errors: PropTypes.objectOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onActionChange: PropTypes.func.isRequired,
};
