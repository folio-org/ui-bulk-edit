export const getFullName = (user) => {
  let fullName = user?.lastName || '';
  let givenName = user?.preferredFirstName || user?.firstName || '';
  const middleName = user?.middleName || '';

  if (middleName) {
    givenName += `${givenName ? ' ' : ''}${middleName}`;
  }

  if (givenName) {
    fullName += `${fullName ? ', ' : ''}${givenName}`;
  }

  return fullName;
};
