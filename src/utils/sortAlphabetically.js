export const sortAlphabetically = (array, placeholder) => array.sort((a, b) => {
  if (a.label === placeholder) {
    return -1;
  } else if (placeholder) {
    return 1;
  } else {
    return a.label.localeCompare(b.label);
  }
});

export const sortAlphabeticallyActions = (array, placeholder) => {
  const collator = new Intl.Collator();

  return array.sort((a, b) => {
    if (a.label === placeholder) {
      return -1;
    } else if (b.label === placeholder) {
      return 1;
    } else {
      return collator.compare(a.label, b.label);
    }
  });
};
