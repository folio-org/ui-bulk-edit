import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Accordion, Layout } from '@folio/stripes/components';

import { InAppForm } from '../../BulkEditPane/BulkEditListResult/BulkEditInApp/InAppForm/InAppForm';
import { APPROACHES } from '../../../constants';
import { MarcForm } from '../../BulkEditPane/BulkEditListResult/BulkEditMarc/MarcForm/MarcForm';

export const BulkEditProfilesMarcForm = ({
  fields,
  setFields,
  marcFields,
  setMarcFields,
  options,
  entityType,
  isAdministrativeFormPristine,
  isNonInteractive,
}) => {
  return (
    <>
      <Accordion
        label={<FormattedMessage id="ui-bulk-edit.layer.title" />}
      >
        <InAppForm
          fields={fields}
          setFields={setFields}
          options={options}
          recordType={entityType}
          approach={APPROACHES.MARC}
          derivedFieldsConfig={{ isActive: !isAdministrativeFormPristine }}
          isNonInteractive={isNonInteractive}
        />
      </Accordion>
      <Layout className="marginTop1">
        <Accordion
          label={<FormattedMessage id="ui-bulk-edit.layer.title.marc" />}
        >
          <MarcForm
            marcFields={marcFields}
            setMarcFields={setMarcFields}
            isNonInteractive={isNonInteractive}
          />
        </Accordion>
      </Layout>
    </>
  );
};

BulkEditProfilesMarcForm.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setFields: PropTypes.func.isRequired,
  marcFields: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setMarcFields: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  entityType: PropTypes.string.isRequired,
  isAdministrativeFormPristine: PropTypes.bool,
  isNonInteractive: PropTypes.bool,
};
