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
import { ITEMS_OPTIONS, ITEMS_ACTION } from '../../../../constants';
import css from './BulkEditInApp.css';

export const BulkEditInApp = ({ title }) => {
  const intl = useIntl();

  const itemsActions = ITEMS_ACTION.map((el) => ({
    value: el.value,
    label: intl.formatMessage({ id: el.label }),
    disabled: el.disabled,
  }));
  const itemsOptions = ITEMS_OPTIONS.map((el) => ({
    value: el.value,
    label: intl.formatMessage({ id: el.label }),
    disabled: el.disabled,
  }));

  const selectedOption = itemsOptions[0].value;
  const selectedAction = itemsActions[0].value;

  const [fields, setFields] = useState([{
    actions: itemsActions,
    options: itemsOptions,
    selectedOption,
    selectedAction,
  }]);

  const [locationName, setLocation] = useState([
    '',
  ]);

  const selectLocation = useCallback(
    (location, index) => {
      setLocation(locationName.map((loc, i) => {
        let newLoc = loc;

        if (i === index) {
          newLoc = location.code;
        }

        return newLoc;
      }));
    },
    [locationName],
  );

  const handleSelectChange = (e, index, type) => {
    setFields(fields.map((field, i) => {
      if (i === index) {
        return Object.assign(field, {
          [type]: e.target.value,
        });
      }

      return field;
    }));
  };

  const handleRemove = (index) => {
    setFields([...fields.slice(0, index), ...fields.slice(index + 1, fields.length)]);
    setLocation([...locationName.slice(0, index), ...locationName.slice(index + 1, locationName.length)]);
  };

  const handleAdd = () => {
    setFields(prevState => [...prevState, { actions: itemsActions,
      options: itemsOptions,
      selectedOption,
      selectedAction }]);
    setLocation(prevState => [...prevState, '']);
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
            <Row>
              <Col xs={6} sm={3}>
                <Select
                  dataOptions={field.options}
                  value={field.selectedOption}
                  onChange={(e) => handleSelectChange(e, index, 'selectedOption')}
                />
              </Col>
              <Col xs={6} sm={3}>
                <Select
                  dataOptions={field.actions}
                  value={field.selectedAction}
                  onChange={(e) => handleSelectChange(e, index, 'selectedAction')}
                />
              </Col>

              {field.selectedAction === 'replace' &&
              <Col xs={6} sm={3}>
                <TextField
                  type="text"
                  value={locationName[index]}
                  disabled
                />
                <LocationLookup
                  marginBottom0
                  onLocationSelected={(location) => selectLocation(location, index)}
                />
              </Col>
              }
              <div className={css.iconButtonWrapper}>
                <IconButton
                  icon="plus-sign"
                  size="large"
                  onClick={handleAdd}
                />
                <IconButton
                  icon="trash"
                  onClick={() => handleRemove(index)}
                  disabled={index === 0}
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
