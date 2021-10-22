import { useEffect, useState } from 'react';
import io from 'socket.io-client';

import styles from './styles.module.scss'
import { api } from '../../services/api';
import logo from '../../assets/logo.svg'


type Message = {
    id: string;
    text: string;
    user: {
        name: string;
        avatar_url: string;
    }
}

let messageQueue: Message[] = [];

const socket = io('http://localhost:4000');

socket.on('new_message', (newMessage: Message) => {
    messageQueue.push(newMessage)
}) 

export function MessageList() {

    const [messages, setMessages] = useState<Message[]>([], )

    useEffect(() => {
       setInterval(() => {
            if(messageQueue.length > 0) {
                setMessages( prevState => [
                    messageQueue[0],
                    prevState[0],
                    prevState[1]
                ].filter(Boolean))

                messageQueue.shift()
            }
        }, 3000)
    }, [])

    useEffect(() => {
        api.get<Message[]>('messages/last3').then((response:any) => {
            setMessages(response.data);
        })
    }, [])

    return (
        <div className={styles.messageListWrapper}>
            <img src={logo} alt="DoWhile 2021" />
            <ul className={styles.messageList}>
                {messages.map(data => {
                    return (
                        <li key={data.id} className={styles.message}>
                            <p className={styles.messageContent}>
                                {data.text}
                            </p>
                            <div className={styles.messageUser}>
                                <div className={styles.userImage}>
                                    <img src={data.user.avatar_url} alt="Brunno Borges" />
                                </div>
                                <span>{data.user.name}</span>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}