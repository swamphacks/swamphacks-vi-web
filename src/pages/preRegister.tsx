import React from 'react';
import {Formik, Form, Field} from 'formik';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import * as yup from 'yup';
import styled from 'styled-components';
import * as firebase from 'firebase';
import '../css/styles.css';

import InputField from '../components/InputField';
import TextAreaField from '../components/TextAreaField';
import preRegisterSign from '../assets/pre-register-sign.svg';
import Button from '../components/Button';
import {tsPropertySignature} from '@babel/types';

const PreRegisterSign = styled.img.attrs(props => ({
  src: preRegisterSign,
  className: 'hidden-image'
}))`
  width: 35vw;
  min-width: 500px;
  margin-top: -200px;
  padding-bottom: 80px;
  font-family: Ink Free;
`;

const Background = styled.div`
  background-image: radial-gradient(
    circle at 0% 100%,
    #5599ff 15%,
    #00ffff 85%
  );
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
`;

const FormContainer = styled(Form)`
  width: 30vw;
  min-width: 400px;
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
`;

type FormData = {
  name?: string;
  email?: string;
  suggestions?: string;
};

const schema = yup.object().shape({
  name: yup.string().required('This field is required.'),
  email: yup
    .string()
    .email('Must be a valid email.')
    .required('This field is required.'),
  suggestions: yup.string().notRequired()
});

interface Props extends RouteComponentProps<any> {}

const PreRegister: React.FC<Props> = props => {
  return (
    <Background>
      <PreRegisterSign />
      <Formik
        initialValues={{}}
        validationSchema={schema}
        onSubmit={(values: FormData, {setSubmitting}) => {
          const db = firebase.firestore();
          let docRef = db
            .collection('years')
            .doc('2020')
            .collection('preRegisteredUsers')
            .doc(values.email);
          let res = docRef
            .set({
              name: values.name,
              dateRegistered: Date.now(),
              suggestions: values.suggestions
            })
            .then(() => setSubmitting(false));
        }}
      >
        {({isSubmitting}) => (
          <FormContainer>
            <Field
              type="name"
              name="name"
              placeholder="Name"
              component={InputField}
            />
            <br />
            <Field
              type="email"
              name="email"
              placeholder="Email"
              component={InputField}
            />
            <br />
            <Field
              type="suggestions"
              name="suggestions"
              placeholder="React, MongoDB, machine learning, etc..."
              title="What topics would you like to see in workshops at SwampHacks VI?"
              component={TextAreaField}
            />
            <br />
            <div
              style={{display: 'flex', width: '100%', justifyContent: 'center'}}
            >
              <Button
                variant="red"
                style={{width: '40%'}}
                onClick={() => props.history.push('/')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="green"
                style={{width: '40%'}}
              >
                Submit
              </Button>
            </div>
          </FormContainer>
        )}
      </Formik>
    </Background>
  );
};

export default withRouter(PreRegister);
