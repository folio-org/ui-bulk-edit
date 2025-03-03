import React, { useContext } from 'react';
import { useParams } from 'react-router';

import { Layout, Loading } from '@folio/stripes/components';

import { useBulkOperationDetails } from '../../../../hooks/api';
import { CRITERIA } from '../../../../constants';
import { PreviewContainer } from './PreviewContainer/PreviewContainer';
import { NoResultsMessage } from '../NoResultsMessage/NoResultsMessage';
import { useSearchParams } from '../../../../hooks';
import { ProgressBar } from '../../../shared/ProgressBar/ProgressBar';
import { RootContext } from '../../../../context/RootContext';


export const PreviewLayout = () => {
  const { title } = useContext(RootContext);
  const { id } = useParams();
  const {
    step,
    criteria,
    progress
  } = useSearchParams();

  const { bulkDetails, isLoading } = useBulkOperationDetails({ id, additionalQueryKeys: [step, progress] });

  if (progress === criteria) return <ProgressBar />;

  if (criteria === CRITERIA.LOGS) return <NoResultsMessage />;

  if (isLoading) {
    return (
      <Layout className="display-flex centerContent">
        <Loading size="large" />
      </Layout>
    );
  }

  return (
    <PreviewContainer
      title={title}
      bulkDetails={bulkDetails}
    />
  );
};
