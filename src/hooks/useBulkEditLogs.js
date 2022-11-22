import { useQuery } from 'react-query';
import { bulkEditLogsData } from '../constants/fakeData';


export const useBulkEditLogs = ({ search }) => {
  const { data, isLoading } = useQuery(
    {
      queryKey: ['bulkEditLogs', search],
      queryFn: () => bulkEditLogsData,
    },
  );

  return {
    logs: data || [],
    isLoading,
  };
};
