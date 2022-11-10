export const handleAdd = ({ getFilteredFields, fields, fieldTemplate, getDefaultAction, setFields }) => {
  const filteredFields = getFilteredFields([...fields, { ...fieldTemplate, action: '', option: '' }]);
  const initializedFields = filteredFields.map((f, i) => {
    const value = f.options[0].value;

    return i === filteredFields.length - 1
      ? ({ ...f, option: value, ...getDefaultAction(value) })
      : f;
  });

  const finalizedFields = getFilteredFields(initializedFields);

  setFields(finalizedFields);
};

export const isAddButtonShown = (index, fields, options) => {
  return index === fields.length - 1 && fields.length !== options.length - 1;
};
