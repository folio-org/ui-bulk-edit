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
  useErrorsList,
  usePreviewRecords,
  useUserGroupsMap,
} from '../../../../API';
import { RootContext } from '../../../../context/RootContext';

export const Preview = ({ id, title, initial, capabilities, data }) => {
  const { setNewBulkFooterShown, setCountOfRecords } = useContext(RootContext);

  const { errors } = useErrorsList(id);
  const { items, totalRecords } = usePreviewRecords(id, capabilities);
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
      setProcessedRecords(data.progress.success);
      setCountOfRecords(data.progress.success);
    } else if (!data?.progress && totalRecords) {
      setCountOfRecords(totalRecords);
    }
  }, [errors, data?.progress, totalRecords]);

  useEffect(() => {
    if (items?.length || errors?.length) {
      setNewBulkFooterShown(true);
    }
  }, [items, errors]);

  return (
    <AccordionStatus>
      {!initial && (
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
            entries={data?.progress?.total}
            matched={data?.progress?.success}
            countOfErrors={data?.progress?.errors}
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
  data: PropTypes.shape({
    progress: PropTypes.object,
  }),
};
