import React, { Fragment, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { noop, uniqueId } from 'lodash';

import {
  RepeatableField,
  Row,
  StripesOverlayWrapper,
} from '@folio/stripes/components';

import {
  getSubfieldTemplate,
  marcFieldTemplate,
  getNextData,
  getNextAction,
  injectMargins,
} from '../helpers';
import { ACTIONS } from '../../../../../constants/marcActions';
import { setIn, updateIn, getFormErrors } from '../../../../../utils/helpers';
import { schema, subfieldsSchema } from '../schema';
import { MarcFieldRenderer } from './MarcFieldRenderer';
import MarcFormActions from './MarcFormActions';
import { validationSchema } from '../validation';

import css from '../../../BulkEditPane.css';

export const MarcFormBody = ({ fields, setFields }) => {
  const errors = useMemo(() => getFormErrors(fields, validationSchema), [fields]);

  const enhancedFields = useMemo(() => injectMargins(fields), [fields]);

  const handleChange = useCallback(({ path, val, name }) => {
    const newFields = setIn(fields, [...path, name], val);
    setFields(newFields);
  }, [fields, setFields]);

  const handleActionChange = useCallback(({ path, val }) => {
    const withUpdatedAction = setIn(fields, path, {
      name: val,
      data: getNextData(val)
    });

    if (val === ACTIONS.ADDITIONAL_SUBFIELD) {
      const [rowIndex] = path;
      const withUpdatedSubfields = updateIn(
        withUpdatedAction,
        [rowIndex, 'subfields'],
        subfields => [...subfields, getSubfieldTemplate(uniqueId())]
      );
      setFields(withUpdatedSubfields);
    } else {
      const [rowIndex, actionsKey, actionIndex] = path;
      const withClearedSubfields = setIn(withUpdatedAction, [rowIndex, 'subfields'], []);
      const nextAction = getNextAction(val);

      if (actionIndex === 0) {
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
  }, [fields, setFields]);

  const handleAddField = useCallback((e) => {
    const rowIndex = Number(e.target.dataset.rowIndex);
    const newFields = [
      ...fields.slice(0, rowIndex + 1),
      marcFieldTemplate(uniqueId()),
      ...fields.slice(rowIndex + 1)
    ];
    setFields(newFields);
  }, [fields, setFields]);

  const handleRemoveField = useCallback((e) => {
    const rowIndex = Number(e.target.dataset.rowIndex);
    setFields(fields.filter((_, idx) => idx !== rowIndex));
  }, [fields, setFields]);

  const handleRemoveSubfield = useCallback((e) => {
    const rowIndex = Number(e.target.dataset.rowIndex);
    const subfieldIndex = Number(e.target.dataset.subfieldIndex);
    const subfields = fields[rowIndex].subfields;

    const filtered = subfields.filter((_, idx) => idx !== subfieldIndex);
    let updated = setIn(fields, [rowIndex, 'subfields'], filtered);

    if (filtered.length === 0) {
      updated = setIn(updated, [rowIndex, 'actions', 1, 'name'], '');
    } else {
      updated = setIn(
        updated,
        [rowIndex, 'subfields', filtered.length - 1, 'actions', 1, 'name'],
        ''
      );
    }
    setFields(updated);
  }, [fields, setFields]);

  const handleBlur = useCallback(({ path, val, name }) => {
    if (['ind1', 'ind2'].includes(name) && (!val || val.trim() === '')) {
      handleChange({ path, val: '\\', name });
    }
  }, [handleChange]);

  const handleFocus = useCallback(({ event, name }) => {
    if (['ind1', 'ind2'].includes(name)) {
      event.target.select();
    }
  }, []);

  return (
    <StripesOverlayWrapper>
      <RepeatableField
        getFieldUniqueKey={field => field.id}
        fields={enhancedFields}
        className={css.marcRow}
        onAdd={noop}
        renderField={(item, index) => (
          <Fragment key={item.id}>
            <Row data-testid={`row-${index}`} className={css.marcFieldRow}>
              {schema.map(fieldConfig => (
                <MarcFieldRenderer
                  key={fieldConfig.name}
                  field={fieldConfig}
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
                  {subfieldsSchema.map(fieldConfig => (
                    <MarcFieldRenderer
                      key={fieldConfig.name}
                      field={fieldConfig}
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
