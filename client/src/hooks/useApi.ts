import { useCallback } from 'react';

//const API_HOSTNAME = "https://6f4b-2a01-cb00-573-7500-b5cc-6709-410c-a2fe.ngrok.io";
const API_HOSTNAME = process.env.REACT_APP_API_HOSTNAME || '';

export interface IPhone {
  phone_id: number;
  alias: string;
  number: string;
  created_on: Date;
}

export interface IMessage {
  message_id: number;
  from_number: string;
  from_phone_id: number | null;
  to_number: string;
  to_phone_id: number | null;
  body: string;
  created_on: Date;
}

export interface IConversation {
  contact_number: string;
  body: string;
  created_on: Date;
}

function useApi() {

  const sendMessage = useCallback(async ({ from, to, body }) => {

    const result = await fetch(`${API_HOSTNAME}/api/v1/message`,
      {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: from,
          to: to,
          body: body
        })
      }
    );

    const data = await result.json();

    return {
      ...data,
      created_on: new Date(data.created_on)
    };

  }, []);


  const getAllPhone = useCallback(async () => {

    const result = await fetch(`${API_HOSTNAME}/api/v1/phone`);
    const data = await result.json();

    return data.map((item: any) => {
      return {
        ...item,
        created_on: new Date(item.created_on)
      }
    }) as IPhone[];

  }, []);


  const getMessageByConversation = useCallback(async ({phone_id, contact_number}) => {

    const result = await fetch(`${API_HOSTNAME}/api/v1/message/phone/${phone_id}/conversation/${contact_number}`);
    const data = await result.json();

    return data.map((item: any) => {
      return {
        ...item,
        created_on: new Date(item.created_on)
      }
    }) as IMessage[];

  }, []);


  const getConversationListByPhoneId = useCallback(async (phone_id: number) => {

    const result = await fetch(`${API_HOSTNAME}/api/v1/message/phone/${phone_id}/conversation`);
    const data = await result.json();

    return data.map((item: any) => {
      return {
        ...item,
        created_on: new Date(item.created_on)
      }
    }) as IConversation[];

  }, []);


  return {
    sendMessage,
    getAllPhone,
    getMessageByConversation,
    getConversationListByPhoneId
  };
}




export default useApi;