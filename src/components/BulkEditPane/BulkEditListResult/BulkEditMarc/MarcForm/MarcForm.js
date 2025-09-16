import PropTypes from 'prop-types';
import React from 'react';
import { MarcFormTitle } from './MarcFormTitle';
import { MarcFormBody } from './MarcFormBody';

export const MarcForm = ({
  marcFields,
  setMarcFields,
  isNonInteractive,
}) => {
  return (
    <>
      <MarcFormTitle fields={marcFields} isNonInteractive={isNonInteractive} />
      <MarcFormBody
        setFields={setMarcFields}
        fields={marcFields}
        isNonInteractive={isNonInteractive}
      />
    </>
  );
};

MarcForm.propTypes = {
  marcFields: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setMarcFields: PropTypes.func.isRequired,
  isNonInteractive: PropTypes.bool,
};
