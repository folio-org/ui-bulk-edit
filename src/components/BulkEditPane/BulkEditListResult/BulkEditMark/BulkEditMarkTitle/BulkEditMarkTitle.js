import React, { Fragment, useContext } from 'react';
import { FormattedMessage } from 'react-intl';

import { Col, Icon, Label, Row, Tooltip } from '@folio/stripes/components';

import css from '../../BulkEditInApp/BulkEditInAppTitle/BulkEditInAppTitle.css';
import { RootContext } from '../../../../../context/RootContext';

const getFielMaxColumnsCount = (field) => {
  let sum = field.actions.length;

  field.actions.forEach(action => {
    sum += action?.data.length || 0;
  });

  return sum;
};


const BulkEditMarkTitle = () => {
  const { fields } = useContext(RootContext);
  const field = fields.reduce((acc, item) => {
    if (getFielMaxColumnsCount(item) > getFielMaxColumnsCount(acc)) {
      return item;
    }

    return acc;
  }, fields[0]);

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
      {field.actions.map((action, index) => !!action && (
        <Fragment key={index}>
          <Col
            key={index}
            className={`${css.headerCell} ${css.actions}`}
          >
            <Label required={action.meta.required}>
              <FormattedMessage id="ui-bulk-edit.layer.column.actions" />
            </Label>
            <div className={css.splitter} />
          </Col>
          {action.data.map((data, dataIndex) => (
            <Col
              key={dataIndex}
              className={`${css.headerCell} ${css.data}`}
            >
              <Label required={data.meta.required}>
                {data.meta.title}
              </Label>
              <div className={css.splitter} />
            </Col>
          ))}
        </Fragment>
      ))}
      <Col
        className={css.headerStickyCell}
      >
        <Label>
          <FormattedMessage id="ui-bulk-edit.layer.column.actions" />
        </Label>
      </Col>
    </Row>
  );
};

export default BulkEditMarkTitle;
