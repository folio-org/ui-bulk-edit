import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import noop from 'lodash/noop';

import {
  IconButton,
  Col,
  Row,
  Select,
  RepeatableField,
} from '@folio/stripes/components';

import { useLocation } from 'react-router-dom';
import { ACTIONS, CAPABILITIES, OPTIONS } from '../../../../../constants';
import css from '../BulkEditInApp.css';
import { ActionsRow } from './ActionsRow';
import {
  ACTION_VALUE_KEY,
  FIELD_VALUE_KEY,
  FIELDS_TYPES,
  WITH_ITEMS_VALUE_KEY,
  getDefaultActions,
  isAddButtonShown,
} from './helpers';
import { convertArray } from '../../../../../utils/filters';

export const ContentUpdatesForm = ({
  onContentUpdatesChanged,
  options,
}) => {
  const { formatMessage } = useIntl();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const capability = search.get('capabilities');

  const defaultOptionValue = options[0].value;

  const fieldTemplate = {
    options,
    option: defaultOptionValue,
    actionsDetails: getDefaultActions(defaultOptionValue, formatMessage),
  };

  const [fields, setFields] = useState([fieldTemplate]);

  const getFilteredFields = (initialFields) => {
    return initialFields.map(f => {
      const uniqOptions = new Set(initialFields.map(i => i.option));

      const optionsExceptCurrent = [...uniqOptions].filter(u => u !== f.option);

      return {
        ...f,
        options: f.options.filter(o => !optionsExceptCurrent.includes(o.value)),
      };
    });
  };

  const handleOptionChange = (e, index) => {
    const mappedFields = fields.map((field, i) => {
      if (i === index) {
        const value = e.target.value;

        return {
          ...field,
          [FIELDS_TYPES.OPTION]: value,
          actionsDetails: getDefaultActions(value, formatMessage),
        };
      }

      return field;
    });

    const recoveredFields = mappedFields.map(f => ({ ...f, options }));
    const finalizedFields = getFilteredFields(recoveredFields);

    setFields(finalizedFields);
  };

  const handleChange = ({ rowIndex, actionIndex, value, fieldName }) => {
    setFields(fieldsArr => fieldsArr.map((field, i) => {
      if (i === rowIndex) {
        return {
          ...field,
          actionsDetails: {
            ...field.actionsDetails,
            actions: field.actionsDetails.actions.map((action, j) => {
              if (!action) return action; // if null, return this value to stay with the same arr length

              const hasActionChanged = fieldName === ACTION_VALUE_KEY;

              return j === actionIndex
                ? ({
                  ...action,
                  [fieldName]: value,
                  ...(hasActionChanged && { [FIELD_VALUE_KEY]: '' }), // clear field values if action changed
                })
                : action;
            }),
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
      actionsDetails: {
        type: null,
        actions: [],
      },
      option: '',
    }]);

    const initializedFields = filteredFields.map((f, i) => {
      const value = f.options[0].value;

      return i === filteredFields.length - 1
        ? ({
          ...f,
          option: value,
          actionsDetails: getDefaultActions(value, formatMessage),
        })
        : f;
    });

    const finalizedFields = getFilteredFields(initializedFields);

    setFields(finalizedFields);
  };

  useEffect(() => {
    const getActionType = (action, option) => {
      const actionName = action?.name;
      const isSuppressHolding = capability === CAPABILITIES.HOLDING && option === OPTIONS.SUPPRESS_FROM_DISCOVERY;
      const isSetTrue = actionName === ACTIONS.SET_TO_TRUE;
      const isSetToFalse = actionName === ACTIONS.SET_TO_FALSE;

      if (isSuppressHolding && isSetTrue && action?.[WITH_ITEMS_VALUE_KEY]) {
        return ACTIONS.SET_TO_TRUE_INCLUDING_ITEMS;
      }

      if (isSuppressHolding && isSetToFalse && action?.[WITH_ITEMS_VALUE_KEY]) {
        return ACTIONS.SET_TO_FALSE_INCLUDING_ITEMS;
      }

      return actionName ?? null;
    };

    const mappedContentUpdates = fields.map(
      // eslint-disable-next-line no-shadow
      ({ option, actionsDetails: { actions } }) => {
        const [initial, updated] = actions.map(action => action?.value ?? null);

        // generate action type key with '_' delimiter
        const typeKey = actions
          .filter(Boolean)
          .map(action => getActionType(action, option) ?? null).join('_');

        const type = ACTIONS[typeKey];

        return {
          option,
          actions: [{
            type,
            initial,
            updated,
          }],
        };
      },
    );

    onContentUpdatesChanged(mappedContentUpdates);
  }, [fields]);

  const renderOptions = (array) => {
    return array.map(item => {
      if (typeof item === 'object' && Object.keys(item).length === 1) {
        const category = Object.keys(item)[0];
        const categoryOptions = item[category].map(option => (
          <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>
        ));

        return <optgroup key={category} label={category}>{categoryOptions}</optgroup>;
      } else {
        return <option key={item.value} value={item.value} disabled={item.disabled}>{item.label}</option>;
      }
    });
  };

  return (
    <RepeatableField
      fields={fields}
      className={css.row}
      onAdd={noop}
      renderField={(field, index) => {
        return (
          <Row data-testid={`row-${index}`}>
            <Col xs={3} sm={3}>
              <Select
                value={field.option}
                onChange={(e) => handleOptionChange(e, index)}
                data-testid={`select-option-${index}`}
                aria-label={`select-option-${index}`}
              >
                {renderOptions(convertArray(field.options))}
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
};
