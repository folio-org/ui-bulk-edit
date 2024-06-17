import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Col, Select, TextArea } from '@folio/stripes/components';

import css from '../../../BulkEditPane.css';

const BulkEditMarkActionRow = ({
  subfieldIndex = null,
  actions,
  rowIndex,
  onActionChange,
  onDataChange
}) => {
  const { formatMessage } = useIntl();
  const hasError = (action, actionIndex) => !action.name
    && action.meta.required
    && actionIndex > 0
    && formatMessage({ id: 'ui-bulk-edit.error.required' });

  return actions.map((action, actionIndex) => !!action && (
    <Fragment key={actionIndex}>
      <Col className={`${css.column} ${css.actions}`}>
        <Select
          data-row-index={rowIndex}
          data-action-index={actionIndex}
          data-subfield-index={subfieldIndex}
          value={action.name}
          dirty={!!action.name}
          error={hasError(action, actionIndex)}
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
            key={dataIndex}
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

BulkEditMarkActionRow.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.object).isRequired,
  rowIndex: PropTypes.number.isRequired,
  subfieldIndex: PropTypes.number,
  onActionChange: PropTypes.func.isRequired,
  onDataChange: PropTypes.func.isRequired,
};

export default BulkEditMarkActionRow;
