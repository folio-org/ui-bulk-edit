export const TAG_FIELD_MAX_LENGTH = 3;
export const INDICATOR_FIELD_MAX_LENGTH = 1;
export const SUBFIELD_MAX_LENGTH = 1;

export const getDefaultMarkTemplate = (id) => ({
  id,
  value: '',
  in1: '\\',
  in2: '\\',
  subfield: '',
  action: '',
  subfields: []
});

export const isMarkFormValid = (fields) => {
  return fields.every(field => Object.values(field).every(Boolean));
};
