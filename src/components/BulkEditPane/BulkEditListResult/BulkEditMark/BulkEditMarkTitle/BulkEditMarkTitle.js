import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Col, Icon, Label, Row, Tooltip } from '@folio/stripes/components';

import css from '../../BulkEditInApp/BulkEditInAppTitle/BulkEditInAppTitle.css';


const BulkEditMarkTitle = () => {
  return (
    <Row>
      <Col
        className={`${css.headerCell} ${css.field}`}
      >
        <Label required>
          <FormattedMessage id="ui-bulk-edit.layer.column.field" />
        </Label>
        <Tooltip
          id="field-tooltip"
          text="Limited to 5xx and 9xx."
        >
          {({ ref, ariaIds }) => (
            <Icon
              ref={ref}
              icon="info"
              size="small"
              aria-labelledby={ariaIds.text}
            />
          )}
        </Tooltip>
      </Col>

      <Col
        className={`${css.headerCell} ${css.in}`}
      >
        <Label required>
          <FormattedMessage id="ui-bulk-edit.layer.column.in1" />
        </Label>
        <div className={css.splitter} />
      </Col>
      <Col
        className={`${css.headerCell} ${css.in}`}
      >
        <Label required>
          <FormattedMessage id="ui-bulk-edit.layer.column.in2" />
        </Label>
        <div className={css.splitter} />
      </Col>
      <Col
        className={`${css.headerCell} ${css.subfield}`}
      >
        <Label required>
          <FormattedMessage id="ui-bulk-edit.layer.column.subfield" />
        </Label>
        <div className={css.splitter} />
      </Col>
      <Col
        className={`${css.headerCell} ${css.actions}`}
      >
        <Label required>
          <FormattedMessage id="ui-bulk-edit.layer.column.actions" />
        </Label>
        <div className={css.splitter} />
      </Col>
      <Col
        className={css.headerCell}
      >
        <Label>
          <FormattedMessage id="ui-bulk-edit.layer.column.actions" />
        </Label>
      </Col>
    </Row>
  );
};

export default BulkEditMarkTitle;
