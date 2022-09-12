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

import { LocationLookup, LocationSelection } from '@folio/stripes/smart-components';
import {
  ACTIONS,
  BASE_ACTIONS,
  HOLDINGS_OPTIONS, OPTIONS,
} from '../../../../../../constants';
import css from '../../BulkEditInApp.css';

export const HoldingsForm = (
  {
    onContentUpdatesChanged,
    getFilteredFields,
  },
) => {
  const intl = useIntl();

  const fieldsTypes = {
    ACTION: 'action',
    OPTION: 'option',
  };

  const actions = BASE_ACTIONS(intl.formatMessage);
  const optionsHoldings = HOLDINGS_OPTIONS(intl.formatMessage);

  const fieldTemplate = {
    options: optionsHoldings,
    actions,
    option: optionsHoldings[0].value,
    action: actions[0].value,
    value: '',
    locationId: '',
  };

  const [fields, setFields] = useState([fieldTemplate]);

  const isLocation = (index) => fields[index].action === ACTIONS.REPLACE &&
      (fields[index].option === OPTIONS.PERMANENT_HOLDINGS_LOCATION ||
          fields[index].option === OPTIONS.TEMPORARY_HOLDINGS_LOCATION);

  const handleSelectChange = (e, index, type) => {
    const mappedFields = fields.map((field, i) => {
      if (i === index) {
        const value = e.target.value;

        return {
          ...field,
          [type]: value,
        };
      }

      return field;
    });

    if (type === fieldsTypes.OPTION) {
      const recoveredFields = mappedFields.map(f => ({ ...f, optionsHoldings }));
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

  const handleRemove = (index) => {
    const filteredFields = fields.filter((_, i) => i !== index);
    const recoveredFields = filteredFields.map(f => ({ ...f, optionsHoldings }));
    const finalizedFields = getFilteredFields(recoveredFields);

    setFields(finalizedFields);
  };

  const handleAdd = () => {
    const filteredFields = getFilteredFields([...fields, { ...fieldTemplate, action: '', option: '' }]);
    const initializedFields = filteredFields.map((f, i) => {
      const value = f.options[0].value;

      return i === filteredFields.length - 1
        ? ({ ...f, option: value })
        : f;
    });

    const finalizedFields = getFilteredFields(initializedFields);

    setFields(finalizedFields);
  };

  useEffect(() => {
    const mappedContentUpdates = fields.map(({ option, action, value }) => ({ option, action, value }));

    onContentUpdatesChanged(mappedContentUpdates);
  }, [fields]);

  return (
    <RepeatableField
      fields={fields}
      className={css.row}
      onAdd={noop}
      renderField={(field, index) => (
        <Row data-testid={`row-${index}`}>
          <Col xs={3} sm={3}>
            <Select
              dataOptions={field.options}
              value={field.option}
              onChange={(e) => handleSelectChange(e, index, fieldsTypes.OPTION)}
              data-testid={`select-option-${index}`}
            />
          </Col>
          <Col xs={2} sm={2}>
            <Select
              dataOptions={field.actions}
              value={field.action}
              onChange={(e) => handleSelectChange(e, index, fieldsTypes.ACTION)}
              data-testid={`select-actions-${index}`}
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
            />
          </Col>
          }
          <div className={css.iconButtonWrapper}>
            {(index === fields.length - 1 && fields.length !== optionsHoldings.length) && (
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
  );
};

HoldingsForm.propTypes = {
  onContentUpdatesChanged: PropTypes.func,
  getFilteredFields: PropTypes.func,
};
