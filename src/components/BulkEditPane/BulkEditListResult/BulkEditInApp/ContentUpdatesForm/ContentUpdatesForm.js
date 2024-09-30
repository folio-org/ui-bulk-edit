import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import noop from 'lodash/noop';
import uniqueId from 'lodash/uniqueId';

import {
  IconButton,
  Col,
  Row,
  RepeatableField,
  Selection,
} from '@folio/stripes/components';

import {
  ACTIONS,
  OPTIONS
} from '../../../../../constants';
import css from '../../../BulkEditPane.css';
import { ActionsRow } from './ActionsRow';
import {
  ACTION_VALUE_KEY,
  FIELD_VALUE_KEY,
  getDefaultActions,
  isAddButtonShown,
  getFilteredFields,
  getExtraActions,
} from './helpers';
import {
  customFilter,
  getTenantsById,
  groupByCategory
} from '../../../../../utils/helpers';
import { useSearchParams } from '../../../../../hooks';

export const ContentUpdatesForm = ({
  onContentUpdatesChanged,
  options,
  fields,
  setFields,
  fieldTemplate,
}) => {
  const { formatMessage } = useIntl();
  const {
    currentRecordType,
  } = useSearchParams();

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
            formatMessage
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
      const extraActions = getExtraActions(option, value, formatMessage);
      const firstAvailableAction = finalActions.find(Boolean);

      if (extraActions?.length) {
        finalActions = [firstAvailableAction, ...extraActions];
      } else {
        finalActions = [null, firstAvailableAction];
      }
    }

    return finalActions;
  };

  const handleChange = ({ rowIndex, actionIndex, value, fieldName, tenants = [] }) => {
    setFields(fieldsArr => fieldsArr.map((field, i) => {
      if (i === rowIndex) {
        const hasActionChanged = fieldName === ACTION_VALUE_KEY;
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
    }));
  };

  const handleRemove = (index) => {
    const filteredFields = fields.filter((_, i) => i !== index);
    const recoveredFields = filteredFields.map(f => ({ ...f, options }));
    const finalizedFields = getFilteredFields(recoveredFields);

    setFields(finalizedFields);
  };

  const handleAdd = () => {
    const filteredFields = getFilteredFields([...fields, {
      ...fieldTemplate,
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
            formatMessage
          }),
        })
        : f;
    });

    const finalizedFields = getFilteredFields(initializedFields);

    setFields(finalizedFields);
  };

  useEffect(() => {
    const mappedContentUpdates = fields.map(
      // eslint-disable-next-line no-shadow
      ({ parameters, tenants, option, actionsDetails: { actions } }) => {
        const [initial, updated] = actions.map(action => action?.value ?? null);
        const actionTenants = actions.map(action => action?.tenants);
        const sourceOption = options.find(o => o.value === option);
        const optionType = sourceOption?.type;
        const mappedOption = optionType || option; // if option has type, use it, otherwise use option value (required for ITEM_NOTE cases)
        // generate action type key with '_' delimiter
        const typeKey = actions
          .filter(Boolean)
          .map(action => action?.name ?? null).join('_');

        const actionParameters = actions.find(action => Boolean(action?.parameters))?.parameters;
        const activeTenants = actionTenants?.find(tenant => Boolean(tenant?.length));
        console.log(activeTenants)

        const type = ACTIONS[typeKey];

        return {
          option: mappedOption,
          tenants,
          actions: [{
            type,
            initial,
            updated,
            tenants: activeTenants,
            parameters: [
              ...(parameters || []),
              ...(actionParameters || []),
            ],
          }],
        };
      },
    );

    onContentUpdatesChanged(mappedContentUpdates);
  }, [fields, options, onContentUpdatesChanged, currentRecordType]);

  return (
    <RepeatableField
      getFieldUniqueKey={(field) => field.id}
      fields={fields}
      className={css.row}
      onAdd={noop}
      renderField={(field, index) => {
        return (
          <Row data-testid={`row-${index}`}>
            <Col xs={2} sm={2} className={css.column}>
              <Selection
                dataOptions={groupByCategory(field.options)}
                value={field.option}
                onChange={(value) => handleOptionChange(value, index, getTenantsById(field.options, value))}
                placeholder={formatMessage({ id:'ui-bulk-edit.options.placeholder' })}
                dirty={!!field.option}
                ariaLabel={`select-option-${index}`}
                marginBottom0
                listMaxHeight="50vh"
                onFilter={customFilter}
              />
            </Col>
            <ActionsRow
              option={field.option}
              actions={field.actionsDetails.actions}
              onChange={(values) => handleChange({ ...values, rowIndex: index })}
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
  );
};

ContentUpdatesForm.propTypes = {
  onContentUpdatesChanged: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.object),
  fields: PropTypes.arrayOf(PropTypes.object),
  fieldTemplate: PropTypes.object,
  setFields: PropTypes.func,
};
