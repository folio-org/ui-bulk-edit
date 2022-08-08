import {
  Switch,
  Route,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BulkEditList } from './BulkEditList/BulkEditList';

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
          component={BulkEditList}
        />
      </Switch>
    </QueryClientProvider>
  );
};

export default BulkEdit;
