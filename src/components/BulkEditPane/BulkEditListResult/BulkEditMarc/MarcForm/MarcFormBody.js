import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { noop, uniqueId } from 'lodash';

import {
  RepeatableField,
  Row,
  StripesOverlayWrapper,
} from '@folio/stripes/components';

import {
  getSubfieldTemplate,
  getMarcFieldTemplate,
  getNextData,
  getNextAction,
} from '../helpers';
import { getMarcFormErrors } from '../validation';
import { ACTIONS } from '../../../../../constants/marcActions';
import { setIn, updateIn } from '../../../../../utils/helpers';
import { schema, subfieldsSchema } from '../schema';
import { MarcFieldRenderer } from './MarcFieldRenderer';
import MarcFormActions from './MarcFormActions';

import css from '../../../BulkEditPane.css';


export const MarcFormBody = ({
  fields,
  setFields,
}) => {
  const errors = getMarcFormErrors(fields);

  const handleChange = ({ path, val, name }) => {
    const newFields = setIn(fields, [...path, name], val);
    setFields(newFields);
  };

  const handleActionChange = ({ path, val }) => {
    // Set the selected action and default data entries
    const withUpdatedAction = setIn(fields, path, {
      name: val,
      data: getNextData(val)
    });

    if (val === ACTIONS.ADDITIONAL_SUBFIELD) {
      // Add a new subfield template when additional-subfield action chosen
      const [rowIndex] = path;
      const withUpdatedSubfields = updateIn(
        withUpdatedAction,
        [rowIndex, 'subfields'],
        subfields => [...subfields, getSubfieldTemplate(uniqueId())]
      );
      setFields(withUpdatedSubfields);
    } else {
      // Clear any existing subfields and adjust next action slots
      const [rowIndex, actionsKey, actionIndex] = path;
      const withClearedSubfields = setIn(withUpdatedAction, [rowIndex, 'subfields'], []);
      const nextAction = getNextAction(val);

      if (actionIndex === 0) {
        // If editing primary action, reset secondary slot
        const withNextActions = updateIn(
          withClearedSubfields,
          [rowIndex, actionsKey],
          prev => [prev[0], ...(nextAction ? [nextAction] : [])]
        );
        setFields(withNextActions);
      } else {
        setFields(withClearedSubfields);
      }
    }
  };

  const handleAddField = (e) => {
    const rowIndex = Number(e.target.dataset.rowIndex);
    const newFields = [
      ...fields.slice(0, rowIndex + 1),
      getMarcFieldTemplate(uniqueId()),
      ...fields.slice(rowIndex + 1)
    ];
    setFields(newFields);
  };

  const handleRemoveField = (e) => {
    const rowIndex = Number(e.target.dataset.rowIndex);
    setFields(fields.filter((_, idx) => idx !== rowIndex));
  };

  const handleRemoveSubfield = (e) => {
    const rowIndex = Number(e.target.dataset.rowIndex);
    const subfieldIndex = Number(e.target.dataset.subfieldIndex);
    const subfields = fields[rowIndex].subfields;

    const filtered = subfields.filter((_, idx) => idx !== subfieldIndex);
    let updated = setIn(fields, [rowIndex, 'subfields'], filtered);

    if (filtered.length === 0) {
      // Clear secondary action when no subfields remain
      updated = setIn(updated, [rowIndex, 'actions', 1, 'name'], '');
    } else {
      // Clear action name of the last remaining subfield
      updated = setIn(
        updated,
        [rowIndex, 'subfields', filtered.length - 1, 'actions', 1, 'name'],
        ''
      );
    }
    setFields(updated);
  };

  const handleBlur = ({ path, val, name }) => {
    if (['ind1', 'ind2'].includes(name) && (!val || val.trim() === '')) {
      handleChange({ path, val: '\\', name });
    }
  };

  const handleFocus = ({ event, name }) => {
    if (['ind1', 'ind2'].includes(name)) {
      event.target.select();
    }
  };

  return (
    <StripesOverlayWrapper>
      <RepeatableField
        getFieldUniqueKey={field => field.id}
        fields={fields}
        className={css.marcRow}
        onAdd={noop}
        renderField={(item, index) => (
          <Fragment key={item.id}>
            <Row data-testid={`row-${index}`} className={css.marcFieldRow}>
              {schema.map(field => (
                <MarcFieldRenderer
                  key={field.name}
                  field={field}
                  item={item}
                  ctx={{ index }}
                  errors={errors}
                  rootPath={[index]}
                  onChange={handleChange}
                  onActionChange={handleActionChange}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                />
              ))}
              <MarcFormActions
                rowIndex={index}
                onAdd={handleAddField}
                onRemove={handleRemoveField}
                removingDisabled={fields.length === 1}
                addingDisabled={item.subfields.length > 0}
              />
            </Row>
            {item.subfields.map((subfield, subfieldIndex) => {
              const isAddingDisabled = subfieldIndex !== item.subfields.length - 1;
              return (
                <Row key={subfield.id} data-testid={`subfield-row-${subfieldIndex}`} className={css.subRow}>
                  {subfieldsSchema.map(field => (
                    <MarcFieldRenderer
                      key={field.name}
                      field={field}
                      item={subfield}
                      ctx={{ index: subfieldIndex }}
                      errors={errors}
                      rootPath={[index, 'subfields', subfieldIndex]}
                      onChange={handleChange}
                      onActionChange={handleActionChange}
                      onBlur={handleBlur}
                      onFocus={handleFocus}
                    />
                  ))}
                  <MarcFormActions
                    fields={item.subfields}
                    rowIndex={index}
                    subfieldIndex={subfieldIndex}
                    onAdd={handleAddField}
                    onRemove={handleRemoveSubfield}
                    addingDisabled={isAddingDisabled}
                  />
                </Row>
              );
            })}
          </Fragment>
        )}
      />
    </StripesOverlayWrapper>
  );
};

MarcFormBody.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      subfields: PropTypes.arrayOf(
        PropTypes.shape({ id: PropTypes.string.isRequired })
      ).isRequired,
    })
  ).isRequired,
  setFields: PropTypes.func.isRequired,
};
