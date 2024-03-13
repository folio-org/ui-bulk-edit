import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
} from '@folio/stripes/components';

import css from './BulkEditInAppTitle.css';

export const BulkEditInAppTitle = () => {
  return (
    <Row className={css.header}>
      <Col
        className={css.headerCell}
        sm={3}
      >
        <FormattedMessage id="ui-bulk-edit.layer.column.options" />
      </Col>
      <Col
        className={css.headerCell}
        sm={3}
      >
        <FormattedMessage id="ui-bulk-edit.layer.column.actions" />
      </Col>
      <Col
        className={css.emptyHeaderCell}
        sm={6}
      />
    </Row>
  );
};
