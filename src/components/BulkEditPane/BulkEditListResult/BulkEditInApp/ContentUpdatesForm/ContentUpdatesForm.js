import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import noop from 'lodash/noop';
import uniqueId from 'lodash/uniqueId';

import {
  IconButton,
  Col,
  Row,
  Select,
  RepeatableField,
} from '@folio/stripes/components';

import {
  ACTIONS,
  OPTIONS
} from '../../../../../constants';
import css from '../BulkEditInApp.css';
import { ActionsRow } from './ActionsRow';
import {
  ACTION_VALUE_KEY,
  FIELD_VALUE_KEY,
  getDefaultActions,
  isAddButtonShown,
  getFilteredFields,
  getExtraActions,
} from './helpers';
import { groupByCategory } from '../../../../../utils/helpers';
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

  const handleOptionChange = (e, index) => {
    const mappedFields = fields.map((field, i) => {
      if (i === index) {
        const option = e.target.value;
        const sourceOption = options.find(o => o.value === option);
        const parameters = sourceOption.parameters;

        return {
          ...field,
          parameters,
          option,
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
  }) => {
    return field.actionsDetails.actions.map((action, j) => {
      if (!action) return action; // if null, return this value to stay with the same arr length

      return j === actionIndex
        ? ({
          ...action,
          [fieldName]: value,
          ...((hasActionChanged) && { [FIELD_VALUE_KEY]: '' }), // clear field values if action changed
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
      const optionType = sourceOption.type;
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

  const handleChange = ({ rowIndex, actionIndex, value, fieldName }) => {
    setFields(fieldsArr => fieldsArr.map((field, i) => {
      if (i === rowIndex) {
        const hasActionChanged = fieldName === ACTION_VALUE_KEY;
        const hasValueChanged = fieldName === FIELD_VALUE_KEY && actionIndex === 0 && field.option === OPTIONS.ELECTRONIC_ACCESS_URL_RELATIONSHIP;

        const sharedArgs = {
          field,
          value,
          actionIndex,
          hasActionChanged,
          hasValueChanged
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
      const option = f.options[0].value;

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
      ({ parameters, option, actionsDetails: { actions } }) => {
        const [initial, updated] = actions.map(action => action?.value ?? null);
        const sourceOption = options.find(o => o.value === option);
        const optionType = sourceOption.type;
        const mappedOption = optionType || option; // if option has type, use it, otherwise use option value (required for ITEM_NOTE cases)

        // generate action type key with '_' delimiter
        const typeKey = actions
          .filter(Boolean)
          .map(action => action?.name ?? null).join('_');

        const actionParameters = actions.find(action => Boolean(action?.parameters))?.parameters;

        const type = ACTIONS[typeKey];

        return {
          option: mappedOption,
          actions: [{
            type,
            initial,
            updated,
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

  const renderOptions = (optionsMap) => {
    return Object.entries(optionsMap).map(([category, item]) => {
      if (Array.isArray(item)) {
        return (
          <optgroup
            key={category}
            label={category}
          >
            {renderOptions(item)}
          </optgroup>
        );
      } else {
        return (
          <option
            key={item.value}
            value={item.value}
            disabled={item.disabled}
          >
            {item.label}
          </option>
        );
      }
    });
  };

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
              <Select
                value={field.option}
                onChange={(e) => handleOptionChange(e, index)}
                data-testid={`select-option-${index}`}
                aria-label={`select-option-${index}`}
                dirty={field.option}
                marginBottom0
              >
                {renderOptions(groupByCategory(field.options))}
              </Select>
            </Col>
            <ActionsRow
              option={field.option}
              actions={field.actionsDetails.actions}
              onChange={(values) => handleChange({ ...values, rowIndex: index })}
            />
            <div className={css.iconButtonWrapper}>
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
