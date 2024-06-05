import React, { useContext } from 'react';
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
import { useSearchParams } from '../../../../hooks';
import { ProgressBar } from '../../../shared/ProgressBar/ProgressBar';
import { RootContext } from '../../../../context/RootContext';

const PreviewContainer = () => {
  const { title } = useContext(RootContext);
  const { id } = useParams();
  const {
    step,
    criteria,
    currentRecordType,
    progress
  } = useSearchParams();
  const lowerCaseRecordType = currentRecordType?.toLowerCase();

  const { bulkDetails, isLoading } = useBulkOperationDetails({ id, additionalQueryKeys: [step, progress] });

  const isInitial = step === EDITING_STEPS.UPLOAD;

  if (progress === criteria) return <ProgressBar />;

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
