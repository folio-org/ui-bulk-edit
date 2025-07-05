import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Checkbox } from '@folio/stripes/components';

import { NOTES_PARAMETERS_KEYS } from '../../../../../../constants';

import css from '../../../../BulkEditPane.css';

export const ActionParameters = memo(({ actionParameters, action, path, name, onChange }) => {
  const { formatMessage } = useIntl();

  return (
    <div className={css.additionalParameters}>
      {actionParameters?.map((parameter, idx) => {
        if ((parameter.onlyForActions && !parameter.onlyForActions.includes(action))
          || NOTES_PARAMETERS_KEYS.includes(parameter.key)) return null;

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
  actionParameters: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: PropTypes.bool.isRequired,
    onlyForActions: PropTypes.arrayOf(PropTypes.string),
  })),
  path: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
  name: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
