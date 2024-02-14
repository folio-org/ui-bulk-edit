import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router';

import {
  Layout,
  Loading
} from '@folio/stripes/components';

import { useBulkOperationDetails } from '../../../../hooks/api';
import {
  CRITERIA,
  EDITING_STEPS
} from '../../../../constants';
import { Preview } from '../Preview/Preview';

import { NoResultsMessage } from '../NoResultsMessage/NoResultsMessage';
import { useSearchParams } from '../../../../hooks/useSearchParams';

const PreviewContainer = () => {
  const intl = useIntl();
  const { id } = useParams();
  const {
    step,
    criteria,
    initialFileName,
    currentRecordType,
  } = useSearchParams();
  const lowerCaseRecordType = currentRecordType?.toLowerCase();

  const { bulkDetails, isLoading } = useBulkOperationDetails({ id, additionalQueryKeys: [step] });

  const title = useMemo(() => {
    if (bulkDetails?.fqlQuery) return intl.formatMessage({ id: 'ui-bulk-edit.preview.query.title' }, { queryText: bulkDetails.fqlQuery });

    return intl.formatMessage({ id: 'ui-bulk-edit.preview.file.title' }, { fileUploadedName: initialFileName });
  }, [bulkDetails?.fqlQuery, initialFileName]);

  const isInitial = step === EDITING_STEPS.UPLOAD;

  if (criteria === CRITERIA.LOGS) {
    return <NoResultsMessage />;
  } else if (isLoading) {
    return (
      <Layout className="display-flex centerContent">
        <Loading size="large" />
      </Layout>
    );
  } else {
    return (
      <Preview
        title={title}
        id={id}
        capabilities={lowerCaseRecordType}
        bulkDetails={bulkDetails}
        isInitial={isInitial}
      />
    );
  }
};

export default PreviewContainer;
