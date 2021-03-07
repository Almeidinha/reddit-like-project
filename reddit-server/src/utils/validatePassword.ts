export const ValidatePassword = (password: string) => {
  let errors: Array<{ field: string; message: string }> = [];

  if (!/(?=.*[\d]{1,})/.test(password)) {
    errors.push({
      field: "newPassword",
      message: "password should contain at least two digit.",
    });
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push({
      field: "newPassword",
      message: "should contain at least one upper case.",
    });
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push({
      field: "newPassword",
      message: "should contain at least one lower case.",
    });
  }

  if (!/.{8,}/.test(password)) {
    errors.push({
      field: "newPassword",
      message: "should contain at least 8 characters.",
    });
  }

  return errors;
  /*
    /^
    (?=.*\d)          // should contain at least one digit
    (?=.*[a-z])       // should contain at least one lower case
    (?=.*[A-Z])       // should contain at least one upper case
    [a-zA-Z0-9]{8,}   // should contain at least 8 from the mentioned characters
    $/
    */
};
