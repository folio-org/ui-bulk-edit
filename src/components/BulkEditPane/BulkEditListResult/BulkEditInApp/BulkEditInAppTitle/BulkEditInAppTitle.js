import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Col,
  Row,
  Label,
} from '@folio/stripes/components';

import css from './BulkEditInAppTitle.css';
import { FINAL_ACTIONS } from '../../../../../constants';

export const BulkEditInAppTitle = ({ fields }) => {
  const shouldRenderAction = (action) => action?.name && (!FINAL_ACTIONS.includes(action?.name) || action?.parameters?.length > 0);
  const getNonEmptyActions = (field) => field.actionsDetails.actions.filter(Boolean);
  const getFilledNonFinalActions = (field) => field.actionsDetails.actions.filter(shouldRenderAction);

  // Find the field with the most non-empty + non-final actions and based on this field render the header for all rows
  const field = fields.reduce((acc, item) => {
    if (getNonEmptyActions(item).length > getNonEmptyActions(acc).length
      || getFilledNonFinalActions(item).length > getFilledNonFinalActions(acc).length) {
      return item;
    }

    return acc;
  }, fields[0]);

  const nonEmptyActions = getNonEmptyActions(field);

  return (
    <>
      <Row>
        <Col
          className={css.headerCell}
          sm={2}
        >
          <Label required>
            <FormattedMessage id="ui-bulk-edit.layer.column.options" />
          </Label>
        </Col>

        {nonEmptyActions.map((action) => (
          <>
            <Col
              className={css.headerCell}
              sm={2}
            >
              <Label required>
                <FormattedMessage id="ui-bulk-edit.layer.column.actions" />
              </Label>
              <div className={css.splitter} />
            </Col>
            {shouldRenderAction(action) && (
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
          </>
        ))}
        <Col
          className={css.emptyHeaderCell}
        >
          <FormattedMessage id="ui-bulk-edit.layer.column.actions" />
        </Col>
      </Row>
    </>
  );
};

BulkEditInAppTitle.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
};
