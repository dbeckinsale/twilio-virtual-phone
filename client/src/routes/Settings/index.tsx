import { useCallback, useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import useAlertCard, { AlertMessageType } from "../../hooks/useAlertCard";
import useApi from "../../hooks/useApi";
import { PhoneContext } from "../../providers/PhoneProvider";
import { ITwilioPhoneNumber } from "../../Types";

export default function Settings() {

  const { phoneList, setPhoneList } = useContext(PhoneContext);
  const { deletePhone } = useApi();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onDeletePhone = useCallback((phone_sid: string) => {

    setIsLoading(true);
    /*deletePhone(phone_id).then(data => {
      if (setPhoneList) {
        setPhoneList(data);
      }
      setIsLoading(false);
    })*/

  }, [setPhoneList, deletePhone]);

  return null;

  /*return (
    <Row className="justify-content-md-center">
      <Col md={10}>
        <Row>
          <Col>
            <Link to={`/settings/phone/new`} replace>
              <Button className="mb-3" type='button' variant='primary'>Add New Number</Button>
            </Link>
          </Col>
        </Row>
        {isLoading ? <LoadingRow /> : <PhoneListTable phoneList={phoneList} onDeletePhone={onDeletePhone} />}
        <Row>
          <Col>
            <Alert variant="success">
              <Alert.Heading>Twiml Application</Alert.Heading>
              <hr />
              <div className="ms-2 me-auto">
                <p className="m-0 fw-light text-muted" style={{ fontSize: '0.8rem' }}>{config?.twimlApp.sid}</p>
                <p className="fw-bold m-0">{config?.twimlApp.friendlyName}</p>
                <p className="m-0 fw-light text-muted" style={{ fontSize: '0.8rem' }}>SMS URL : {config?.twimlApp.smsUrl}</p>
                <p className="m-0 fw-light text-muted" style={{ fontSize: '0.8rem' }}>Voice URL : {config?.twimlApp.voiceUrl}</p>
              </div>
            </Alert>
          </Col>
        </Row>
      </Col>
    </Row>
  )*/
}

type PhoneListTableProps = {
  phoneList: ITwilioPhoneNumber[];
  onDeletePhone: (phone_sid: string) => void
}

function PhoneListTable({ phoneList, onDeletePhone }: PhoneListTableProps) {

  const { setAlertMessage, alertDom } = useAlertCard({ dismissible: false });

  useEffect(() => {

    if (phoneList.length === 0) {
      setAlertMessage({
        type: AlertMessageType.WARNING,
        message: 'No Phone Number Configured'
      });
    }

  }, [phoneList, setAlertMessage]);

  if (alertDom) {
    return alertDom;
  };


  return (
    <Row>
      <Col>
        <ListGroup className="mb-3" as="ol">
          {phoneList.map((item, index) => {
            return (
              <ListGroup.Item
                key={index} className="d-flex justify-content-between align-items-center"
              >
                <div className="ms-2 me-auto">
                  <p className="m-0 fw-light text-muted" style={{ fontSize: '0.8rem' }}>{item.sid}</p>
                  <p className="fw-bold m-0">{item.friendlyName}</p>
                  <p className="my-1">{item.phoneNumber}</p>
                  <p className="m-0 fw-light text-muted" style={{ fontSize: '0.8rem' }}>SMS Application ID : {item.smsApplicationSid}</p>
                  <p className="m-0 fw-light text-muted" style={{ fontSize: '0.8rem' }}>Voice Application ID : {item.voiceApplicationSid}</p>
                </div>
                <Link to={`/settings/phone/${item.sid}/edit`} state={{ selectedPhone: item }} replace>
                  <Button className="mx-2" type='button' variant='warning'>Edit</Button>
                </Link>
                <Button className="mx-2" type='button' variant='danger' onClick={() => { onDeletePhone(item.sid) }} >Remove</Button>
              </ListGroup.Item>
            )
          })}
        </ListGroup>
      </Col>
    </Row>
  )
}