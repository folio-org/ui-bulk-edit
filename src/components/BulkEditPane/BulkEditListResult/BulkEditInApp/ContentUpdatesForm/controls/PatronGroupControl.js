import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Select } from '@folio/stripes/components';

import { sortAlphabeticallyWithoutGroups } from '../../../../../../utils/sortAlphabetically';
import { getLabelByValue } from '../../helpers';
import { usePatronGroup } from '../../../../../../hooks/api';
import { CAPABILITIES } from '../../../../../../constants';
import { useSearchParams } from '../../../../../../hooks';


export const PatronGroupControl = ({ value, path, name, onChange }) => {
  const { formatMessage } = useIntl();
  const { currentRecordType } = useSearchParams();

  const isUserCapability = currentRecordType === CAPABILITIES.USER;

  const { userGroups } = usePatronGroup({ enabled: isUserCapability });

  const groups = Object.values(userGroups).reduce(
    (acc, { id, group, desc }) => {
      const description = desc ? `(${desc})` : '';
      const groupObject = {
        value: id,
        label: `${group} ${description}`,
      };

      acc.push(groupObject);

      return acc;
    }, [{
      value: '',
      label: formatMessage({ id: 'ui-bulk-edit.layer.selectPatronGroup' }),
    }]
  );
  const patronGroups = sortAlphabeticallyWithoutGroups(groups);
  const title = getLabelByValue(patronGroups, value);

  return (
    <div title={title}>
      <Select
        dataOptions={patronGroups}
        value={value}
        onChange={e => onChange({ path, val: e.target.value, name })}
        data-testid={`select-patronGroup-${path}`}
        aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.patronGroupSelect' })}
        marginBottom0
        dirty={!!value}
      />
    </div>
  );
};

PatronGroupControl.propTypes = {
  value: PropTypes.string,
  path: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
};
