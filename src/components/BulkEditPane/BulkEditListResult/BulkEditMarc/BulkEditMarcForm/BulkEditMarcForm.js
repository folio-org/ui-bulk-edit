import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import noop from 'lodash/noop';
import uniqueId from 'lodash/uniqueId';

import { RepeatableField, StripesOverlayWrapper } from '@folio/stripes/components';

import {
  getNextAction,
  getSubfieldTemplate,
  getNextDataControls,
  getMarcFieldTemplate,
} from '../helpers';
import { getMarcFormErrors } from '../validation';
import { ACTIONS } from '../../../../../constants/marcActions';
import { setIn } from '../../../../../utils/helpers';
import BulkEditMarcFormField from './BulkEditMarcFormField';
import BulkEditMarcFormSubfield from './BulkEditMarcFormSubfield';
import css from '../../../BulkEditPane.css';


const BulkEditMarcForm = ({
  fields,
  setFields,
}) => {
  const errors = getMarcFormErrors(fields);

  const handleAddField = (e) => {
    const { rowIndex } = e.target.dataset;

    const newFields = [
      ...fields.slice(0, Number(rowIndex) + 1),
      getMarcFieldTemplate(uniqueId()),
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
    let subfields = updatedField.subfields || [];

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

  const handleOnBlur = (e) => {
    const { value, name } = e.target;
    const { rowIndex, subfieldIndex } = e.target.dataset;

    const path = subfieldIndex ? `subfields[${subfieldIndex}].${name}` : name;

    const newField = setIn(
      fields[rowIndex],
      path,
      !value || value.trim() === '' ? '\\' : value
    );

    handleUpdateField(rowIndex, newField);
  };


  const handleResetSecondAction = (fieldId, subfieldsCount) => {
    const rowIndex = fields.findIndex(field => field.id === fieldId);
    const subfieldActionNamePath = `subfields[${subfieldsCount - 1}].actions[1].name`;
    const fieldActionNamePath = 'actions[1].name';
    let newField;

    if (fields[rowIndex].actions.length > 1) {
      if (subfieldsCount > 0) {
        newField = setIn(fields[rowIndex], subfieldActionNamePath, '');
      } else if (subfieldsCount === 0) {
        newField = setIn(fields[rowIndex], fieldActionNamePath, '');
      }

      handleUpdateField(rowIndex, newField);
    }
  };

  return (
    <StripesOverlayWrapper>
      <RepeatableField
        getFieldUniqueKey={(field) => field.id}
        fields={fields}
        className={css.marcRow}
        onAdd={noop}
        renderField={(field, index) => {
          return (
            <Fragment key={field.id}>
              <BulkEditMarcFormField
                fields={fields}
                field={field}
                index={index}
                onChange={handleChange}
                onActionChange={handleActionChange}
                onDataChange={handleDataChange}
                onAddField={handleAddField}
                onRemoveField={handleRemoveField}
                onResetSubfield={handleResetSecondAction}
                removingDisabled={fields.length === 1}
                addingDisabled={field.subfields.length > 0}
                errors={errors}
                onBlur={handleOnBlur}
              />
              {field.subfields.map((subfield, subfieldIndex) => (
                <BulkEditMarcFormSubfield
                  key={subfield.id}
                  fields={fields}
                  field={field}
                  subfield={subfield}
                  index={index}
                  errors={errors}
                  subfieldIndex={subfieldIndex}
                  onChange={handleChange}
                  onDataChange={handleDataChange}
                  onActionChange={handleActionChange}
                  onAddField={handleAddField}
                  onRemoveField={handleRemoveSubfield}
                />
              ))}
            </Fragment>
          );
        }}
      />
    </StripesOverlayWrapper>
  );
};

BulkEditMarcForm.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  setFields: PropTypes.func.isRequired,
};

export default BulkEditMarcForm;
