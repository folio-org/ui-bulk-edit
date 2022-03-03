import { FormattedMessage } from 'react-intl';
import {
  Headline,
  AccordionSet,
  AccordionStatus,
  MessageBanner,
} from '@folio/stripes/components';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { PreviewAccordion } from './PreviewAccordion';
import { ErrorsAccordion } from './ErrorsAccordion';
import {
  useDownloadLinks,
  useErrorsList,
  usePreviewRecords,
  useUserGroupsMap,
} from '../../../../API';

export const Preview = ({ id, title }) => {
  const { data } = useDownloadLinks(id);
  const { errors } = useErrorsList(id);
  const { users } = usePreviewRecords(id);
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
    if (errors?.length === 0 && data?.progress) setProcessedRecords(data.progress.total);
    if (errors?.length && data?.progress) setProcessedRecords(data.progress.total - errors.length);
  }, [errors, data?.progress]);


  return (
    <AccordionStatus>
      {!!processedRecords && (
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
        {!!users?.length && <PreviewAccordion users={users} userGroups={userGroups} />}
        {!!mappedErrors?.length && (
          <ErrorsAccordion
            errors={mappedErrors}
            entries={data?.progress?.total}
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
};
