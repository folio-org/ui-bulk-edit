import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import noop from 'lodash/noop';

import { Headline,
  IconButton,
  Col,
  Row,
  Accordion,
  Select,
  RepeatableField,
  TextField } from '@folio/stripes/components';

import { LocationLookup } from '@folio/stripes/smart-components';
import { BulkEditInAppTitle } from './BulkEditInAppTitle/BulkEditInAppTitle';
import { ITEMS_OPTIONS, ITEMS_ACTION, ACTIONS } from '../../../../constants';
import css from './BulkEditInApp.css';

export const BulkEditInApp = ({ title }) => {
  const intl = useIntl();

  const getItems = (items) => items.map((el) => ({
    value: el.value,
    label: intl.formatMessage({ id: el.label }),
    disabled: el.disabled,
  }));

  const itemsActions = getItems(ITEMS_ACTION);
  const itemsOptions = getItems(ITEMS_OPTIONS);

  const defaultOption = itemsOptions[0].value;
  const defaultAction = itemsActions[0].value;

  const [fields, setFields] = useState([{
    actions: itemsActions,
    options: itemsOptions,
    selectedOption: defaultOption,
    selectedAction: defaultAction,
  }]);

  const [contentUpdates, setContentUpdates] = useState([{
    option: defaultOption,
    action: defaultAction,
  }]);

  const handleSelectLocation = useCallback(
    (location, index) => {
      setContentUpdates(contentUpdates.map((loc, i) => {
        if (i === index) {
          return Object.assign(loc, {
            value: location.code,
          });
        }

        return loc;
      }));
    },
    [contentUpdates],
  );

  const handleSelectChange = (e, index, type) => {
    setContentUpdates(contentUpdates.map((field, i) => {
      if (i === index) {
        if (e.target.value === ACTIONS.CLEAR) {
          return Object.assign(field, {
            [type]: e.target.value,
            value: '',
          });
        } else {
          return Object.assign(field, {
            [type]: e.target.value,
          });
        }
      }

      return field;
    }));
  };

  const handleRemove = (index) => {
    setFields([...fields.slice(0, index), ...fields.slice(index + 1, fields.length)]);
    setContentUpdates([...contentUpdates.slice(0, index), ...contentUpdates.slice(index + 1, contentUpdates.length)]);
  };

  const handleAdd = () => {
    setFields(prevState => [...prevState, { actions: itemsActions,
      options: itemsOptions }]);
    setContentUpdates(prevState => [...prevState, {
      option: defaultOption,
      action: defaultAction,
    }]);
  };

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
                  value={contentUpdates[index].options}
                  onChange={(e) => handleSelectChange(e, index, 'option')}
                  data-testid={`select-option-${index}`}
                />
              </Col>
              <Col xs={6} sm={3}>
                <Select
                  dataOptions={field.actions}
                  value={contentUpdates[index].action}
                  onChange={(e) => handleSelectChange(e, index, 'action')}
                  data-testid={`select-actions-${index}`}
                />
              </Col>

              {contentUpdates[index].action === ACTIONS.REPLACE &&
              <Col xs={6} sm={3}>
                <TextField
                  type="text"
                  value={contentUpdates[index].value || ''}
                  disabled
                />
                <LocationLookup
                  marginBottom0
                  onLocationSelected={(location) => handleSelectLocation(location, index)}
                  data-testid={`locationLookup-${index}`}
                />
              </Col>
              }
              <div className={css.iconButtonWrapper}>
                <IconButton
                  icon="plus-sign"
                  size="large"
                  onClick={handleAdd}
                  data-testid={`add-button-${index}`}
                />
                <IconButton
                  icon="trash"
                  onClick={() => handleRemove(index)}
                  disabled={index === 0}
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
  title: PropTypes.string,
};
