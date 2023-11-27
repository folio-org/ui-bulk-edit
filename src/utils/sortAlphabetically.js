export const sortAlphabetically = (array, placeholder) => array.sort((a, b) => {
  if (a.label === placeholder) {
    return -1;
  } else if (placeholder) {
    return 1;
  } else {
    return a.label.localeCompare(b.label);
  }
});
