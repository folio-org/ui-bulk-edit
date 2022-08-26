import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import noop from 'lodash/noop';

import {
    Headline,
    IconButton,
    Col,
    Row,
    Accordion,
    Select,
    RepeatableField,
    Datepicker,
  } from '@folio/stripes/components';

import { LocationLookup, LocationSelection } from '@folio/stripes/smart-components';
import { BulkEditInAppTitle } from './BulkEditInAppTitle/BulkEditInAppTitle';
import {
  ITEMS_OPTIONS,
  ITEMS_ACTION,
  USER_OPTIONS,
  ITEM_STATUS_OPTIONS,
  ACTIONS,
  OPTIONS,
  CAPABILITIES,
} from '../../../../constants';
import css from './BulkEditInApp.css';

export const BulkEditInApp = ({ title, onContentUpdatesChanged, typeOfBulk }) => {
  const intl = useIntl();

  const fieldsTypes = {
    ACTION: 'action',
    OPTION: 'option',
  };

  const actions = ITEMS_ACTION(intl.formatMessage);
  const options = ITEMS_OPTIONS(intl.formatMessage);
  const statuses = ITEM_STATUS_OPTIONS(intl.formatMessage);
  const optionsUSer = USER_OPTIONS(intl.formatMessage);

  const fieldTemplate = typeOfBulk === CAPABILITIES.ITEM ? {
    actions,
    options,
    statuses,
    option: options[0].value,
    action: actions[0].value,
    value: '',
    locationId: '',
  } : {
    options: optionsUSer,
    actions,
    option: optionsUSer[0].value,
    action: actions[0].value,
    value: '',
  };

  const [fields, setFields] = useState([fieldTemplate]);

  const isLocation = (index) => fields[index].action === ACTIONS.REPLACE &&
  fields[index].option !== OPTIONS.STATUS && fields[index].option !== OPTIONS.EXPIRATION_DATE;
  const isItemStatus = (index) => fields[index].action === ACTIONS.REPLACE &&
  fields[index].option === OPTIONS.STATUS;
  const isDisabled = (index) => fields[index].option === OPTIONS.STATUS;
  const isExperationDate = (index) => fields[index].option === OPTIONS.EXPIRATION_DATE &&
  fields[index].action === ACTIONS.REPLACE;

  const getDefaultAction = value => (value === OPTIONS.STATUS ? { action: ACTIONS.REPLACE } : {});

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
      const recoveredFields = mappedFields.map(f => ({ ...f, options }));
      const finalizedFields = getFilteredFields(recoveredFields);

      setFields(finalizedFields);
    } else {
      setFields(mappedFields);
    }
  };

  const handleLocationChange = (location, index) => {
    setFields(prevFields => prevFields.map((field, i) => {
      if (i === index) {
        if (location) {
          return {
            ...field,
            locationId: location.id,
            value: location.name,
          };
        }
      }

      return field;
    }));
  };

  const handleValueChange = (value, index) => {
    setFields(prevFields => prevFields.map((field, i) => {
      if (i === index) {
        return {
          ...field,
          value,
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

  const getIsTemporaryLocation = ({ option }) => option === options.TEMPORARY_LOCATION;

  useEffect(() => {
    const mappedContentUpdates = fields.map(({ option, action, value }) => ({ option, action, value }));

    onContentUpdatesChanged(mappedContentUpdates);
  }, [fields]);

  return (
    <>
      <Headline size="large" margin="medium">
        {title}
      </Headline>
      <Accordion
        label={<FormattedMessage id="ui-bulk-edit.layer.title" />}
      >
        <BulkEditInAppTitle />
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
                  dataOptions={field.actions}
                  value={field.action}
                  onChange={(e) => handleSelectChange(e, index, fieldsTypes.ACTION)}
                  data-testid={`select-actions-${index}`}
                  disabled={isDisabled(index)}
                />
              </Col>

              {isLocation(index) &&
              <Col xs={6} sm={3}>
                <LocationSelection
                  value={field.locationId}
                  onSelect={(location) => handleLocationChange(location, index)}
                  placeholder={intl.formatMessage({ id: 'ui-bulk-edit.layer.selectLocation' })}
                  data-test-id={`textField-${index}`}
                />
                <LocationLookup
                  marginBottom0
                  onLocationSelected={(location) => handleLocationChange(location, index)}
                  data-testid={`locationLookup-${index}`}
                  isTemporaryLocation={getIsTemporaryLocation(field)}
                />
              </Col>
              }
              {isItemStatus(index) &&
                <Col xs={6} sm={3}>
                  <Select
                    dataOptions={field.statuses}
                    value={field.value}
                    onChange={(e) => handleValueChange(e.target.value, index)}
                    data-testid={`select-status-${index}`}
                  />
                </Col>
              }
              {isExperationDate(index) &&
              <Col xs={6} sm={3}>
                <Datepicker
                  value={field.value}
                  onChange={(e) => handleValueChange(e.target.value, index)}
                  data-testid={`dataPicker-experation-date-${index}`}
                />
              </Col>}
              <div className={css.iconButtonWrapper}>
                {(index === fields.length - 1 && fields.length !== options.length) && (
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
      </Accordion>
    </>
  );
};

BulkEditInApp.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onContentUpdatesChanged: PropTypes.func,
  typeOfBulk: PropTypes.string,
};
