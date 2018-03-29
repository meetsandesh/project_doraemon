/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package io.github.meetsandesh.module_emailing.interfaces;

import io.github.meetsandesh.module_emailing.EmailVO;
import io.github.meetsandesh.module_emailing.EmailVOHelper;
import io.github.meetsandesh.module_emailing.EmailingResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import javax.mail.Flags;
import javax.mail.Folder;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Store;
import org.springframework.stereotype.Component;

/**
 *
 * @author sandesh
 */
@Component
public class ModuleEmailingResponseImpl implements ModuleEmailingResponse {
    
    public ModuleEmailingResponseImpl(){
        
    }

    @Override
    public Object obeyCommand() {
        return checkEmails();
    }
    
    private Object checkEmails() {
        EmailingResponse emailingResponse=new EmailingResponse();
        List<EmailVO> list=new ArrayList<>();
        Properties props = new Properties();
        Properties credentials = new Properties();
        try {
            props.load(this.getClass().getClassLoader().getResourceAsStream("servers/gmail/email.properties"));
            credentials.load(this.getClass().getClassLoader().getResourceAsStream("servers/gmail/credentials.properties"));
            emailingResponse.seteMailId(credentials.getProperty("username"));
            Session session = Session.getDefaultInstance(props, null);
            Store store = session.getStore("imaps");
            store.connect(props.getProperty("mail.smtp.host"), credentials.getProperty("username"), credentials.getProperty("password"));
            Folder inbox = store.getFolder("inbox");
            inbox.open(Folder.READ_WRITE);
            if(inbox.getMessageCount()>0){
                Message[] messages = inbox.getMessages();
                for (Message message : messages) {
                    if (!message.getFlags().contains(Flags.Flag.SEEN)) {
                        EmailVO emailVO=EmailVOHelper.convertMessageToEmailVO(message);
                        if(emailVO!=null) {
                            list.add(emailVO);
                        }
                        message.setFlag(Flags.Flag.SEEN, true);
                    }
                }
                if(!list.isEmpty()){
                    emailingResponse.setResponse(list);
                }
            }
            if(list.isEmpty()){
                emailingResponse.setResponse("No new emails.");
            }
            inbox.close(true);
            store.close();
        } 
        catch (IOException | MessagingException e) {
            e.printStackTrace();
            emailingResponse.setResponse("Error while connecting to eMail server.");
        }
        return emailingResponse;
    }
}
