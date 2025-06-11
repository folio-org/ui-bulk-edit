import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';

import { Col, Icon, Label, Row, Tooltip } from '@folio/stripes/components';

import { DATA_KEYS, getFieldWithMaxColumns } from '../helpers';

import css from '../../../BulkEditPane.css';


export const MarcFormTitle = ({ fields }) => {
  const longestField = getFieldWithMaxColumns(fields);

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
          text={<FormattedMessage id="ui-bulk-edit.layer.marc.error.limited" />}
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
          <FormattedMessage id="ui-bulk-edit.layer.column.ind1" />
        </Label>
        <div className={css.splitter} />
      </Col>
      <Col
        className={`${css.headerCell} ${css.in}`}
      >
        <Label required>
          <FormattedMessage id="ui-bulk-edit.layer.column.ind2" />
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
      {longestField.actions.map((action, index) => !!action && (
        <Fragment key={index}>
          <Col
            key={index}
            className={`${css.headerCell} ${css.actions}`}
          >
            <Label required={index === 0}>
              <FormattedMessage id="ui-bulk-edit.layer.column.actions" />
            </Label>
            <div className={css.splitter} />
          </Col>
          {action.data.map((data, dataIndex) => (
            <Col
              key={dataIndex}
              className={`${css.headerCell} ${data.key === DATA_KEYS.VALUE ? css.data : css.subfield}`}
            >
              <Label>
                {data.key === DATA_KEYS.VALUE ? (
                  <FormattedMessage id="ui-bulk-edit.layer.column.data" />
                ) : (
                  <FormattedMessage id="ui-bulk-edit.layer.column.subfield" />
                )}
              </Label>
              <div className={css.splitter} />
            </Col>
          ))}
        </Fragment>
      ))}
      <Col className={`${css.headerCell} ${css.fill}`}>
        <div className={css.splitter} />
      </Col>
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

MarcFormTitle.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
};
