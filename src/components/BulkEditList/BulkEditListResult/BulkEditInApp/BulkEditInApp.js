import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Headline,
  Accordion,
} from '@folio/stripes/components';

import { BulkEditInAppTitle } from './BulkEditInAppTitle/BulkEditInAppTitle';
import { BulkEditInAppItemForm } from './BulkEditInAppItemForm';
import { BulkEditInAppUserForm } from './BulkEditInAppUserForm';
import { CAPABILITIES } from '../../../../constants';

export const BulkEditInApp = (
  {
    title,
    onContentUpdatesChanged,
    typeOfBulk,
  },
) => {
  const getFilteredFields = (initialFields) => {
    return initialFields.map(f => {
      const uniqOptions = new Set(initialFields.map(i => i.option));

      const optionsExceptCurrent = [...uniqOptions].filter(u => u !== f.option);

      return {
        ...f,
        options: f.options.filter(o => !optionsExceptCurrent.includes(o.value)),
      };
    });
  };

  return (
    <>
      <Headline size="large" margin="medium">
        {title}
      </Headline>
      <Accordion
        label={<FormattedMessage id="ui-bulk-edit.layer.title" />}
      >
        <BulkEditInAppTitle />
        {typeOfBulk === CAPABILITIES.ITEM ?
          <BulkEditInAppItemForm
            onContentUpdatesChanged={onContentUpdatesChanged}
            typeOfBulk={typeOfBulk}
            getFilteredFields={getFilteredFields}
          /> :
          <BulkEditInAppUserForm
            onContentUpdatesChanged={onContentUpdatesChanged}
            typeOfBulk={typeOfBulk}
            getFilteredFields={getFilteredFields}
          />
          }
      </Accordion>
    </>
  );
};

BulkEditInApp.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onContentUpdatesChanged: PropTypes.func,
  typeOfBulk: PropTypes.string,
};
