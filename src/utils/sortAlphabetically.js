export const sortAlphabetically = (array) => array?.sort((a, b) => {
  const collator = new Intl.Collator();

  // empty values are always first as they are placeholders
  if (!a.value) {
    return -1;
  } else if (!b.value) {
    return 1;
  }
  // Compare based on category
  const aCategory = a.categoryName || '';
  const bCategory = b.categoryName || '';
  const categoryComparison = collator.compare(aCategory, bCategory);

  // If one item has no category, compare label to category name
  if (!a.categoryName && b.categoryName) {
    return collator.compare(a.label, bCategory);
  } else if (a.categoryName && !b.categoryName) {
    return collator.compare(aCategory, b.label);
  }

  // If same category, sort based on label with lower priority
  if (categoryComparison === 0) {
    return collator.compare(a.label, b.label);
  }

  // Prioritize sorting based on category
  return categoryComparison;
});

export const sortAlphabeticallyWithoutGroups = (array) => {
  const collator = new Intl.Collator();

  return array?.sort((a, b) => {
    if (!a.value) {
      return -1;
    } else if (!b.value) {
      return 1;
    } else {
      return collator.compare(a.label, b.label);
    }
  });
};

export const sortAlphabeticallyComponentLabels = (array, formatMessage) => {
  const collator = new Intl.Collator();

  if (!array) {
    return [];
  }

  return [...array].sort((a, b) => {
    // empty values are always first as they are placeholders
    if (!a.value) {
      return -1;
    } else if (!b.value) {
      return 1;
    } else {
      return collator.compare(
        formatMessage({ id: a.label.props.id }),
        formatMessage({ id: b.label.props.id })
      );
    }
  });
};
