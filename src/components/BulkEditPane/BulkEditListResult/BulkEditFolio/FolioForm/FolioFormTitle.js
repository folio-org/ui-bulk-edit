import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Col, Row, Label } from '@folio/stripes/components';

import { Fragment } from 'react';
import { FINAL_ACTIONS } from '../../../../../constants';

import css from '../../../BulkEditPane.css';

const getMaxField = (fields) => {
  const filterFinal = action => !FINAL_ACTIONS.includes(action.name);

  return fields.reduce((max, field) => {
    const currentActions = field.actionsDetails.actions || [];
    const maxActions = max.actionsDetails.actions || [];

    if (currentActions.length > maxActions.length) {
      return field;
    }

    if (currentActions.length === maxActions.length) {
      const currentFiltered = currentActions.filter(filterFinal);
      const maxFiltered = maxActions.filter(filterFinal);

      if (currentFiltered.length > maxFiltered.length) {
        return field;
      }
    }

    return max;
  }, fields[0]);
};

export const FolioFormTitle = ({ fields }) => {
  if (!fields.length) return null;

  const maxField = getMaxField(fields);

  return (
    <Row>
      <Col
        className={css.headerCell}
        sm={2}
      >
        <Label required>
          <FormattedMessage id="ui-bulk-edit.layer.column.options" />
        </Label>
      </Col>
      {maxField.actionsDetails.actions?.map((item) => (
        <Fragment key={item.name}>
          <Col
            className={css.headerCell}
            sm={2}
          >
            <Label required>
              <FormattedMessage id="ui-bulk-edit.layer.column.actions" />
            </Label>
            <div className={css.splitter} />
          </Col>
          {item.name && !FINAL_ACTIONS.includes(item.name) && (
            <Col
              className={css.headerCell}
              sm={2}
            >
              <Label required>
                <FormattedMessage id="ui-bulk-edit.layer.column.data" />
              </Label>
              <div className={css.splitter} />
            </Col>
          )}
        </Fragment>
      ))}
      <Col
        className={css.emptyHeaderCell}
      >
        <Label>
          <FormattedMessage id="ui-bulk-edit.layer.column.actions" />
        </Label>
      </Col>
    </Row>
  );
};

FolioFormTitle.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
