import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Loading, MultiSelection } from '@folio/stripes/components';

import { getLabelByValue, sortWithoutPlaceholder } from '../../helpers';
import { useStatisticalCodes } from '../../../../../../hooks/api';
import { customMultiSelectionFilter } from '../../../../../../utils/helpers';


export const InstanceStatisticalCodesControl = ({ value, name, path, onChange }) => {
  const { formatMessage } = useIntl();

  const { statisticalCodes, isStatisticalCodesLoading } = useStatisticalCodes();
  const sortedStatisticalCodes = sortWithoutPlaceholder(statisticalCodes);
  const title = getLabelByValue(sortedStatisticalCodes, value);

  const handleChange = val => {
    onChange({
      path,
      name,
      val,
    });
  };

  if (isStatisticalCodesLoading) return <Loading size="large" />;

  return (
    <div title={title}>
      <MultiSelection
        id="statisticalCodes"
        value={value}
        onChange={handleChange}
        placeholder={formatMessage({ id: 'ui-bulk-edit.layer.statisticalCode' })}
        aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.statisticalCode' })}
        dataOptions={statisticalCodes}
        dirty={!!value}
        filter={customMultiSelectionFilter}
      />
    </div>
  );
};

InstanceStatisticalCodesControl.propTypes = {
  value: PropTypes.string,
  path: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  name: PropTypes.string,
  onChange: PropTypes.func,
};
