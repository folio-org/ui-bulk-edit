import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Checkbox } from '@folio/stripes/components';

import { useDerivativeModification } from '../../../../../../hooks';

import css from '../../../../BulkEditPane.css';

export const ActionParameters = memo(({ actionParameters, action, path, name, onChange }) => {
  const { formatMessage } = useIntl();

  useDerivativeModification({ onChange, actionParameters, path, action, name });

  return (
    <div className={css.additionalParameters}>
      {actionParameters?.map((parameter, idx) => {
        if (parameter.onlyForActions && !parameter.onlyForActions.includes(action)) return null;

        return (
          <Checkbox
            key={parameter.key}
            name={parameter.key}
            label={formatMessage({ id: `ui-bulk-edit.layer.action.apply.${parameter.key}` })}
            checked={parameter.value}
            onChange={e => onChange({ path: [...path, name, idx], val: e.target.checked, name: 'value' })}
          />
        );
      })}
    </div>
  );
});

ActionParameters.propTypes = {
  action: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
