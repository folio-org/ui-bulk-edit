import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Headline,
  Accordion,
} from '@folio/stripes/components';

import { useLocation } from 'react-router';
import { BulkEditInAppTitle } from './BulkEditInAppTitle/BulkEditInAppTitle';
import { ContentUpdatesForm } from './ContentUpdatesForm/ContentUpdatesForm';
import { CAPABILITIES, getHoldingsOptions, getItemsOptions, getUserOptions } from '../../../../constants';

export const BulkEditInApp = ({
  onContentUpdatesChanged,
  capabilities,
}) => {
  const intl = useIntl();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const fileUploadedName = search.get('fileName');

  const optionsMap = {
    [CAPABILITIES.ITEM]: getItemsOptions(intl.formatMessage),
    [CAPABILITIES.USER]: getUserOptions(intl.formatMessage),
    [CAPABILITIES.HOLDING]: getHoldingsOptions(intl.formatMessage),
  };

  return (
    <>
      <Headline size="large" margin="medium">
        <FormattedMessage id="ui-bulk-edit.preview.file.title" values={{ fileUploadedName }} />
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
  capabilities: PropTypes.string,
  onContentUpdatesChanged: PropTypes.func,
};
