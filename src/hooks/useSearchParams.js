import { useHistory } from 'react-router-dom';
import { useMemo } from 'react';

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

  return {
    step,
    criteria,
    identifier,
    capabilities,
    initialFileName,
    queryRecordType,
    processedFileName,
  };
};
