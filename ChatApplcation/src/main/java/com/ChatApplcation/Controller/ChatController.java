package com.ChatApplcation.Controller;

import com.ChatApplcation.Model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/message") //   /app/message
    @SendTo("/chatroom/public")
    private Message  recivePublicMessage(@Payload Message message){
        return  message;
    }


    // send message to a particular user

    @MessageMapping("/private-message")
    private Message  recivePrivateMessage(@Payload Message message){

        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(),"/private",message); // /user/name/private-message

        return  message;
    }

}
