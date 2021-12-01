import PropTypes from 'prop-types';
import {
  Switch,
  Route,
} from 'react-router-dom';

import { NoResultsMessage } from './NoResultsMessage/NoResultsMessage';
import { Preview } from './Preview/Preview';

export const BulkEditListResult = ({ fileUploadedName }) => {
  return (
    <Switch>
      <Route path="/bulk-edit" exact component={NoResultsMessage} />
      <Route
        path="/bulk-edit/preview"
        exact
        component={
        () => <Preview fileUploadedName={fileUploadedName} />
      }
      />
    </Switch>
  );
};

BulkEditListResult.propTypes = {
  fileUploadedName: PropTypes.string,
};
