/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package io.github.meetsandesh.module_emailing;

import io.github.meetsandesh.module.utility.ProjectDoraemonUltil;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.mail.Address;
import javax.mail.Message;
import javax.mail.MessagingException;

/**
 *
 * @author sandesh
 */
public class EmailVOHelper {
    
    public static EmailVO convertMessageToEmailVO(Message message){
        EmailVO emailVO=new EmailVO();
        try {
            emailVO.setContent(ProjectDoraemonUltil.getStringFromInputStream(message.getInputStream()));
            emailVO.setSize(message.getSize());
            emailVO.setSubject(message.getSubject());
            emailVO.setReceivedDate(message.getReceivedDate());
            
            Address[] recipients=message.getAllRecipients();
            List<String> recipientList=new ArrayList<>();
            for(Address add:recipients){
                recipientList.add(add.toString());
            }
            emailVO.setRecepients(recipientList);
            
            Address[] sentFrom=message.getFrom();
            List<String> sentFromList=new ArrayList<>();
            for(Address add:sentFrom){
                sentFromList.add(add.toString());
            }
            emailVO.setSentFrom(sentFromList);
            
            Address[] replyTo=message.getReplyTo();
            List<String> replyToList=new ArrayList<>();
            for(Address add:replyTo){
                replyToList.add(add.toString());
            }
            emailVO.setReplyTo(replyToList);
        } catch (Exception ex) {
            return null;
        }
        return emailVO;
    }
    
}
