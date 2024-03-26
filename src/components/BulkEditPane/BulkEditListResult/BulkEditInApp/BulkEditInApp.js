import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Headline,
  Accordion,
  Loading,
  Layout,
} from '@folio/stripes/components';

import { useState } from 'react';
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
import { getDefaultActions } from './ContentUpdatesForm/helpers';

export const BulkEditInApp = ({
  onContentUpdatesChanged,
}) => {
  const { formatMessage } = useIntl();
  const {
    currentRecordType,
    initialFileName
  } = useSearchParams();

  const isItemRecordType = currentRecordType === CAPABILITIES.ITEM;
  const isHoldingsRecordType = currentRecordType === CAPABILITIES.HOLDING;

  const { itemNotes, isItemNotesLoading } = useItemNotes({ enabled: isItemRecordType });
  const { holdingsNotes, isHoldingsNotesLoading } = useHoldingsNotes({ enabled: isHoldingsRecordType });

  const optionsMap = {
    [CAPABILITIES.ITEM]: getItemsOptions(formatMessage, itemNotes),
    [CAPABILITIES.USER]: getUserOptions(formatMessage),
    [CAPABILITIES.HOLDING]: getHoldingsOptions(formatMessage, holdingsNotes),
    [CAPABILITIES.INSTANCE]: getInstanceOptions(formatMessage),
  };

  const options = optionsMap[currentRecordType];
  const showContentUpdatesForm = options && !isItemNotesLoading && !isHoldingsNotesLoading;
  const sortedOptions = sortAlphabetically(options, formatMessage({ id:'ui-bulk-edit.options.placeholder' }));

  const defaultOptionValue = options[0].value;

  const fieldTemplate = {
    options,
    option: defaultOptionValue,
    actionsDetails: getDefaultActions({
      option: defaultOptionValue,
      capability: currentRecordType,
      options,
      formatMessage
    }),
  };

  const [fields, setFields] = useState([fieldTemplate]);

  return (
    <>
      <Headline size="large" margin="medium">
        <FormattedMessage id="ui-bulk-edit.preview.file.title" values={{ fileUploadedName: initialFileName }} />
      </Headline>
      <Accordion
        label={<FormattedMessage id="ui-bulk-edit.layer.title" />}
      >
        <BulkEditInAppTitle fields={fields} />
        {showContentUpdatesForm ? (
          <ContentUpdatesForm
            fieldTemplate={fieldTemplate}
            fields={fields}
            setFields={setFields}
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
