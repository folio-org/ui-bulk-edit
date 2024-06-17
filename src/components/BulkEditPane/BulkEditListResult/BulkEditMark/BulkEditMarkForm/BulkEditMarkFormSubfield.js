import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Col, Row, TextField } from '@folio/stripes/components';

import { SUBFIELD_MAX_LENGTH } from '../helpers';
import BulkEditMarkActionRow from './BulkEditMarkActionRow';
import BulkEditMarkActions from './BulkEditMarkActions';
import css from '../../../BulkEditPane.css';


const BulkEditMarkFormSubfield = ({
  field,
  subfield,
  subfieldIndex,
  index,
  onChange,
  onDataChange,
  onActionChange,
  onAddField,
  onRemoveField,
}) => {
  const { formatMessage } = useIntl();
  const subfieldsCount = field.subfields.length;
  const isAddingDisabled = subfieldIndex !== subfieldsCount - 1;

  return (
    <Row key={subfieldIndex} data-testid={`subfield-row-${subfieldIndex}`} className={css.subRow}>
      <Col className={`${css.column} ${css.fallback}`} />
      <Col className={`${css.column} ${css.subfield}`}>
        <TextField
          data-row-index={index}
          data-subfield-index={subfieldIndex}
          value={subfield.subfield}
          dirty={!!subfield.subfield}
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
        actions={subfield.actions}
        rowIndex={index}
        subfieldIndex={subfieldIndex}
        onActionChange={onActionChange}
        onDataChange={onDataChange}
      />
      <BulkEditMarkActions
        fields={field.subfields}
        rowIndex={index}
        subfieldIndex={subfieldIndex}
        onRemove={onRemoveField}
        onAdd={onAddField}
        addingDisabled={isAddingDisabled}
      />
    </Row>
  );
};

BulkEditMarkFormSubfield.propTypes = {
  field: PropTypes.object.isRequired,
  subfield: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  subfieldIndex: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onDataChange: PropTypes.func.isRequired,
  onActionChange: PropTypes.func.isRequired,
  onAddField: PropTypes.func.isRequired,
  onRemoveField: PropTypes.func.isRequired,
};

export default BulkEditMarkFormSubfield;
