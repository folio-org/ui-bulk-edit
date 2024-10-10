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
import { useStripes } from '@folio/stripes/core';

import { BulkEditInAppTitle } from './BulkEditInAppTitle/BulkEditInAppTitle';
import { ContentUpdatesForm } from './ContentUpdatesForm/ContentUpdatesForm';
import {
  CAPABILITIES,
  getHoldingsOptions,
  getInstanceOptions,
  getItemsOptions,
  getUserOptions
} from '../../../../constants';
import {
  useItemNotes,
  useHoldingsNotes,
  useInstanceNotes,
  useBulkOperationTenants,
  useHoldingsNotesEsc,
  useItemNotesEsc
} from '../../../../hooks/api';
import { sortAlphabetically } from '../../../../utils/sortAlphabetically';
import {
  usePathParams,
  useSearchParams
} from '../../../../hooks';
import { getDefaultActions } from './ContentUpdatesForm/helpers';

import { RootContext } from '../../../../context/RootContext';
import { removeDuplicatesByValue } from '../../../../utils/helpers';

export const BulkEditInApp = ({
  onContentUpdatesChanged,
}) => {
  const { title } = useContext(RootContext);
  const { user, okapi } = useStripes();
  const centralTenant = user?.user?.consortium?.centralTenantId;
  const tenantId = okapi.tenant;
  const isCentralTenant = tenantId === centralTenant;

  const { formatMessage } = useIntl();
  const { currentRecordType } = useSearchParams();
  const { id: bulkOperationId } = usePathParams('/bulk-edit/:id');
  const [fields, setFields] = useState([]);

  const isItemRecordType = currentRecordType === CAPABILITIES.ITEM;
  const isHoldingsRecordType = currentRecordType === CAPABILITIES.HOLDING;
  const isInstanceRecordType = currentRecordType === CAPABILITIES.INSTANCE;

  const { itemNotes, isItemNotesLoading } = useItemNotes({ enabled: isItemRecordType });
  const { holdingsNotes, isHoldingsNotesLoading } = useHoldingsNotes({ enabled: isHoldingsRecordType });
  const { instanceNotes, isInstanceNotesLoading } = useInstanceNotes({ enabled: isInstanceRecordType });
  const { data: tenants } = useBulkOperationTenants(bulkOperationId);
  const { notesEsc: itemNotesEsc, isFetching: isItemsNotesEscLoading } = useItemNotesEsc(tenants, 'option', { enabled: isItemRecordType && Boolean(tenants?.length) });
  const { notesEsc: holdingsNotesEsc, isFetching: isHoldingsNotesEscLoading } = useHoldingsNotesEsc(tenants, 'option', { enabled: isHoldingsRecordType && (Boolean(tenants?.length)) });

  const options = useMemo(() => ({
    [CAPABILITIES.ITEM]: getItemsOptions(formatMessage, removeDuplicatesByValue(isCentralTenant ? itemNotesEsc : itemNotes, tenants)),
    [CAPABILITIES.USER]: getUserOptions(formatMessage),
    [CAPABILITIES.HOLDING]: getHoldingsOptions(formatMessage, isCentralTenant ? removeDuplicatesByValue(holdingsNotesEsc, tenants) : holdingsNotes),
    [CAPABILITIES.INSTANCE]: getInstanceOptions(formatMessage, instanceNotes),
  })[currentRecordType], [formatMessage, isCentralTenant, itemNotesEsc, itemNotes, tenants, holdingsNotesEsc, holdingsNotes, instanceNotes, currentRecordType]);

  const showContentUpdatesForm = options && !isItemNotesLoading && !isInstanceNotesLoading && !isItemsNotesEscLoading && !isHoldingsNotesLoading && !isHoldingsNotesEscLoading;
  const sortedOptions = sortAlphabetically(options, formatMessage({ id:'ui-bulk-edit.options.placeholder' }));

  const fieldTemplate = useMemo(() => {
    return ({
      id: uniqueId(),
      options,
      option: '',
      tenants: [],
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
