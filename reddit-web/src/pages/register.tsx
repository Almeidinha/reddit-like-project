import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Box,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React from "react";
import { useMutation } from "urql";
import { InputField } from "../components/InputField";
import { Wrapper } from "./Wrapper";

interface registerProps {}

const REGISTER_MUTATION = `
    mutation Register($username: String!, $password: String!) {
        register(options: { username: $username, password: $password }) {
        errors {
            field
            message
        }
        user {
            id
            username
        }
        }
    }`;

const Register: React.FC<registerProps> = ({}) => {
  const [, register] = useMutation(REGISTER_MUTATION);
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values) => {
          //console.log(values);
          return register({
            username: values.username,
            password: values.password,
          });
          //register(values);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={4}>
              <InputField
                name="username"
                placeholder="username..."
                label="UserName"
              ></InputField>
            </Box>
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password..."
                label="Password"
                type="password"
              ></InputField>
            </Box>
            <Button
              mt={4}
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
