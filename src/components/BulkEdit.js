import {
  Switch,
  Route,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import { BulkEditListContainter } from './BulkEditList/BulkEditListContainer';

const queryClient = new QueryClient();

const BulkEdit = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route
          path="/bulk-edit"
          component={BulkEditListContainter}
        />
      </Switch>
    </QueryClientProvider>
  );
};

export default BulkEdit;
