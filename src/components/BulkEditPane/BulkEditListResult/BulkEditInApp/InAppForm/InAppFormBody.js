import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { noop, uniqueId, get } from 'lodash';

import {
  IconButton,
  Col,
  Row,
  RepeatableField,
  Selection,
  StripesOverlayWrapper
} from '@folio/stripes/components';

import {
  folioFieldTemplate,
  getFieldsWithRules,
  getOptionsWithRules,
  getOptionType,
  getPreselectedValue
} from '../helpers';
import { customFilter, getTenantsById, groupByCategory, updateIn } from '../../../../../utils/helpers';
import { schema } from '../schema';
import { InAppFieldRenderer } from './InAppFieldRenderer';
import { getDefaultActionState, getNextActionState } from '../controlsConfig';

import css from '../../../BulkEditPane.css';

export const InAppFormBody = ({
  approach,
  disabled,
  fields,
  isNonInteractive,
  options,
  recordType,
  setFields,
}) => {
  const { formatMessage } = useIntl();

  const handleRemoveField = useCallback((e) => {
    const index = parseInt(e.currentTarget.dataset.rowIndex, 10);

    setFields(prevFields => prevFields.filter((_, i) => i !== index));
  }, [setFields]);

  const handleAddField = useCallback(() => {
    setFields(prevFields => [...prevFields, folioFieldTemplate(uniqueId())]);
  }, [setFields]);

  const handleOptionChange = useCallback(({ path, val: option }) => {
    const updatedField = updateIn(fields, path, (field) => {
      const optionType = getOptionType(option, options);
      const sourceOption = options.find(o => o.value === option);
      const parameters = sourceOption?.parameters;
      const tenants = getTenantsById(options, option) || [];
      const actionsDetails = getDefaultActionState(optionType, recordType);

      return {
        ...field,
        option,
        tenants,
        parameters,
        actionsDetails
      };
    });

    setFields(updatedField);
  }, [fields, options, recordType, setFields]);

  const handleActionChange = useCallback(({ path, val: action, name, option, ctx }) => {
    const [rowIndex, actionsDetails, actions] = path;

    const withUpdatedActionName = updateIn(fields, path, (currentAction) => ({
      ...currentAction,
      [name]: action,
      tenants: [], // reset tenants when action changes
      value: getPreselectedValue(option, action),
      // reset parameters values when action changes
      ...(currentAction.parameters ? { parameters: currentAction.parameters.map(param => ({ ...param, value: false })) } : {})
    }));

    // If this is the first action in the row, we need to update the next actions based on the selected values
    if (ctx.index === 0) {
      const optionType = getOptionType(option, options);
      const nextActions = getNextActionState(optionType, action);

      const withUpdatedNextActions = updateIn(withUpdatedActionName, [rowIndex, actionsDetails, actions], (actionsArr) => [
        actionsArr[0], // keep the first action as is
        ...nextActions
      ]);

      const withFiltrationRules = getFieldsWithRules({
        option,
        action,
        fields: withUpdatedNextActions,
        rowId: ctx.row.id,
      });

      setFields(withFiltrationRules);
    } else {
      // If this is not the first action, we just update the current action
      setFields(withUpdatedActionName);
    }
  }, [fields, setFields, options]);

  const handleValueChange = useCallback(({ path, val, tenants, resetNext }) => {
    const [rowIndex, actionsDetails, actions, actionIndex] = path;

    const withUpdatedActionValueAndTenants = updateIn(fields, path, (action) => ({
      ...action,
      tenants: tenants || [],
      value: val
    }));

    const pathToReset = [rowIndex, actionsDetails, actions, 1];
    const actionToReset = get(withUpdatedActionValueAndTenants, pathToReset);

    /**
     * If this is the first action in the row, resetNext is true and has a next action,
     * we need to reset the next action's value and tenants
     * as there can be conflicting values.
     */

    if (actionIndex === 0 && resetNext && actionToReset) {
      const withResetNexAction = updateIn(withUpdatedActionValueAndTenants, pathToReset, () => ({
        name: '',
        tenants: [],
        value: ''
      }));

      setFields(withResetNexAction);
    } else {
      setFields(withUpdatedActionValueAndTenants);
    }
  }, [fields, setFields]);

  return (
    <StripesOverlayWrapper>
      <RepeatableField
        getFieldUniqueKey={(field) => field.id}
        fields={fields}
        className={css.row}
        onAdd={noop}
        renderField={(item, index) => {
          const { filteredOptions, maxRowsCount } = getOptionsWithRules({
            fields,
            options,
            item,
          });

          const groupedOptions = groupByCategory(filteredOptions);
          const isAddButtonShown = index === fields.length - 1 && index !== maxRowsCount - 1;
          const isControlsDisabled = isNonInteractive || disabled;

          return (
            <Row
              data-testid={`row-${index}`}
              className={css.inAppFieldRow}
            >
              <Col xs={2} sm={2} className={css.column}>
                <Selection
                  dataOptions={groupedOptions}
                  value={item.option}
                  onChange={(value) => handleOptionChange({ path: [index], val: value })}
                  placeholder={formatMessage({ id: 'ui-bulk-edit.options.placeholder' })}
                  dirty={!!item.option}
                  ariaLabel={`select-option-${index}`}
                  marginBottom0
                  listMaxHeight="calc(45vh - 65px)" // 65px - for fixed header
                  onFilter={customFilter}
                  disabled={isControlsDisabled}
                />
              </Col>
              {item.actionsDetails && schema.map(field => (
                <InAppFieldRenderer
                  key={field.name}
                  option={item.option}
                  field={field}
                  fields={fields}
                  item={item.actionsDetails}
                  ctx={{ index, row: item }}
                  path={[index, 'actionsDetails']}
                  recordType={recordType}
                  approach={approach}
                  allOptions={options}
                  onChange={handleValueChange}
                  onActionChange={handleActionChange}
                  disabled={isControlsDisabled}
                />
              ))}

              {!isNonInteractive && (
                <div className={css.actionButtonsWrapper}>
                  {isAddButtonShown && (
                    <IconButton
                      icon="plus-sign"
                      size="medium"
                      onClick={handleAddField}
                      disabled={disabled}
                      data-testid={`add-button-${index}`}
                    />
                  )}
                  <IconButton
                    icon="trash"
                    data-row-index={index}
                    onClick={handleRemoveField}
                    disabled={fields.length === 1 || disabled}
                    data-testid={`remove-button-${index}`}
                  />
                </div>
              )}
            </Row>
          );
        }}
      />
    </StripesOverlayWrapper>
  );
};

InAppFormBody.propTypes = {
  approach: PropTypes.string,
  disabled: PropTypes.bool,
  fields: PropTypes.arrayOf(PropTypes.shape({})),
  isNonInteractive: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.shape({})),
  recordType: PropTypes.string,
  setFields: PropTypes.func,
};
