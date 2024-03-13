import { useHistory } from 'react-router-dom';
import { useMemo } from 'react';
import { CRITERIA } from '../constants';

export const useSearchParams = () => {
  const history = useHistory();
  const { location: { search } } = history;
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const criteria = searchParams.get('criteria');
  const identifier = searchParams.get('identifier');
  const step = searchParams.get('step');
  const capabilities = searchParams.get('capabilities');
  const queryRecordType = searchParams.get('queryRecordType');
  const initialFileName = searchParams.get('fileName');
  const processedFileName = searchParams.get('processedFileName');
  const progress = searchParams.get('progress');

  const currentRecordType = criteria === CRITERIA.QUERY ? queryRecordType : capabilities;

  return {
    step,
    progress,
    criteria,
    identifier,
    capabilities,
    initialFileName,
    queryRecordType,
    processedFileName,
    currentRecordType,
  };
};
