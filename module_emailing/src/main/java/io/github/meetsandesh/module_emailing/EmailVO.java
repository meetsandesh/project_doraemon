/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package io.github.meetsandesh.module_emailing;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 *
 * @author sandesh
 */
public class EmailVO implements Serializable{

    private static final long serialVersionUID = 1L;
    private List<String> sentFrom;
    private List<String> recepients;
    private List<String> replyTo;
    private String subject;
    private String content;
    private int size;
    private Date receivedDate;

    public EmailVO() {
    }

    public List<String> getSentFrom() {
        return sentFrom;
    }

    public void setSentFrom(List<String> sentFrom) {
        this.sentFrom = sentFrom;
    }

    public List<String> getRecepients() {
        return recepients;
    }

    public void setRecepients(List<String> recepients) {
        this.recepients = recepients;
    }

    public List<String> getReplyTo() {
        return replyTo;
    }

    public void setReplyTo(List<String> replyTo) {
        this.replyTo = replyTo;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public Date getReceivedDate() {
        return receivedDate;
    }

    public void setReceivedDate(Date receivedDate) {
        this.receivedDate = receivedDate;
    }

    @Override
    public String toString() {
        return "EmailVO{" + "sentFrom=" + sentFrom + ", recepients=" + recepients + ", replyTo=" + replyTo + ", subject=" + subject + ", content=" + content + ", size=" + size + ", receivedDate=" + receivedDate + '}';
    }

}
