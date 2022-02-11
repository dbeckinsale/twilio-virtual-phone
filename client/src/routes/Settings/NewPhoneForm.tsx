import { useCallback, useContext, useState } from 'react';
import useApi from '../../hooks/useApi';
import useAlertCard, { AlertMessageType } from '../../hooks/useAlertCard';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { PhoneContext } from '../../providers/PhoneProvider';
import { Link, useNavigate } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import useForm, { FormSchema, ValidationSchema } from '../../hooks/useForm';


const stateSchema: FormSchema = {
  alias: { value: '', errorMessage: '', isInvalid: false },
  number: { value: '', errorMessage: '', isInvalid: false }
};

const validationStateSchema: ValidationSchema = {
  alias: {
    required: true
  },
  number: {
    required: true,
    validator: {
      regEx: /^\+[1-9]\d{1,14}$/,
      errorMessage: "Invalid E.164 Number format"
    }
  }
};

function NewPhoneForm() {

  const { setPhoneList } = useContext(PhoneContext);
  let navigate = useNavigate();
  const { setAlertMessage, alertDom } = useAlertCard({ dismissible: true });
  const { createPhone } = useApi();

  const [isAdding, setIsAdding] = useState<boolean>(false);

  const { state, handleOnChange, handleOnSubmit } = useForm(stateSchema, validationStateSchema);

  const processCreatePhone = useCallback((state) => {

    let isMounted = true;

    setIsAdding(true);
    setAlertMessage(null);

    createPhone({
      alias: state.alias.value,
      number: state.number.value
    })
      .then(
        (data) => {

          if (isMounted) {
            if (setPhoneList) {
              setPhoneList(data);
            }

            navigate(`/settings`, { replace: true });
          }

        },
        (error) => {
          if (isMounted) {
            setIsAdding(false);
            setAlertMessage({
              type: AlertMessageType.ERROR,
              message: error.message
            });
          }
        }
      )

    return () => {
      isMounted = false;
    }

  }, [createPhone, setAlertMessage, navigate, setPhoneList]);



  return (
    <Row className="justify-content-md-center">
      <Col md={10}>
        <Card>
          <Card.Body>
            {alertDom}
            <Form onSubmit={(e) => { handleOnSubmit(e, processCreatePhone) }}>
              <Form.Group className="mb-3" controlId="alias">
                <Form.Label>Alias :</Form.Label>
                <Form.Control value={state.alias.value} name='alias' isInvalid={state.alias.isInvalid} onChange={handleOnChange} placeholder="Alias / Friendly name of the Number" />
                <div className="invalid-feedback">{state.alias.errorMessage}</div>
              </Form.Group>
              <Form.Group className="mb-3" controlId="number">
                <Form.Label>Number :</Form.Label>
                <Form.Control value={state.number.value} name='number' isInvalid={state.number.isInvalid} onChange={handleOnChange} placeholder="Enter the Number in E.164 format : Example +33609474040" />
                <div className="invalid-feedback">{state.number.errorMessage}</div>
              </Form.Group>
              <Button variant="primary" type="submit" disabled={isAdding}>{isAdding ? 'Adding...' : 'Add'}</Button>{' '}
              <Link to={`/settings`} replace>
                <Button variant="danger" type="button">Cancel</Button>
              </Link>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default NewPhoneForm;