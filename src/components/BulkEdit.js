import {
  Switch,
  Route,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BulkEditPane } from './BulkEditPane/BulkEditPane';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const BulkEdit = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route
          path="/bulk-edit"
          component={BulkEditPane}
        />
      </Switch>
    </QueryClientProvider>
  );
};

export default BulkEdit;
