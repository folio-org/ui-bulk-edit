import PropTypes from 'prop-types';
import {
  Switch,
  Route,
} from 'react-router-dom';

import { NoResultsMessage } from './NoResultsMessage/NoResultsMessage';
import { Preview } from './Preview/Preview';

const BulkEditListResult = ({ fileUploadedName }) => {
  return (
    <Switch>
      <Route path="/bulk-edit" exact component={NoResultsMessage} />
      <Route
        path="/bulk-edit/:id"
        component={() => <Preview fileUploadedName={fileUploadedName} />}
      />
    </Switch>
  );
};

export default BulkEditListResult;

BulkEditListResult.propTypes = {
  fileUploadedName: PropTypes.string,
};
