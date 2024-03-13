import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Headline,
  Accordion,
  Loading,
  Layout,
} from '@folio/stripes/components';

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
import { useSearchParams } from '../../../../hooks/useSearchParams';

export const BulkEditInApp = ({
  onContentUpdatesChanged,
}) => {
  const intl = useIntl();
  const {
    currentRecordType,
    initialFileName
  } = useSearchParams();

  const isItemRecordType = currentRecordType === CAPABILITIES.ITEM;
  const isHoldingsRecordType = currentRecordType === CAPABILITIES.HOLDING;

  const { itemNotes, isItemNotesLoading } = useItemNotes({ enabled: isItemRecordType });
  const { holdingsNotes, isHoldingsNotesLoading } = useHoldingsNotes({ enabled: isHoldingsRecordType });

  const optionsMap = {
    [CAPABILITIES.ITEM]: getItemsOptions(intl.formatMessage, itemNotes),
    [CAPABILITIES.USER]: getUserOptions(intl.formatMessage),
    [CAPABILITIES.HOLDING]: getHoldingsOptions(intl.formatMessage, holdingsNotes),
    [CAPABILITIES.INSTANCE]: getInstanceOptions(intl.formatMessage),
  };

  const options = optionsMap[currentRecordType];
  const showContentUpdatesForm = options && !isItemNotesLoading && !isHoldingsNotesLoading;
  const sortedOptions = sortAlphabetically(options, intl.formatMessage({ id:'ui-bulk-edit.options.placeholder' }));

  return (
    <>
      <Headline size="large" margin="medium">
        <FormattedMessage id="ui-bulk-edit.preview.file.title" values={{ fileUploadedName: initialFileName }} />
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
  onContentUpdatesChanged: PropTypes.func,
};
