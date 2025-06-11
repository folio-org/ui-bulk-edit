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
    const withUpdatedAction = setIn(fields, path, {
      name: val,
      data: getNextData(val)
    });

    if (val === ACTIONS.ADDITIONAL_SUBFIELD) {
      const [rowIndex] = path;

      const withUpdatedSubfields = updateIn(withUpdatedAction, [rowIndex, 'subfields'], (subfields) => {
        const newSubfield = getSubfieldTemplate(uniqueId());
        return [...subfields, newSubfield];
      });

      setFields(withUpdatedSubfields);
    } else {
      const [rowIndex, actionsKey, actionIndex] = path;

      const withClearedSubfields = setIn(withUpdatedAction, [rowIndex, 'subfields'], []);

      const nextAction = getNextAction(val);

      if (actionIndex === 0) {
        const withNextActions = updateIn(withClearedSubfields, [rowIndex, actionsKey], prevActions => [
          prevActions[actionIndex],
          ...(nextAction ? [nextAction] : []),
        ]);

        setFields(withNextActions);
      } else {
        setFields(withClearedSubfields);
      }
    }
  };

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

  const handleRemoveSubfield = (e) => {
    const { rowIndex, subfieldIndex } = e.target.dataset;
    const subfields = fields[rowIndex].subfields;

    // remove the subfield at the specified index and update actions in previous
    const filteredSubfields = subfields
      .filter((_, idx) => idx !== Number(subfieldIndex));

    const withUpdatedSubfields = setIn(fields, [rowIndex, 'subfields'], filteredSubfields);

    const areSubfieldsEmpty = filteredSubfields.length === 0;
    const lastSubfieldIndex = filteredSubfields.length - 1;
    const secondActionPath = ['actions', 1, 'name'];

    if (areSubfieldsEmpty) {
      // if there are no subfields left, clear the actions
      const withUpdatedFields = setIn(withUpdatedSubfields, [rowIndex, ...secondActionPath], '');

      setFields(withUpdatedFields);
    } else {
      // if there are still subfields, clear the action in the previous subfield
      const withClearedSubfields = setIn(withUpdatedSubfields, [
        rowIndex,
        'subfields',
        lastSubfieldIndex,
        ...secondActionPath
      ], '');

      setFields(withClearedSubfields);
    }
  };

  const handleBlur = ({
    path,
    val,
    name,
  }) => {
    if (['ind1', 'ind2'].includes(name)) {
      const newValue = !val || val.trim() === '' ? '\\' : val;

      handleChange({ path, val: newValue, name });
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
        getFieldUniqueKey={(field) => field.id}
        fields={fields}
        className={css.marcRow}
        onAdd={noop}
        renderField={(item, index) => {
          return (
            <Fragment key={item.id}>
              <Row data-testid={`row-${index}`} className={css.marcFieldRow}>
                {schema.map(field => {
                  return (
                    <MarcFieldRenderer
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
                  );
                })}
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
                  <Row key={subfieldIndex} data-testid={`subfield-row-${subfieldIndex}`} className={css.subRow}>
                    {subfieldsSchema.map(field => {
                      return (
                        <MarcFieldRenderer
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
                      );
                    })}
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
          );
        }}
      />
    </StripesOverlayWrapper>
  );
};

MarcFormBody.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  setFields: PropTypes.func.isRequired,
};
