export const sortAlphabetically = (array, placeholder) => array.sort((a, b) => {
  const collator = new Intl.Collator();

  if (a.label === placeholder) {
    return -1;
  } else if (b.label === placeholder) {
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

export const sortAlphabeticallyActions = (array, placeholder) => {
  const collator = new Intl.Collator();

  return array?.sort((a, b) => {
    if (a.label === placeholder) {
      return -1;
    } else if (b.label === placeholder) {
      return 1;
    } else {
      return collator.compare(a.label, b.label);
    }
  });
};
