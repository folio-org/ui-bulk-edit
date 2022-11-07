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

import {
  BASE_ACTIONS,
  USER_OPTIONS,
} from '../../../../../../constants';
import css from '../../BulkEditInApp.css';
import { ActionsRow } from './ActionsRow';
import { getDefaultActions } from './helpers';

const fieldsTypes = {
  ACTION: 'actions',
  OPTION: 'option',
};

export const UserForm = (
  {
    onContentUpdatesChanged,
    getFilteredFields,
  },
) => {
  const intl = useIntl();

  const actions = BASE_ACTIONS(intl.formatMessage);
  const optionsUser = USER_OPTIONS(intl.formatMessage);

  const fieldTemplate = {
    options: optionsUser,
    actionsList: actions,
    option: optionsUser[0].value,
    actions: getDefaultActions(optionsUser[0].value, intl.formatMessage),
  };

  const [fields, setFields] = useState([fieldTemplate]);


  const handleOptionChange = (e, index) => {
    const mappedFields = fields.map((field, i) => {
      if (i === index) {
        const value = e.target.value;

        return {
          ...field,
          [fieldsTypes.OPTION]: value,
          actions: getDefaultActions(value, intl.formatMessage),
        };
      }

      return field;
    });

    const recoveredFields = mappedFields.map(f => ({ ...f, options: optionsUser }));
    const finalizedFields = getFilteredFields(recoveredFields);

    setFields(finalizedFields);
  };

  const handleActionsChange = ({ rowIndex, actionIndex, actionValue, actionFieldName }) => {
    setFields(prevFields => prevFields.map((field, i) => {
      if (i === rowIndex) {
        return {
          ...field,
          actions: field.actions.map((action, j) => (j === actionIndex
            ? ({ ...action, [actionFieldName]: actionValue })
            : action
          )),
        };
      }

      return field;
    }));
  };

  const handleRemove = (index) => {
    const filteredFields = fields.filter((_, i) => i !== index);
    const recoveredFields = filteredFields.map(f => ({ ...f, options: optionsUser }));
    const finalizedFields = getFilteredFields(recoveredFields);

    setFields(finalizedFields);
  };

  const handleAdd = () => {
    const filteredFields = getFilteredFields([...fields, { ...fieldTemplate, actions: [], option: '' }]);
    const initializedFields = filteredFields.map((f, i) => {
      const value = f.options[0].value;

      return i === filteredFields.length - 1
        ? ({
          ...f,
          option: value,
          actions: getDefaultActions(value, intl.formatMessage),
        })
        : f;
    });

    const finalizedFields = getFilteredFields(initializedFields);

    setFields(finalizedFields);
  };

  useEffect(() => {
    const mappedContentUpdates = fields.map(
      // eslint-disable-next-line no-shadow
      ({ option, actions }) => ({
        option,
        actions: actions.map(({ name, value }) => ({ name, value })),
      }),
    );

    onContentUpdatesChanged(mappedContentUpdates);
  }, [fields]);

  return (
    <RepeatableField
      fields={fields}
      className={css.row}
      onAdd={noop}
      renderField={(field, index) => {
        const isAddButtonShown = index === fields.length - 1 && fields.length !== optionsUser.length - 1;

        return (
          <Row data-testid={`row-${index}`}>
            <Col xs={3} sm={3}>
              <Select
                dataOptions={field.options}
                value={field.option}
                onChange={(e) => handleOptionChange(e, index)}
                data-testid={`select-option-${index}`}
              />
            </Col>
            <ActionsRow
              actions={field.actions}
              onChange={(values) => handleActionsChange({ ...values, rowIndex: index })}
            />
            <div className={css.iconButtonWrapper}>
              {isAddButtonShown && (
                <IconButton
                  icon="plus-sign"
                  size="large"
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

UserForm.propTypes = {
  onContentUpdatesChanged: PropTypes.func,
  getFilteredFields: PropTypes.func,
};
