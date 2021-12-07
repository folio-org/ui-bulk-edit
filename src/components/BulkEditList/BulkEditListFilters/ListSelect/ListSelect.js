import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { Select } from '@folio/stripes/components';

import { identifierOptions } from '../../../../constants/optionsRecordIdentifiers';

export const ListSelect = ({ disabled, onSelectIdentifier }) => {
  const intl = useIntl();

  const options = identifierOptions.map((el) => ({
    value: el.value,
    label: intl.formatMessage({ id: el.label }),
    disabled: el.disabled,
  }));

  return (
    <Select
      dataOptions={options}
      arial-label={intl.formatMessage({ id: 'ui-bulk-edit.list.filters.recordIdentifier' })}
      label={<FormattedMessage id="ui-bulk-edit.list.filters.recordIdentifier" />}
      defaultValue={options[0].value}
      disabled={disabled}
      onChange={e => onSelectIdentifier(e.target.value)}
    />
  );
};

ListSelect.propTypes = {
  onSelectIdentifier: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
