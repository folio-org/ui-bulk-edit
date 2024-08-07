import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useContext, useEffect, useMemo, useState } from 'react';
import uniqueId from 'lodash/uniqueId';

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
import { useItemNotes, useHoldingsNotes, useInstanceNotes } from '../../../../hooks/api';
import { sortAlphabetically } from '../../../../utils/sortAlphabetically';
import { useSearchParams } from '../../../../hooks';
import { getDefaultActions } from './ContentUpdatesForm/helpers';

import { RootContext } from '../../../../context/RootContext';

export const BulkEditInApp = ({
  onContentUpdatesChanged,
}) => {
  const { title } = useContext(RootContext);
  const { formatMessage } = useIntl();
  const { currentRecordType } = useSearchParams();
  const [fields, setFields] = useState([]);

  const isItemRecordType = currentRecordType === CAPABILITIES.ITEM;
  const isHoldingsRecordType = currentRecordType === CAPABILITIES.HOLDING;
  const isInstanceRecordType = currentRecordType === CAPABILITIES.INSTANCE;

  const { itemNotes, isItemNotesLoading } = useItemNotes({ enabled: isItemRecordType });
  const { holdingsNotes, isHoldingsNotesLoading } = useHoldingsNotes({ enabled: isHoldingsRecordType });
  const { instanceNotes, isInstanceNotesLoading } = useInstanceNotes({ enabled: isInstanceRecordType });

  const options = useMemo(() => ({
    [CAPABILITIES.ITEM]: getItemsOptions(formatMessage, itemNotes),
    [CAPABILITIES.USER]: getUserOptions(formatMessage),
    [CAPABILITIES.HOLDING]: getHoldingsOptions(formatMessage, holdingsNotes),
    [CAPABILITIES.INSTANCE]: getInstanceOptions(formatMessage, instanceNotes),
  })[currentRecordType], [formatMessage, itemNotes, holdingsNotes, currentRecordType, instanceNotes]);

  const showContentUpdatesForm = options && !isItemNotesLoading && !isHoldingsNotesLoading && !isInstanceNotesLoading;
  const sortedOptions = sortAlphabetically(options, formatMessage({ id:'ui-bulk-edit.options.placeholder' }));

  const fieldTemplate = useMemo(() => {
    return ({
      id: uniqueId(),
      options,
      option: '',
      actionsDetails: getDefaultActions({
        option: '',
        capability: currentRecordType,
        options,
        formatMessage
      }),
    });
  }, [currentRecordType, formatMessage, options]);

  useEffect(() => {
    setFields([fieldTemplate]);
  }, [fieldTemplate]);

  return (
    <>
      <Headline size="large" margin="medium">
        {title}
      </Headline>
      <Accordion
        label={<FormattedMessage id="ui-bulk-edit.layer.title" />}
      >
        {showContentUpdatesForm ? (
          <>
            <BulkEditInAppTitle fields={fields} />
            <ContentUpdatesForm
              fieldTemplate={fieldTemplate}
              fields={fields}
              setFields={setFields}
              options={sortedOptions}
              onContentUpdatesChanged={onContentUpdatesChanged}
            />
          </>
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
