import React, { Fragment, useContext } from 'react';
import { useIntl } from 'react-intl';
import noop from 'lodash/noop';
import uniqueId from 'lodash/uniqueId';

import { Col, RepeatableField, Row, TextField } from '@folio/stripes/components';

import {
  getNextAction,
  getSubfieldTemplate,
  getNextDataControls,
  getDefaultMarkTemplate,
  TAG_FIELD_MAX_LENGTH,
  INDICATOR_FIELD_MAX_LENGTH,
  SUBFIELD_MAX_LENGTH, isMarcValueValid,
} from '../helpers';
import { RootContext } from '../../../../../context/RootContext';
import { ACTIONS } from '../../../../../constants/markActions';
import BulkEditMarkActionRow from './BulkEditMarkActionRow';
import BulkEditMarkActions from './BulkEditMarkActions';

import css from '../../../BulkEditPane.css';
import { setIn } from '../../../../../utils/helpers';


const BulkEditMarkForm = () => {
  const { fields, setFields } = useContext(RootContext);
  const { formatMessage } = useIntl();

  const isIndicatorDirty = (value) => value?.length && value !== '\\';

  const isValueFieldValid = (value) => {
    if (Number(value.trim()).toString().length === 3) {
      return isMarcValueValid(value);
    } else return true;
  };

  const valueFieldError = (value) => {
    if (!isValueFieldValid(value)) return formatMessage({ id:'ui-bulk-edit.layer.marc.error' });
    return '';
  };


  const handleAddField = (e) => {
    const { rowIndex } = e.target.dataset;

    const newFields = [
      ...fields.slice(0, Number(rowIndex) + 1),
      getDefaultMarkTemplate(uniqueId()),
      ...fields.slice(Number(rowIndex) + 1)
    ];

    setFields(newFields);
  };

  const handleRemoveField = (e) => {
    const { rowIndex } = e.target.dataset;

    const newFields = fields.filter((_, idx) => idx !== Number(rowIndex));

    setFields(newFields);
  };

  const handleUpdateField = (index, updated) => {
    setFields(fields.map((field, idx) => {
      if (idx === Number(index)) {
        return updated;
      }

      return field;
    }));
  };

  const handleRemoveSubfield = (e) => {
    const { rowIndex, subfieldIndex } = e.target.dataset;

    const newField = setIn(fields[rowIndex], 'subfields', [
      ...fields[rowIndex].subfields.filter((_, idx) => idx !== Number(subfieldIndex))
    ]);

    handleUpdateField(rowIndex, newField);
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    const { rowIndex, subfieldIndex } = e.target.dataset;

    const path = subfieldIndex ? `subfields[${subfieldIndex}].${name}` : name;

    const newField = setIn(fields[rowIndex], path, value);

    handleUpdateField(rowIndex, newField);
  };

  const updateSubfields = (value, rowIndex, subfieldIndex, updatedField) => {
    const subfieldsPath = 'subfields';

    if (value !== ACTIONS.ADDITIONAL_SUBFIELD) {
      return setIn(updatedField, subfieldsPath, []);
    }

    const newSubfield = getSubfieldTemplate(uniqueId());
    let subfields = fields[rowIndex].subfields || [];

    if (subfieldIndex) {
      const index = Number(subfieldIndex) + 1;
      subfields = [
        ...subfields.slice(0, index),
        newSubfield,
        ...subfields.slice(index)
      ];
    } else {
      subfields = [newSubfield];
    }

    return setIn(updatedField, subfieldsPath, subfields);
  };

  const handleActionChange = (e) => {
    const { value } = e.target;
    const { rowIndex, actionIndex, subfieldIndex } = e.target.dataset;
    const nextAction = getNextAction(value);

    const basePath = subfieldIndex
      ? `subfields[${subfieldIndex}].actions`
      : 'actions';
    const actionPath = `${basePath}[${actionIndex}]`;

    const fieldWithUpdatedData = setIn(fields[rowIndex], actionPath, {
      ...fields[rowIndex].actions[actionIndex],
      name: value,
      data: getNextDataControls(value),
    });

    const updatedFieldsWithSubfields = updateSubfields(
      value,
      rowIndex,
      subfieldIndex,
      fieldWithUpdatedData
    );

    const fieldWithNextActions = setIn(
      updatedFieldsWithSubfields,
      `${basePath}[${Number(actionIndex) + 1}]`,
      nextAction
    );

    handleUpdateField(rowIndex, fieldWithNextActions);
  };

  const handleDataChange = (e) => {
    const { value } = e.target;
    const { rowIndex, actionIndex, dataIndex, subfieldIndex } = e.target.dataset;

    const path = subfieldIndex
      ? `subfields[${subfieldIndex}].actions[${actionIndex}].data[${dataIndex}].value`
      : `actions[${actionIndex}].data[${dataIndex}].value`;

    const newField = setIn(fields[rowIndex], path, value);

    handleUpdateField(rowIndex, newField);
  };

  const handleIndicatorFocus = (e) => {
    e.target.select();
  };

  const handleOnBlur = (e) => {
    const { value, name } = e.target;
    const { rowIndex, subfieldIndex } = e.target.dataset;

    const path = subfieldIndex ? `subfields[${subfieldIndex}].${name}` : name;

    const newField = setIn(fields[rowIndex], path, !value ? '\\' : value);

    handleUpdateField(rowIndex, newField);
  };

  const renderFields = (field, index) => (
    <Row data-testid={`row-${index}`} className={css.fieldRow}>
      <Col className={`${css.column} ${css.field}`}>
        <TextField
          onChange={handleChange}
          data-row-index={index}
          name="value"
          error={valueFieldError(field.value)}
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
          onChange={handleChange}
          onBlur={handleOnBlur}
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
          onBlur={handleOnBlur}
          onChange={handleChange}
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
          onChange={handleChange}
          hasClearIcon={false}
          marginBottom0
          aria-label={formatMessage({ id: 'ui-bulk-edit.layer.column.subfield' })}
        />
      </Col>
      <BulkEditMarkActionRow
        actions={field.actions}
        rowIndex={index}
        onActionChange={handleActionChange}
        onDataChange={handleDataChange}
      />

      <BulkEditMarkActions
        fields={fields}
        rowIndex={index}
        onAdd={handleAddField}
        onRemove={handleRemoveField}
        removingDisabled={fields.length === 1}
      />
    </Row>
  );

  const renderSubfields = (field, index) => field.subfields.map((subfield, subfieldIndex) => (
    <Row key={subfieldIndex} data-testid={`subfield-row-${subfieldIndex}`}>
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
          onChange={handleChange}
          hasClearIcon={false}
          marginBottom0
          aria-label={formatMessage({ id: 'ui-bulk-edit.layer.column.subfield' })}
        />
      </Col>
      <BulkEditMarkActionRow
        actions={subfield.actions}
        rowIndex={index}
        subfieldIndex={subfieldIndex}
        onActionChange={handleActionChange}
        onDataChange={handleDataChange}
      />
      <BulkEditMarkActions
        fields={field.subfields}
        rowIndex={index}
        subfieldIndex={subfieldIndex}
        onRemove={handleRemoveSubfield}
        addingDisabled
        removingDisabled={subfieldIndex === field.subfields.length - 1}
      />
    </Row>
  ));

  return (
    <RepeatableField
      getFieldUniqueKey={(field) => field.id}
      fields={fields}
      className={css.row}
      onAdd={noop}
      renderField={(field, index) => {
        return (
          <Fragment key={index}>
            {renderFields(field, index)}
            {renderSubfields(field, index)}
          </Fragment>
        );
      }}
    />
  );
};

export default BulkEditMarkForm;
