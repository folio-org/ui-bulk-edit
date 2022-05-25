import { FormattedMessage } from 'react-intl';
import {
  Headline,
  AccordionSet,
  AccordionStatus,
  MessageBanner,
} from '@folio/stripes/components';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { PreviewAccordion } from './PreviewAccordion';
import { ErrorsAccordion } from './ErrorsAccordion';
import {
  useDownloadLinks,
  useErrorsList,
  usePreviewRecords,
  useUserGroupsMap,
} from '../../../../API';
import { RootContext } from '../../../../context/RootContext';

export const Preview = ({ id, title, initial, capabilities }) => {
  const { setNewBulkFooterShown, setCountOfRecords } = useContext(RootContext);
  const { data } = useDownloadLinks(id);
  const { errors } = useErrorsList(id);
  const { items } = usePreviewRecords(id, capabilities);
  const { userGroups } = useUserGroupsMap();
  const [processedRecords, setProcessedRecords] = useState(0);

  const mappedErrors = errors?.map(e => {
    const [identifier, message] = e.message.split(',');

    return {
      ...e,
      identifier,
      message,
    };
  });

  useEffect(() => {
    if (data?.progress) {
      setProcessedRecords(data.progress.total - (errors?.length || 0));
      setCountOfRecords(data.progress.total);
    }
  }, [errors, data?.progress]);

  useEffect(() => {
    if (items?.length || errors?.length) {
      setNewBulkFooterShown(true);
    }
  }, [items, errors]);


  return (
    <AccordionStatus>
      {(!!processedRecords && !initial) && (
      <Headline size="large" margin="small">
        <MessageBanner type="success" contentClassName="SuccessBanner">
          <FormattedMessage
            id="ui-bulk-edit.recordsSuccessfullyChanged"
            values={{ value: processedRecords }}
          />
        </MessageBanner>
      </Headline>
      )}
      {title && (
        <Headline size="large" margin="medium">
          {title}
        </Headline>
      )}
      <AccordionSet>
        {!!items?.length && <PreviewAccordion items={items} userGroups={userGroups} />}
        {!!mappedErrors?.length && (
          <ErrorsAccordion
            errors={mappedErrors}
            entries={data?.progress?.processed}
            matched={processedRecords}
          />
        )}
      </AccordionSet>
    </AccordionStatus>
  );
};

Preview.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  initial: PropTypes.bool,
  capabilities: PropTypes.string,
};
