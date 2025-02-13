import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import noop from 'lodash/noop';
import uniqueId from 'lodash/uniqueId';

import {
  IconButton,
  Col,
  Row,
  RepeatableField,
  Selection,
  StripesOverlayWrapper
} from '@folio/stripes/components';

import { OPTIONS } from '../../../../../constants';
import { ActionsRow } from './ActionsRow';
import {
  ACTION_VALUE_KEY,
  FIELD_VALUE_KEY,
  getDefaultActions,
  isAddButtonShown,
  getFilteredFields,
  getExtraActions,
  getFieldTemplate,
  getFieldsWithRules,
  getNormalizedFieldsRules,
} from './helpers';
import {
  customFilter,
  getTenantsById,
  groupByCategory
} from '../../../../../utils/helpers';
import { useSearchParams } from '../../../../../hooks';
import css from '../../../BulkEditPane.css';

export const ContentUpdatesForm = ({ fields, setFields, options }) => {
  const { formatMessage } = useIntl();
  const { currentRecordType, approach } = useSearchParams();
  const normalizedFieldsRules = getNormalizedFieldsRules(fields);

  useEffect(() => {
    setFields([getFieldTemplate(options, currentRecordType, approach)]);
    // eslint-disable-next-line
  }, []);

  const handleOptionChange = (option, index, tenants = []) => {
    const mappedFields = fields.map((field, i) => {
      if (i === index) {
        const sourceOption = options.find(o => o.value === option);
        const parameters = sourceOption?.parameters;

        return {
          ...field,
          parameters,
          option,
          tenants,
          actionsDetails: getDefaultActions({
            capability: currentRecordType,
            option,
            options,
            approach,
          }),
        };
      }

      return field;
    });

    const recoveredFields = mappedFields.map(f => ({ ...f, options }));
    const finalizedFields = getFilteredFields(recoveredFields);

    setFields(finalizedFields);
  };

  const getMappedActions = ({
    field,
    value,
    fieldName,
    actionIndex,
    hasActionChanged,
    tenants
  }) => {
    return field.actionsDetails.actions.map((action, j) => {
      if (!action) return action; // if null, return this value to stay with the same arr length

      return j === actionIndex
        ? ({
          ...action,
          [fieldName]: value,
          ...((hasActionChanged) && { [FIELD_VALUE_KEY]: '' }),
          ...(tenants ? { tenants } : null) // clear field values if action changed
        })
        : action;
    });
  };

  const getWithExtraActions = ({
    field,
    value,
    actions,
    actionIndex,
    hasActionChanged,
  }) => {
    let finalActions = [...actions];
    const noNullActionIndex = finalActions[0] ? actionIndex : actionIndex - 1;

    if (hasActionChanged && noNullActionIndex === 0) { // only based on first action additional actions are shown
      const sourceOption = options.find(o => o.value === field.option);
      const optionType = sourceOption?.type;
      const option = optionType || field.option;
      const extraActions = getExtraActions(option, value);
      const firstAvailableAction = finalActions.find(Boolean);

      if (extraActions?.length) {
        finalActions = [firstAvailableAction, ...extraActions];
      } else {
        finalActions = [null, firstAvailableAction];
      }
    }

    return finalActions;
  };

  const handleChange = ({ rowIndex, actionIndex, value, fieldName, tenants = [], option }) => {
    const hasActionChanged = fieldName === ACTION_VALUE_KEY;

    const mappedFields = fields.map((field, i) => {
      if (i === rowIndex) {
        const hasValueChanged = fieldName === FIELD_VALUE_KEY && actionIndex === 0 && field.option === OPTIONS.ELECTRONIC_ACCESS_URL_RELATIONSHIP;

        const sharedArgs = {
          field,
          value,
          actionIndex,
          hasActionChanged,
          hasValueChanged,
          tenants
        };

        const mappedActions = getMappedActions({
          fieldName,
          ...sharedArgs,
        });

        const actions = getWithExtraActions({
          actions: mappedActions,
          ...sharedArgs,
        });

        if (hasValueChanged) {
          // Set name and value to empty line at index 1 in the actions array
          actions[1] = { ...actions[1], name: '', value: '' };
        }

        return {
          ...field,
          actionsDetails: {
            ...field.actionsDetails,
            actions,
          },
        };
      }

      return field;
    });

    // Check if there are rules should be applied based on if action changed and option value
    const fieldsWithRules = hasActionChanged
      ? getFieldsWithRules({ fields: mappedFields, option, rowIndex })
      : mappedFields;

    setFields(fieldsWithRules);
  };

  const handleRemove = (index) => {
    const filteredFields = fields.filter((_, i) => i !== index);
    const recoveredFields = filteredFields.map(f => ({ ...f, options }));
    const finalizedFields = getFilteredFields(recoveredFields);

    setFields(finalizedFields);
  };

  const handleAdd = () => {
    const filteredFields = getFilteredFields([...fields, {
      ...getFieldTemplate(options, currentRecordType, approach),
      id: uniqueId(),
      actionsDetails: {
        type: null,
        actions: [],
      },
      option: '',
    }]);

    const initializedFields = filteredFields.map((f, i) => {
      const option = '';

      return i === filteredFields.length - 1
        ? ({
          ...f,
          option,
          actionsDetails: getDefaultActions({
            capability: currentRecordType,
            option,
            options,
            approach,
          }),
        })
        : f;
    });

    const finalizedFields = getFilteredFields(initializedFields);

    setFields(finalizedFields);
  };

  return (
    <StripesOverlayWrapper>
      <RepeatableField
        getFieldUniqueKey={(field) => field.id}
        fields={fields}
        className={css.row}
        onAdd={noop}
        renderField={(field, index) => {
          const filteredOptions = field.options.filter(o => !o.hidden);

          return (
            <Row data-testid={`row-${index}`} className={css.marcFieldRow}>
              <Col xs={2} sm={2} className={css.column}>
                <Selection
                  dataOptions={groupByCategory(filteredOptions)}
                  value={field.option}
                  onChange={(value) => handleOptionChange(value, index, getTenantsById(field.options, value))}
                  placeholder={formatMessage({ id:'ui-bulk-edit.options.placeholder' })}
                  dirty={!!field.option}
                  ariaLabel={`select-option-${index}`}
                  marginBottom0
                  listMaxHeight="calc(45vh - 65px)" // 65px - for fixed header
                  onFilter={customFilter}
                />
              </Col>
              <ActionsRow
                fieldsRules={normalizedFieldsRules[index]}
                option={field.option}
                actions={field.actionsDetails.actions}
                onChange={(values) => handleChange({ ...values, rowIndex: index, option: field.option })}
              />
              <div className={css.actionButtonsWrapper}>
                {isAddButtonShown(index, fields, options) && (
                <IconButton
                  icon="plus-sign"
                  size="medium"
                  onClick={handleAdd}
                  data-testid={`add-button-${index}`}
                />
                )}
                <IconButton
                  icon="trash"
                  onClick={() => handleRemove(index)}
                  disabled={fields.length === 1}
                  data-testid={`remove-button-${index}`}
                />
              </div>
            </Row>
          );
        }}
      />
    </StripesOverlayWrapper>
  );
};

ContentUpdatesForm.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object),
  fields: PropTypes.arrayOf(PropTypes.object),
  setFields: PropTypes.func,
};
