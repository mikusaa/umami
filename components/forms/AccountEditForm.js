import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Formik, Form, Field } from 'formik';
import { useRouter } from 'next/router';
import { post } from 'lib/web';
import Button from 'components/common/Button';
import FormLayout, {
  FormButtons,
  FormError,
  FormMessage,
  FormRow,
} from 'components/layout/FormLayout';

const initialValues = {
  username: '',
  password: '',
};

const validate = ({ user_id, username, password }) => {
  const errors = {};

  if (!username) {
    errors.username = <FormattedMessage id="label.required" defaultMessage="Required" />;
  }
  if (!user_id && !password) {
    errors.password = <FormattedMessage id="label.required" defaultMessage="Required" />;
  }

  return errors;
};

export default function AccountEditForm({ values, onSave, onClose }) {
  const { basePath } = useRouter();
  const [message, setMessage] = useState();

  const handleSubmit = async values => {
    const { ok, data } = await post(`${basePath}/api/account`, values);

    if (ok) {
      onSave();
    } else {
      setMessage(
        data || <FormattedMessage id="message.failure" defaultMessage="Something went wrong." />,
      );
    }
  };

  return (
    <FormLayout>
      <Formik
        initialValues={{ ...initialValues, ...values }}
        validate={validate}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <FormRow>
              <label htmlFor="username">
                <FormattedMessage id="label.username" defaultMessage="Username" />
              </label>
              <Field name="username" type="text" />
              <FormError name="username" />
            </FormRow>
            <FormRow>
              <label htmlFor="password">
                <FormattedMessage id="label.password" defaultMessage="Password" />
              </label>
              <Field name="password" type="password" />
              <FormError name="password" />
            </FormRow>
            <FormButtons>
              <Button type="submit" variant="action">
                <FormattedMessage id="label.save" defaultMessage="Save" />
              </Button>
              <Button onClick={onClose}>
                <FormattedMessage id="label.cancel" defaultMessage="Cancel" />
              </Button>
            </FormButtons>
            <FormMessage>{message}</FormMessage>
          </Form>
        )}
      </Formik>
    </FormLayout>
  );
}
