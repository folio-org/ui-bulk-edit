import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Headline,
  Accordion,
  Loading,
  Layout,
} from '@folio/stripes/components';

import { useLocation } from 'react-router';
import { BulkEditInAppTitle } from './BulkEditInAppTitle/BulkEditInAppTitle';
import { ContentUpdatesForm } from './ContentUpdatesForm/ContentUpdatesForm';
import {
  CAPABILITIES,
  getHoldingsOptions,
  getInstanceOptions,
  getItemsOptions,
  getUserOptions
} from '../../../../constants';
import { useItemNotes } from '../../../../hooks/api/useItemNotes';
import { useHoldingsNotes } from '../../../../hooks/api/useHoldingsNotes';
import { sortAlphabetically } from '../../../../utils/sortAlphabetically';

export const BulkEditInApp = ({
  onContentUpdatesChanged,
  capabilities,
}) => {
  const intl = useIntl();
  const location = useLocation();
  const search = new URLSearchParams(location.search);

  const fileUploadedName = search.get('fileName');
  const isItemCapability = capabilities === CAPABILITIES.ITEM;
  const isHoldingsCapability = capabilities === CAPABILITIES.HOLDING;

  const { itemNotes, isItemNotesLoading } = useItemNotes({ enabled: isItemCapability });
  const { holdingsNotes, isHoldingsNotesLoading } = useHoldingsNotes({ enabled: isHoldingsCapability });

  const optionsMap = {
    [CAPABILITIES.ITEM]: getItemsOptions(intl.formatMessage, itemNotes),
    [CAPABILITIES.USER]: getUserOptions(intl.formatMessage),
    [CAPABILITIES.HOLDING]: getHoldingsOptions(intl.formatMessage, holdingsNotes),
    [CAPABILITIES.INSTANCE]: getInstanceOptions(intl.formatMessage),
  };

  const options = optionsMap[capabilities];
  const showContentUpdatesForm = options && !isItemNotesLoading && !isHoldingsNotesLoading;
  const sortedOptions = sortAlphabetically(options, intl.formatMessage({ id:'ui-bulk-edit.options.placeholder' }));

  return (
    <>
      <Headline size="large" margin="medium">
        <FormattedMessage id="ui-bulk-edit.preview.file.title" values={{ fileUploadedName }} />
      </Headline>
      <Accordion
        label={<FormattedMessage id="ui-bulk-edit.layer.title" />}
      >
        <BulkEditInAppTitle />
        {showContentUpdatesForm ? (
          <ContentUpdatesForm
            options={sortedOptions}
            onContentUpdatesChanged={onContentUpdatesChanged}
          />
        ) : (
          <Layout className="display-flex centerContent">
            <Loading size="large" />
          </Layout>
        )}
      </Accordion>
    </>
  );
};

BulkEditInApp.propTypes = {
  capabilities: PropTypes.string,
  onContentUpdatesChanged: PropTypes.func,
};
