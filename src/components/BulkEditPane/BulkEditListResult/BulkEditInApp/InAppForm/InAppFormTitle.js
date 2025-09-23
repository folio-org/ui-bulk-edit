import classnames from 'classnames/bind';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';

import { Col, Row, Label } from '@folio/stripes/components';

import { FINAL_ACTIONS } from '../../../../../constants';
import { shouldShowValueColumn } from '../helpers';

import css from '../../../BulkEditPane.css';

const cx = classnames.bind(css);

const getMaxField = (fields) => {
  const filterFinal = action => !FINAL_ACTIONS.includes(action.name);

  return fields.reduce((max, field) => {
    const currentActions = field.actionsDetails.actions || [];
    const maxActions = max.actionsDetails.actions || [];

    if (currentActions.length > maxActions.length) {
      return field;
    }

    if (currentActions.length === maxActions.length) {
      if (!currentActions[0]?.name) return max;

      const currentFiltered = currentActions.filter(filterFinal);
      const maxFiltered = maxActions.filter(filterFinal);
      const currentActionParams = currentActions.reduce((acc, action) => acc + (action.parameters?.length || 0), 0);
      const maxActionParams = maxActions.reduce((acc, action) => acc + (action.parameters?.length || 0), 0);

      if (currentFiltered.length > maxFiltered.length || currentActionParams > maxActionParams) {
        return field;
      }
    }

    return max;
  }, fields[0]);
};

export const InAppFormTitle = ({
  fields,
  isNonInteractive,
}) => {
  if (!fields.length) return null;

  const maxField = getMaxField(fields);

  return (
    <Row className={cx('inAppTitleRow', { isNonInteractive })}>
      <Col
        className={css.headerCell}
        sm={2}
      >
        <Label required={!isNonInteractive}>
          <FormattedMessage id="ui-bulk-edit.layer.column.options" />
        </Label>
      </Col>
      {maxField.actionsDetails.actions?.map((item) => (
        <Fragment key={item.name}>
          <Col
            className={css.headerCell}
            sm={2}
          >
            <Label required={!isNonInteractive}>
              <FormattedMessage id="ui-bulk-edit.layer.column.actions" />
            </Label>
            <div className={css.splitter} />
          </Col>
          {shouldShowValueColumn(item.name, item.parameters) && (
            <Col
              className={css.headerCell}
              sm={2}
            >
              <Label required={!isNonInteractive}>
                <FormattedMessage id="ui-bulk-edit.layer.column.data" />
              </Label>
              <div className={css.splitter} />
            </Col>
          )}
        </Fragment>
      ))}
      {!isNonInteractive && (
        <Col className={css.emptyHeaderCell}>
          <Label>
            <FormattedMessage id="ui-bulk-edit.layer.column.actions" />
          </Label>
        </Col>
      )}
    </Row>
  );
};

InAppFormTitle.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isNonInteractive: PropTypes.bool,
};
