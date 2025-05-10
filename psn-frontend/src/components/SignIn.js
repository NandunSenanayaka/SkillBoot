import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";
import Spinner from "react-bootstrap/Spinner";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { RiLoginBoxLine } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";

import styles from "./styles/SignIn.module.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const [resData, setResData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  let navigate = useNavigate();

  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
  });

  async function postSignInInfo(inputData) {
    setIsLoading(true);
    try {
      const response = await axios({
        method: "post",
        url: "/api/v1/users/signin",
        data: {
          email: inputData.email,
          password: inputData.password,
        },
      });
      
      if (response.data !== null && response.data.status === "fail") {
        showWarningToast(response.data.message);
      }
      
      if (response.data !== null && response.data.status === "success") {
        setResData(response.data);
        
        localStorage.setItem("psnUserId", response.data.payload.user.id);
        localStorage.setItem("psnUserFirstName", response.data.payload.user.firstName);
        localStorage.setItem("psnUserLastName", response.data.payload.user.lastName);
        localStorage.setItem("psnUserEmail", response.data.payload.user.email);
        localStorage.setItem("psnToken", response.data.payload.token);
        
        toast.success("Sign in successful!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        setTimeout(() => {
          navigate("/newsfeed");
        }, 3000);
      }
    } catch (error) {
      showWarningToast("An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  }

  function showWarningToast(inputMessage) {
    toast.warn(inputMessage, {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }

  return (
    <Container fluid className={styles.container}>
      <div className={styles.menuBar}></div>
      <ToastContainer />
      <Formik
        validationSchema={schema}
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={(values, { setSubmitting }) => {
          postSignInInfo(values);
          setSubmitting(false);
        }}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          touched,
          errors,
        }) => (
          <Form
            noValidate
            onSubmit={handleSubmit}
            className={styles.formContainer}
          >
            <Row className="mb-4 text-center">
              <h1 className="text-success">LOG IN</h1>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="12" controlId="validationFormik01">
                <Form.Label className={styles.formLabel}>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.email && errors.email}
                  className={styles.formControl}
                  autoComplete="email"
                  disabled={isLoading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="12" controlId="validationFormik02">
                <Form.Label className={styles.formLabel}>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.password && errors.password}
                  className={styles.formControl}
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Button 
              type="submit" 
              variant="success" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  {" "}Loading...
                </>
              ) : (
                <>Sign In <RiLoginBoxLine /></>
              )}
            </Button>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="google-signin-tooltip">
                    Google sign-in coming soon!
                  </Tooltip>
                }
              >
                <Button
                  type="button"
                  style={{
                    background: '#fff',
                    color: '#444',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    padding: '0.5rem 1.5rem',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: '0 auto',
                    cursor: 'pointer',
                    transition: 'background 0.2s, box-shadow 0.2s',
                  }}
                  onClick={() => {}}
                  onMouseOver={e => e.currentTarget.style.background = '#f5f5f5'}
                  onMouseOut={e => e.currentTarget.style.background = '#fff'}
                >
                  <FcGoogle size={22} /> Sign in with Google
                </Button>
              </OverlayTrigger>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  );
}

export default SignIn;
