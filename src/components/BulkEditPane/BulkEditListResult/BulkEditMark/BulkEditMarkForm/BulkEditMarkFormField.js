import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Col, Row, TextField } from '@folio/stripes/components';

import { INDICATOR_FIELD_MAX_LENGTH, SUBFIELD_MAX_LENGTH, TAG_FIELD_MAX_LENGTH } from '../helpers';
import BulkEditMarkActionRow from './BulkEditMarkActionRow';
import BulkEditMarkActions from './BulkEditMarkActions';

import css from '../../../BulkEditPane.css';


const isIndicatorDirty = (value) => value?.length && value !== '\\';

const BulkEditMarkFormField = ({
  field,
  index,
  onChange,
  onDataChange,
  onActionChange,
  onResetSubfield,
  onAddField,
  onRemoveField,
  removingDisabled,
  addingDisabled,
}) => {
  const { formatMessage } = useIntl();
  const subfieldsCount = field.subfields.length;

  const handleIndicatorFocus = (e) => {
    e.target.select();
  };

  // reset last subfield action if subfields length is changed
  useEffect(() => {
    onResetSubfield(field.id, subfieldsCount);
  }, [field.id, subfieldsCount]);

  return (
    <Row data-testid={`row-${index}`} className={css.markFieldRow}>
      <Col className={`${css.column} ${css.field}`}>
        <TextField
          onChange={onChange}
          data-row-index={index}
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
          data-row-index={index}
          value={field.in1}
          dirty={isIndicatorDirty(field.in1)}
          maxLength={INDICATOR_FIELD_MAX_LENGTH}
          name="in1"
          placeholder=""
          onFocus={handleIndicatorFocus}
          onChange={onChange}
          hasClearIcon={false}
          marginBottom0
          aria-label={formatMessage({ id: 'ui-bulk-edit.layer.column.in1' })}
        />
      </Col>
      <Col className={`${css.column} ${css.in}`}>
        <TextField
          data-row-index={index}
          value={field.in2}
          dirty={isIndicatorDirty(field.in2)}
          maxLength={INDICATOR_FIELD_MAX_LENGTH}
          name="in2"
          placeholder=""
          onFocus={handleIndicatorFocus}
          onChange={onChange}
          hasClearIcon={false}
          marginBottom0
          aria-label={formatMessage({ id: 'ui-bulk-edit.layer.column.in2' })}
        />
      </Col>
      <Col className={`${css.column} ${css.subfield}`}>
        <TextField
          data-row-index={index}
          value={field.subfield}
          dirty={!!field.subfield}
          maxLength={SUBFIELD_MAX_LENGTH}
          name="subfield"
          placeholder=""
          onChange={onChange}
          hasClearIcon={false}
          marginBottom0
          aria-label={formatMessage({ id: 'ui-bulk-edit.layer.column.subfield' })}
        />
      </Col>
      <BulkEditMarkActionRow
        actions={field.actions}
        rowIndex={index}
        onActionChange={onActionChange}
        onDataChange={onDataChange}
      />

      <BulkEditMarkActions
        rowIndex={index}
        onAdd={onAddField}
        onRemove={onRemoveField}
        removingDisabled={removingDisabled}
        addingDisabled={addingDisabled}
      />
    </Row>
  );
};

BulkEditMarkFormField.propTypes = {
  field: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onDataChange: PropTypes.func.isRequired,
  onActionChange: PropTypes.func.isRequired,
  onAddField: PropTypes.func.isRequired,
  onRemoveField: PropTypes.func.isRequired,
  onResetSubfield: PropTypes.func.isRequired,
  removingDisabled: PropTypes.bool,
  addingDisabled: PropTypes.bool,
};

export default BulkEditMarkFormField;
