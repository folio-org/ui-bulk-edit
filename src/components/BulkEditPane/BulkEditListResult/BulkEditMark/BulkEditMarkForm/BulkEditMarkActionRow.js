import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';

import { Col, Select, TextArea } from '@folio/stripes/components';

import css from '../../BulkEditInApp/BulkEditInApp.css';

const BulkEditMarkActionRow = ({
  actions,
  rowIndex,
  subfieldIndex,
  onActionChange,
  onDataChange
}) => {
  const { formatMessage } = useIntl();

  return actions.map((action, actionIndex) => !!action && (
    <Fragment key={actionIndex}>
      <Col className={`${css.column} ${css.actions}`}>
        <Select
          data-row-index={rowIndex}
          data-action-index={actionIndex}
          data-subfield-index={subfieldIndex}
          value={action.name}
          dirty={!!action.name}
          name="action"
          dataOptions={action.meta.options}
          disabled={action.meta.disabled}
          onChange={onActionChange}
          marginBottom0
          aria-label={formatMessage({ id: 'ui-bulk-edit.layer.column.actions' })}
        />
      </Col>
      <Col className={`${css.column} ${css.data}`}>
        {action.data.map((data, dataIndex) => (
          <TextArea
            data-row-index={rowIndex}
            data-action-index={actionIndex}
            data-data-index={dataIndex}
            data-subfield-index={subfieldIndex}
            value={data.value}
            dirty={!!data.value}
            name="value"
            placeholder=""
            onChange={onDataChange}
            hasClearIcon={false}
            marginBottom0
            aria-label={formatMessage({ id: 'ui-bulk-edit.layer.column.data' })}
          />
        ))}
      </Col>
    </Fragment>
  ));
};

export default BulkEditMarkActionRow;
