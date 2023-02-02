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

import { ACTIONS, getBaseActions } from '../../../../../constants';
import css from '../BulkEditInApp.css';
import { ActionsRow } from './ActionsRow';
import { ACTION_VALUE_KEY, FIELD_VALUE_KEY, FIELDS_TYPES, getDefaultActions, isAddButtonShown } from './helpers';

export const ContentUpdatesForm = ({
  onContentUpdatesChanged,
  options,
}) => {
  const { formatMessage } = useIntl();

  const defaultOptionValue = options[0].value;
  const actions = getBaseActions(formatMessage);

  const fieldTemplate = {
    options,
    actionsList: actions,
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
    setFields(prevFields => prevFields.map((field, i) => {
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
    const mappedContentUpdates = fields.map(
      // eslint-disable-next-line no-shadow
      ({ option, actionsDetails: { actions } }) => {
        const [initial, updated] = actions.map(action => action?.value ?? null);

        // generate action type key with '_' delimiter
        const typeKey = actions
          .filter(Boolean)
          .map(action => action?.name ?? null).join('_');

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
                dataOptions={field.options}
                value={field.option}
                onChange={(e) => handleOptionChange(e, index)}
                data-testid={`select-option-${index}`}
                aria-label={`select-option-${index}`}
              />
            </Col>
            <ActionsRow
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
