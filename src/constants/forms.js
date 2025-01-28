export const MARC_DEFAULT_BODY = {
  bulkOperationMarcRules: [],
  totalRecords: 0,
};

export const ADMINISTRATIVE_DEFAULT_BODY = {
  bulkOperationRules: [],
  totalRecords: 0,
};

export const MARC_FORM_INITIAL_STATE = [
  {
    tag: '',
    ind1: '\\',
    ind2: '\\',
    subfield: '',
    actions: [{
      name: '',
      data: []
    }],
    parameters: [],
    subfields: [],
  }
];

export const ADMINISTRATIVE_FORM_INITIAL_STATE = [
  {
    option: '',
    tenants: [],
    actions: [
      {
        initial: undefined,
        updated: undefined,
        type: undefined,
        tenants: [],
        updated_tenants: [],
        parameters: []
      }
    ]
  }
];
