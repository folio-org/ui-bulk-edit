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
import { ACTIONS } from '../../../../../constants';
import css from '../BulkEditInApp.css';
import { ActionsRow } from './ActionsRow';
import {
  ACTION_VALUE_KEY,
  FIELD_VALUE_KEY,
  getDefaultActions,
  isAddButtonShown,
  getActionType,
  getFilteredFields,
} from './helpers';
import { groupByCategory } from '../../../../../utils/filters';

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
    actionsDetails: getDefaultActions(defaultOptionValue, options, formatMessage),
  };

  const [fields, setFields] = useState([fieldTemplate]);

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
          actionsDetails: getDefaultActions(option, options, formatMessage),
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
      const option = f.options[0].value;

      return i === filteredFields.length - 1
        ? ({
          ...f,
          option,
          actionsDetails: getDefaultActions(option, options, formatMessage),
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
          .map(action => getActionType(action, option, capability) ?? null).join('_');

        const type = ACTIONS[typeKey];

        return {
          option: mappedOption,
          actions: [{
            type,
            initial,
            updated,
            parameters,
          }],
        };
      },
    );

    onContentUpdatesChanged(mappedContentUpdates);
  }, [fields]);

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
};
