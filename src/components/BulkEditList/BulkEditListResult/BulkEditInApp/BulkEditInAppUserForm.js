import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import noop from 'lodash/noop';
import moment from 'moment';

import {
  IconButton,
  Col,
  Row,
  Select,
  RepeatableField,
  Datepicker,
} from '@folio/stripes/components';

import {
  ITEMS_ACTION,
  USER_OPTIONS,
  ACTIONS,
  OPTIONS,
  CAPABILITIES,
} from '../../../../constants';
import css from './BulkEditInApp.css';
import { usePatronGroup } from '../../../../API';

export const BulkEditInAppUserForm = (
  {
    onContentUpdatesChanged,
    typeOfBulk,
    getFilteredFields,
  },
) => {
  const intl = useIntl();

  const fieldsTypes = {
    ACTION: 'actions',
    OPTION: 'option',
  };

  const actions = ITEMS_ACTION(intl.formatMessage);
  const optionsUser = USER_OPTIONS(intl.formatMessage);

  const fieldTemplate = {
    options: optionsUser,
    actionsList: actions,
    option: optionsUser[0].value,
    actions: [{
      name: actions[1].value,
      value: '',
    }],
  };

  const [fields, setFields] = useState([fieldTemplate]);

  const isDisabled = (index) => fields[index].option === OPTIONS.STATUS ||
        typeOfBulk === CAPABILITIES.USER;
  const isExperationDate = (index) => fields[index].option === OPTIONS.EXPIRATION_DATE &&
        fields[index].actions.some((el) => el.name === ACTIONS.REPLACE);
  const isPatronGroup = (index) => fields[index].option === OPTIONS.PATRON_GROUP &&
        fields[index].action === ACTIONS.REPLACE;

  const getDefaultAction = value => (value === OPTIONS.STATUS ||
    OPTIONS.PATRON_GROUP ? { action: ACTIONS.REPLACE } : {});

  const { userGroups } = usePatronGroup();

  const patronGroups = Object.values(userGroups).reduce(
    (acc, { group, desc = '' }) => {
      const groupObject = {
        value: group,
        label: `${group} (${desc})`,
      };

      acc.push(groupObject);

      return acc;
    },
    [
      {
        value: '',
        label: intl.formatMessage({ id: 'ui-bulk-edit.layer.selectPatronGroup' }),
      },
    ],
  );

  const handleSelectChange = (e, index, type) => {
    const mappedFields = fields.map((field, i) => {
      if (i === index) {
        const value = e.target.value;

        return {
          ...field,
          [type]: value,
          ...getDefaultAction(value),
        };
      }

      return field;
    });

    if (type === fieldsTypes.OPTION) {
      const recoveredFields = mappedFields.map(f => ({ ...f, options: optionsUser }));
      const finalizedFields = getFilteredFields(recoveredFields);

      setFields(finalizedFields);
    } else if (type === fieldsTypes.ACTION) {
      const actionField = fields.map((field, i) => {
        if (i === index) {
          const value = e.target.value;

          return {
            ...field,
            [type]: {
              name: value,
            },
          };
        }

        return field;
      });

      setFields(actionField);
    }
  };

  const handleValueChange = (value, index, action) => {
    setFields(prevFields => prevFields.map((field, i) => {
      if (i === index) {
        return {
          ...field,
          actions: [
            {
              name: action,
              value,
            },
          ],
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
    const filteredFields = getFilteredFields([...fields, { ...fieldTemplate, action: '', option: '' }]);
    const initializedFields = filteredFields.map((f, i) => {
      const value = f.options[0].value;

      return i === filteredFields.length - 1
        ? ({ ...f, option: value, ...getDefaultAction(value) })
        : f;
    });

    const finalizedFields = getFilteredFields(initializedFields);

    setFields(finalizedFields);
  };

  useEffect(() => {
    const mappedContentUpdates = fields.map(
      // eslint-disable-next-line no-shadow
      ({ option, actions, value }) => ({ option, actions, value }),
    );

    onContentUpdatesChanged(mappedContentUpdates);
  }, [fields]);

  return (
    <>
      <RepeatableField
        fields={fields}
        className={css.row}
        onAdd={noop}
        renderField={(field, index) => (
          <Row data-testid={`row-${index}`}>
            <Col xs={6} sm={3}>
              <Select
                dataOptions={field.options}
                value={field.option}
                onChange={(e) => handleSelectChange(e, index, fieldsTypes.OPTION)}
                data-testid={`select-option-${index}`}
              />
            </Col>
            <Col xs={6} sm={3}>
              <Select
                dataOptions={field.actionsList}
                value={field.actions[0].name}
                onChange={(e) => handleSelectChange(e, index, fieldsTypes.ACTION)}
                data-testid={`select-actions-${index}`}
                disabled={isDisabled(index)}
              />
            </Col>
            {isExperationDate(index) &&
            <Col xs={6} sm={3}>
              <Datepicker
                value={field.value}
                onChange={(e) => handleValueChange(moment.utc(e.target.value), index, field.actions[0].name)}
                data-testid={`dataPicker-experation-date-${index}`}
              />
            </Col>}
            {isPatronGroup(index) &&
            <Col xs={6} sm={3}>
              <Select
                dataOptions={patronGroups}
                value={field.value}
                onChange={(e) => handleValueChange(e.target.value, index, field.actions[0].name)}
                data-testid={`select-patronGroup-${index}`}
              />
            </Col>
            }
            <div className={css.iconButtonWrapper}>
              {(index === fields.length - 1 && fields.length !== optionsUser.length) && (
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
        )}
      />
    </>
  );
};

BulkEditInAppUserForm.propTypes = {
  onContentUpdatesChanged: PropTypes.func,
  typeOfBulk: PropTypes.string,
  getFilteredFields: PropTypes.func,
};
