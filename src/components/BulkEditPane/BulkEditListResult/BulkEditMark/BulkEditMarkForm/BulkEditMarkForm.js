import React, { useContext } from 'react';
import noop from 'lodash/noop';
import { useIntl } from 'react-intl';
import uniqueId from 'lodash/uniqueId';

import { Col, IconButton, RepeatableField, Row, Select, TextField } from '@folio/stripes/components';

import css from '../../BulkEditInApp/BulkEditInApp.css';
import { markActions } from '../../../../../constants';
import {
  getDefaultMarkTemplate,
  TAG_FIELD_MAX_LENGTH,
  INDICATOR_FIELD_MAX_LENGTH,
  SUBFIELD_MAX_LENGTH,
} from '../helpers';
import { RootContext } from '../../../../../context/RootContext';


const BulkEditMarkForm = () => {
  const { fields, setFields } = useContext(RootContext);
  const { formatMessage } = useIntl();

  const isIndicatorDirty = (value) => value?.length && value !== '\\';

  const handleAdd = (index) => {
    const newFields = [
      ...fields.slice(0, index + 1),
      getDefaultMarkTemplate(uniqueId()),
      ...fields.slice(index + 1)
    ];

    setFields(newFields);
  };

  const handleRemove = (index) => {
    const newFields = fields.filter((_, idx) => idx !== index);

    setFields(newFields);
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    const { index } = e.target.dataset;

    const changed = fields.map((field, idx) => {
      if (Number(index) === idx) {
        return {
          ...field,
          [name]: value,
        };
      }

      return field;
    });

    setFields(changed);
  };

  const handleIndicatorFocus = (e) => {
    e.target.select();
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
            <Col className={`${css.column} ${css.field}`}>
              <TextField
                onChange={handleChange}
                data-index={index}
                name="value"
                value={field.value}
                dirty={!!field.value}
                maxLength={TAG_FIELD_MAX_LENGTH}
                placeholder=""
                hasClearIcon={false}
                marginBottom0
                aria-label={formatMessage({ id: 'ui-bulk-edit.layer.column.field' })}
              />
            </Col>
            <Col className={`${css.column} ${css.in}`}>
              <TextField
                data-index={index}
                value={field.in1}
                dirty={isIndicatorDirty(field.in1)}
                maxLength={INDICATOR_FIELD_MAX_LENGTH}
                name="in1"
                placeholder=""
                onFocus={handleIndicatorFocus}
                onChange={handleChange}
                hasClearIcon={false}
                marginBottom0
                aria-label={formatMessage({ id: 'ui-bulk-edit.layer.column.in1' })}
              />
            </Col>
            <Col className={`${css.column} ${css.in}`}>
              <TextField
                data-index={index}
                value={field.in2}
                dirty={isIndicatorDirty(field.in2)}
                maxLength={INDICATOR_FIELD_MAX_LENGTH}
                name="in2"
                placeholder=""
                onFocus={handleIndicatorFocus}
                onChange={handleChange}
                hasClearIcon={false}
                marginBottom0
                aria-label={formatMessage({ id: 'ui-bulk-edit.layer.column.in2' })}
              />
            </Col>
            <Col className={`${css.column} ${css.subfield}`}>
              <TextField
                data-index={index}
                value={field.subfield}
                dirty={!!field.subfield}
                maxLength={SUBFIELD_MAX_LENGTH}
                name="subfield"
                placeholder=""
                onChange={handleChange}
                hasClearIcon={false}
                marginBottom0
                aria-label={formatMessage({ id: 'ui-bulk-edit.layer.column.subfield' })}
              />
            </Col>
            <Col className={`${css.column} ${css.actions}`}>
              <Select
                data-index={index}
                value={field.action}
                dirty={!!field.action}
                name="action"
                dataOptions={markActions(formatMessage)}
                onChange={handleChange}
                marginBottom0
                aria-label={formatMessage({ id: 'ui-bulk-edit.layer.column.action' })}
              />
            </Col>
            <div className={css.iconButtonWrapper}>
              <IconButton
                icon="plus-sign"
                size="medium"
                onClick={() => handleAdd(index)}
                data-testid={`add-button-${index}`}
              />
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

export default BulkEditMarkForm;
