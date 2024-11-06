import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import logo from '../assets/images/logo.svg';
import { useToast } from '../context/ToastContext';
import { API_BASE_URL } from '../constant/constants';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import './Auth.css';
import { useAuth } from '../context/AuthContext';

const SigninSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const SignupSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  name: Yup.string().required('Required'),
  password: Yup.string()
    .min(8, 'Too Short!')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, 
      'Must contain 8 characters, one letter, one number and one special character')
    .required('Required'),
});

const Auth: React.FC<{ signUp: boolean }> = ({ signUp }) => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(signUp);
  const { isAuthenticated, setIsAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/app');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const endpoint = isSignUp ? 'signup' : 'signin';
      await axios.post(
        `${API_BASE_URL}/auth/${endpoint}`, 
        values,
        { withCredentials: true }
      );
      
      setIsAuthenticated(true);
      navigate('/app');
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || `Failed to ${isSignUp ? 'sign up' : 'sign in'}. Please try again.`
        : 'An unexpected error occurred';
      addToast('error', errorMessage);
    }
    setSubmitting(false);
  };

  return (
    <div 
      className="flex align-items-center justify-content-center h-screen auth-box"
    >
      <div className="surface-card p-4 border-round w-full lg:w-6 background">
        <div className="text-center mb-5">
          <img src={logo} alt="hyper" height={50} className="mb-3" />
          <div className="text-900 text-3xl font-medium mb-3">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </div>
          <span className="text-600 font-medium line-height-3">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </span>
          <a 
            className="font-medium no-underline ml-2 cursor-pointer"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Sign In' : 'Create today!'}
          </a>
        </div>

        <Formik
          initialValues={isSignUp ? { email: '', name: '', password: '' } : { email: '', password: '' }}
          validationSchema={isSignUp ? SignupSchema : SigninSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div>
                <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
                <Field
                  id="email"
                  name="email"
                  as={InputText}
                  placeholder="Email address"
                  className={`w-full ${errors.email && touched.email ? 'p-invalid' : 'mb-3'}`}
                />
                {errors.email && touched.email && <p className="p-error mt-1 mb-3">{errors.email}</p>}

                {isSignUp && (
                  <>
                    <label htmlFor="name" className="block text-900 font-medium mb-2">Name</label>
                    <Field
                      id="name"
                      name="name"
                      as={InputText}
                      placeholder="Full name"
                      className={`w-full ${errors.name && touched.name ? 'p-invalid' : 'mb-3'}`}
                    />
                    {errors.name && touched.name && <p className="p-error mt-1 mb-3">{errors.name}</p>}
                  </>
                )}

                <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  as={InputText}
                  placeholder="Password"
                  className={`w-full ${errors.password && touched.password ? 'p-invalid' : 'mb-3'}`}
                />
                {errors.password && touched.password && <p className="p-error mt-1 mb-3">{errors.password}</p>}

                {!isSignUp && (
                  <div className="flex align-items-center justify-content-between mb-6">
                    <div className="flex align-items-center">
                    </div>
                    <a className="font-medium no-underline ml-2 text-right cursor-pointer">
                      Forgot your password?
                    </a>
                  </div>
                )}

                <Button 
                  type="submit" 
                  label={isSignUp ? "Sign Up" : "Sign In"} 
                  icon="pi pi-user" 
                  className={`w-full ${isSignUp && 'mt-3'}`} 
                  disabled={isSubmitting}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Auth; 