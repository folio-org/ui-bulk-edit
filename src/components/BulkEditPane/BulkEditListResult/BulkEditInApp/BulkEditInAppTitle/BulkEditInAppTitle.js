import { FormattedMessage } from 'react-intl';
import { maxBy } from 'lodash/math';
import PropTypes from 'prop-types';

import {
  Col,
  Row,
  Label,
} from '@folio/stripes/components';

import css from './BulkEditInAppTitle.css';
import { FINAL_ACTIONS } from '../../../../../constants';

export const BulkEditInAppTitle = ({ fields }) => {
  const field = maxBy(fields, (item) => item.actionsDetails.actions.filter(i => !!i).length);
  const nonEmptyActions = field.actionsDetails.actions.filter(Boolean);

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
            </Col>
            {action.name && (!FINAL_ACTIONS.includes(action.name) || action.parameters?.length > 0) && (
              <Col
                className={css.headerCell}
                sm={2}
              >
                <Label required>
                  <FormattedMessage id="ui-bulk-edit.layer.column.data" />
                </Label>
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
