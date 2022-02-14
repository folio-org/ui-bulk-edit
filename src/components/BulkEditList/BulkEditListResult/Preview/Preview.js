import { useMemo } from 'react';
import { useParams, useLocation } from 'react-router';
import { useIntl, FormattedMessage } from 'react-intl';
import {
  Headline,
  AccordionSet,
  AccordionStatus,
  MessageBanner,
} from '@folio/stripes/components';
import { PreviewAccordion } from './PreviewAccordion';
import { ErrorsAccordion } from './ErrorsAccordion';
import { useDownloadLinks, useErrorsList, usePreviewRecords } from '../../../../API';

export const Preview = () => {
  const intl = useIntl();
  const location = useLocation();
  const { id } = useParams();
  const { data } = useDownloadLinks(id);
  const { errors } = useErrorsList(id);
  const { users } = usePreviewRecords(id);

  const mappedErrors = errors?.map(e => {
    const [identifier, message] = e.message.split(',');

    return {
      ...e,
      identifier,
      message,
    };
  });

  const processed = data?.progress?.processed;
  const fileUploadedName = useMemo(() => new URLSearchParams(location.search).get('fileName'), [location.search]);

  const title = useMemo(() => {
    const queryText = new URLSearchParams(location.search).get('queryText');

    if (queryText) return intl.formatMessage({ id: 'ui-bulk-edit.preview.query.title' }, { queryText });

    if (fileUploadedName) return intl.formatMessage({ id: 'ui-bulk-edit.preview.file.title' }, { fileUploadedName });

    return null;
  }, [fileUploadedName, intl, location.search]);

  return (
    <AccordionStatus>
      {processed && (
      <Headline size="large" margin="small">
        <MessageBanner type="success" contentClassName="SuccessBanner">
          <FormattedMessage
            id="ui-bulk-edit.recordsSuccessfullyChanged"
            values={{ value: processed }}
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
        <PreviewAccordion users={users} />
        <ErrorsAccordion
          errors={mappedErrors}
          entries={data?.progress?.total}
          matched={data?.progress?.processed}
        />
      </AccordionSet>
    </AccordionStatus>
  );
};

