import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Headline,
  Accordion,
} from '@folio/stripes/components';

import { BulkEditInAppTitle } from './BulkEditInAppTitle/BulkEditInAppTitle';
import { ContentUpdatesForm } from './ContentUpdatesForm/ContentUpdatesForm';
import { CAPABILITIES, getHoldingsOptions, getItemsOptions, getUserOptions } from '../../../../constants';

export const BulkEditInApp = ({
  title,
  onContentUpdatesChanged,
  capabilities,
}) => {
  const intl = useIntl();

  const optionsMap = {
    [CAPABILITIES.ITEM]: getItemsOptions(intl.formatMessage),
    [CAPABILITIES.USER]: getUserOptions(intl.formatMessage),
    [CAPABILITIES.HOLDING]: getHoldingsOptions(intl.formatMessage),
  };

  return (
    <>
      <Headline size="large" margin="medium">
        {title}
      </Headline>
      <Accordion
        label={<FormattedMessage id="ui-bulk-edit.layer.title" />}
      >
        <BulkEditInAppTitle />
        <ContentUpdatesForm
          options={optionsMap[capabilities]}
          onContentUpdatesChanged={onContentUpdatesChanged}
        />
      </Accordion>
    </>
  );
};

BulkEditInApp.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  capabilities: PropTypes.string,
  onContentUpdatesChanged: PropTypes.func,
};
