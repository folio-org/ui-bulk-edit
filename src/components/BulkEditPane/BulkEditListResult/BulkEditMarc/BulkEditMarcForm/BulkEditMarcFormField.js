import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import get from 'lodash/get';

import { Col, InfoPopover, Row, TextField } from '@folio/stripes/components';

import { INDICATOR_FIELD_MAX_LENGTH, SUBFIELD_MAX_LENGTH, TAG_FIELD_MAX_LENGTH } from '../helpers';
import BulkEditMarcActionRow from './BulkEditMarcActionRow';
import BulkEditMarcActions from './BulkEditMarcActions';

import css from '../../../BulkEditPane.css';


const isIndicatorDirty = (value) => value?.length && value !== '\\';

const BulkEditMarcFormField = ({
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
  onBlur,
  errors,
  fields
}) => {
  const { formatMessage } = useIntl();
  const subfieldsCount = field.subfields.length;
  const tagErrorId = get(errors, `[${index}].tag`);
  const ind1ErrorsId = get(errors, `[${index}].ind1`);
  const ind2ErrorsId = get(errors, `[${index}].ind2`);
  const subFieldErrorId = get(errors, `[${index}].subfield`);
  const ind1ErrorMessage = ind1ErrorsId && field.ind1.length === INDICATOR_FIELD_MAX_LENGTH ?
    formatMessage({ id: ind1ErrorsId })
    : '';
  const ind2ErrorMessage = ind2ErrorsId && field.ind2.length === INDICATOR_FIELD_MAX_LENGTH ?
    formatMessage({ id: ind2ErrorsId })
    : '';
  const tagErrorMessage = tagErrorId && field.tag.length === TAG_FIELD_MAX_LENGTH
    ? formatMessage({ id: tagErrorId })
    : '';
  const subfieldErrorMessage = subFieldErrorId && field.subfield.length === SUBFIELD_MAX_LENGTH ?
    formatMessage({ id: subFieldErrorId })
    :
    '';
  const handleIndicatorFocus = (e) => {
    e.target.select();
  };

  // reset last subfield action if subfields length is changed
  useEffect(() => {
    onResetSubfield(field.id, subfieldsCount);
    // disabled because we need to run it only when subfieldsCount amd fieldId is changed
    // memoization wil cost a lot for onResetSubfield function
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.id, subfieldsCount]);

  const renderInfoPopover = () => {
    const errorId = errors[`[${index}]`];

    return !!errorId && (
      <InfoPopover
        iconSize="medium"
        content={formatMessage({ id: errorId })}
      />
    );
  };

  return (
    <Row data-testid={`row-${index}`} className={css.marcFieldRow}>
      <Col className={`${css.column} ${css.field}`}>
        <TextField
          onChange={onChange}
          data-row-index={index}
          name="tag"
          error={tagErrorMessage}
          value={field.tag}
          dirty={!!field.tag}
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
          value={field.ind1}
          dirty={isIndicatorDirty(field.ind1)}
          onBlur={onBlur}
          maxLength={INDICATOR_FIELD_MAX_LENGTH}
          name="ind1"
          error={ind1ErrorMessage}
          placeholder=""
          onFocus={handleIndicatorFocus}
          data-testid={`ind1-${index}`}
          onChange={onChange}
          hasClearIcon={false}
          marginBottom0
          aria-label={formatMessage({ id: 'ui-bulk-edit.layer.column.ind1' })}
        />
      </Col>
      <Col className={`${css.column} ${css.in}`}>
        <TextField
          data-row-index={index}
          value={field.ind2}
          dirty={isIndicatorDirty(field.ind2)}
          maxLength={INDICATOR_FIELD_MAX_LENGTH}
          name="ind2"
          onBlur={onBlur}
          placeholder=""
          error={ind2ErrorMessage}
          onFocus={handleIndicatorFocus}
          data-testid={`ind2-${index}`}
          onChange={onChange}
          hasClearIcon={false}
          marginBottom0
          aria-label={formatMessage({ id: 'ui-bulk-edit.layer.column.ind2' })}
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
          error={subfieldErrorMessage}
          onChange={onChange}
          hasClearIcon={false}
          marginBottom0
          aria-label={formatMessage({ id: 'ui-bulk-edit.layer.column.subfield' })}
        />
        {renderInfoPopover()}
      </Col>
      <BulkEditMarcActionRow
        fields={fields}
        actions={field.actions}
        rowIndex={index}
        errors={errors}
        onActionChange={onActionChange}
        onDataChange={onDataChange}
      />

      <BulkEditMarcActions
        rowIndex={index}
        onAdd={onAddField}
        onRemove={onRemoveField}
        removingDisabled={removingDisabled}
        addingDisabled={addingDisabled}
      />
    </Row>
  );
};

BulkEditMarcFormField.propTypes = {
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
  onBlur: PropTypes.func,
  errors: PropTypes.object,
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default BulkEditMarcFormField;
