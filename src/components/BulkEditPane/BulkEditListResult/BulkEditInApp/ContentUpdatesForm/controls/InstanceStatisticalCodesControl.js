import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Loading, MultiSelection } from '@folio/stripes/components';

import { FIELD_VALUE_KEY, getLabelByValue, sortWithoutPlaceholder } from '../helpers';
import { useStatisticalCodes } from '../../../../../../hooks/api/useStatisticalCodes';
import { customMultiSelectionFilter } from '../../../../../../utils/helpers';


export const InstanceStatisticalCodesControl = ({ actionName, actionValue, actionIndex, onChange }) => {
  const { formatMessage } = useIntl();

  const { statisticalCodes, isStatisticalCodesLoading } = useStatisticalCodes();
  const sortedStatisticalCodes = sortWithoutPlaceholder(statisticalCodes);
  const title = getLabelByValue(sortedStatisticalCodes, actionValue);

  if (isStatisticalCodesLoading) return <Loading size="large" />;

  return (
    <div title={title}>
      <MultiSelection
        key={actionName}
        id="statisticalCodes"
        value={actionValue}
        onChange={value => {
          onChange({
            actionIndex,
            value,
            fieldName: FIELD_VALUE_KEY,
          });
        }}
        placeholder={formatMessage({ id: 'ui-bulk-edit.layer.statisticalCode' })}
        aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.statisticalCode' })}
        dataOptions={statisticalCodes}
        dirty={!!actionValue}
        filter={customMultiSelectionFilter}
      />
    </div>
  );
};

InstanceStatisticalCodesControl.propTypes = {
  actionValue: PropTypes.arrayOf(PropTypes.object),
  actionName: PropTypes.string,
  actionIndex: PropTypes.number,
  onChange: PropTypes.func,
};
