import { UserNamePasswordInput } from "../resolvers/UserNamePasswordInput";
import { validEmail } from "./validEmail";

export const validateRegister = (options: UserNamePasswordInput) => {
  //let errors: { field: string; message: string }[] = [];
  let errors: Array<{ field: string; message: string }> = [];
  if (!validEmail(options.email)) {
    errors.push({
      field: "email",
      message: "invalid email address.",
    });
  }

  if (options.username.length <= 2) {
    errors.push({
      field: "username",
      message: "length must be greater than 2",
    });
  }

  if (options.username.includes("@")) {
    errors.push({
      field: "username",
      message: "User name cannot have an '@'.",
    });
  }

  if (options.password.length <= 2) {
    errors.push({
      field: "password",
      message: "length must be greater than 2",
    });
  }

  return errors;
};
