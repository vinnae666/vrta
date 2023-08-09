import * as Yup from 'yup';
import React, { useState, useEffect, useCallback } from "react";

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import {
    Link,
    Stack,
    Checkbox,
    TextField,
    IconButton,
    InputAdornment,
    FormControlLabel
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import {
  StreamType,
  useApp,
  useCreateStream,
  useFeedsByAddress,
  useMonetizeStream,
  useStore,
  useUnlockStream,
  useUpdateStream,
} from "@dataverse/hooks";
import { Model, ModelParser, Output } from "@dataverse/model-parser";
import { DataverseContextProvider } from "@dataverse/hooks";

import app from "../../../../output/app.json";
import pacakage from "../../../../package.json";



const appVersion = pacakage.version;
const modelParser = new ModelParser(app as Output);
// ----------------------------------------------------------------------

const LoginForm = (): JSX.Element => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const LoginSchema = Yup.object().shape({
        email: Yup.string()
            .email('Email must be a valid email address')
            .required('Email is required'),
        password: Yup.string().required('Password is required')
    });

    const formik = useFormik({
      initialValues: {
          email: '',
          password: '',
          remember: true
      },
        validationSchema: LoginSchema,
        onSubmit: () => {
            navigate('/dashboard', { replace: true });
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

    const handleShowPassword = () => {
        setShowPassword((show) => !show);
    };

    const {
      state: { address, pkh },
    } = useStore();


    const { connectApp } = useApp({
      onSuccess: (result) => {
        console.log("[connect]connect app success, result:", result);
      },
    });

    const connect = useCallback(async () => {
      connectApp({
        appId: modelParser.appId,
      });
    }, [modelParser]);

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={connect}>
                <Stack spacing={3}>
                    <TextField
                        fullWidth
                        autoComplete="username"
                        type="email"
                        label="Email address"
                        {...getFieldProps('email')}
                        error={Boolean(touched.email && errors.email)}
                        helperText={touched.email && errors.email}
                    />

                    <TextField
                        fullWidth
                        autoComplete="current-password"
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        {...getFieldProps('password')}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleShowPassword} edge="end">
                                        <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        error={Boolean(touched.password && errors.password)}
                        helperText={touched.password && errors.password}
                    />
                </Stack>

                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ my: 2 }}
                >
                    <FormControlLabel
                        control={
                            <Checkbox {...getFieldProps('remember')} checked={values.remember} />
                        }
                        label="Remember me"
                    />

                    <Link component={RouterLink} variant="subtitle2" to="#">
                        Forgot password?
                    </Link>
                </Stack>

                <LoadingButton
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                >
                    Login
                </LoadingButton>
            </Form>
        </FormikProvider>
    );
};

export default LoginForm;
