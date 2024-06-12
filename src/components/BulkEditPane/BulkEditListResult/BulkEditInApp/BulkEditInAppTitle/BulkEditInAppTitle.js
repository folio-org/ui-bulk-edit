import { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Col,
  Row,
  Label,
} from '@folio/stripes/components';

import { FINAL_ACTIONS } from '../../../../../constants';
import css from '../../../BulkEditPane.css';

export const BulkEditInAppTitle = ({ fields }) => {
  if (!fields.length) return null;

  // Check if the action is final, it means that it should not be rendered in the data column
  const isNotFinalAction = (actionName) => !FINAL_ACTIONS.includes(actionName);
  // Check if the action has parameters that should be rendered only for specific actions
  const hasActionParams = (actionName, actionParams) => {
    const areSomeItemsSpecific = actionParams?.some(param => param.onlyForActions && !param.onlyForActions.includes(actionName));

    return actionParams?.length > 0 && !areSomeItemsSpecific;
  };

  // Check if the additional data column should be rendered
  const shouldRenderDataColumn = (action) => action?.name && (isNotFinalAction(action?.name) || hasActionParams(action?.name, action?.parameters));

  const getNonEmptyActionsOrParams = (field) => field.actionsDetails.actions.filter(Boolean);
  const getFilledNonFinalActions = (field) => field.actionsDetails.actions.filter(shouldRenderDataColumn);

  // Find the field with the most non-empty + non-final actions and based on this field render the header for all rows
  const field = fields.reduce((acc, item) => {
    if (getNonEmptyActionsOrParams(item).length > getNonEmptyActionsOrParams(acc).length
      || getFilledNonFinalActions(item).length > getFilledNonFinalActions(acc).length) {
      return item;
    }

    return acc;
  }, fields[0]);

  const nonEmptyActions = getNonEmptyActionsOrParams(field);

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

      {nonEmptyActions.map((action, index) => (
        <Fragment key={index}>
          <Col
            className={css.headerCell}
            sm={2}
          >
            <Label required>
              <FormattedMessage id="ui-bulk-edit.layer.column.actions" />
            </Label>
            <div className={css.splitter} />
          </Col>
          {shouldRenderDataColumn(action) && (
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

BulkEditInAppTitle.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
};
