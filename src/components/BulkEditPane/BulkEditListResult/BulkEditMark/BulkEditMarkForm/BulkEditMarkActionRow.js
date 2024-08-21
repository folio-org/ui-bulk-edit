import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Col, Select, TextArea, TextField } from '@folio/stripes/components';

import css from '../../../BulkEditPane.css';
import { DATA_KEYS, getFieldWithMaxColumns, SUBFIELD_MAX_LENGTH } from '../helpers';
import { RootContext } from '../../../../../context/RootContext';


const BulkEditMarkActionRow = ({
  subfieldIndex = null,
  actions,
  rowIndex,
  onActionChange,
  onDataChange
}) => {
  const { fields } = useContext(RootContext);
  const { formatMessage } = useIntl();

  const longestField = getFieldWithMaxColumns(fields);
  const hasError = (action, actionIndex) => !action.name
    && action.meta.required
    && actionIndex > 0;

  const getRequiredClassname = (isRequired, value) => ((isRequired && !value) ? `${css.required}` : `${css.fullWidth}`);

  const renderDataControl = (data, actionIndex, dataIndex) => {
    // render empty subfield column to have the same structure in columns
    const emptySubfieldColumn = longestField?.actions[actionIndex].data[dataIndex].key !== data.key
      && <Col className={`${css.column} ${css.subfield}`} />;

    switch (data.key) {
      case DATA_KEYS.VALUE:
        return (
          <>
            {emptySubfieldColumn}
            <Col className={`${css.column} ${css.data}`}>
              <TextArea
                data-row-index={rowIndex}
                data-action-index={actionIndex}
                data-data-index={dataIndex}
                data-subfield-index={subfieldIndex}
                value={data.value}
                dirty={!!data.value}
                required={data.meta.required}
                validStylesEnabled
                name="value"
                noBorder={!data.value}
                placeholder=""
                onChange={onDataChange}
                rootClass={getRequiredClassname(data.meta.required, data.value)}
                hasClearIcon={false}
                marginBottom0
                aria-label={formatMessage({ id: 'ui-bulk-edit.layer.column.data' })}
                fullWidth
                lockWidth
              />
              {data.meta.required && <span className={css.asterisk} aria-hidden>*</span>}
            </Col>
          </>
        );

      case DATA_KEYS.SUBFIELD:
        return (
          <Col className={`${css.column} ${css.subfield}`}>
            <TextField
              data-row-index={rowIndex}
              data-action-index={actionIndex}
              data-data-index={dataIndex}
              data-subfield-index={subfieldIndex}
              value={data.value}
              required={data.meta.required}
              dirty={!!data.value}
              noBorder={!data.value}
              inputClass={getRequiredClassname(data.meta.required, data.value)}
              name="value"
              placeholder=""
              validStylesEnabled
              onChange={onDataChange}
              hasClearIcon={false}
              marginBottom0
              aria-label={formatMessage({ id: 'ui-bulk-edit.layer.column.data' })}
              maxLength={SUBFIELD_MAX_LENGTH}
            />
            {data.meta.required && (
            <span className={css.asterisk} aria-hidden>
              *
            </span>)
              }
          </Col>
        );

      default:
        return null;
    }
  };

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
          required={action.meta.required}
          marginBottom0
          aria-label={formatMessage({ id: 'ui-bulk-edit.layer.column.actions' })}
          fullWidth
        />
        {(action.meta.required && actionIndex > 0) && (
        <span className={css.asterisk} aria-hidden>
          *
        </span>)
          }
      </Col>
      {action.data.map((data, dataIndex) => renderDataControl(data, actionIndex, dataIndex))}
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
