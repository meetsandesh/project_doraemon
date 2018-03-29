/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package io.github.meetsandesh.module_emailing;

import java.io.Serializable;
import java.util.List;
import javax.mail.Message;

/**
 *
 * @author sandesh
 */
public class EmailingResponse implements Serializable{

    private static final long serialVersionUID = 1L;
    private String eMailId;
    private Object response;

    public EmailingResponse() {
    }

    public EmailingResponse(String eMailId, List<Message> response) {
        this.eMailId = eMailId;
        this.response = response;
    }

    public String geteMailId() {
        return eMailId;
    }

    public void seteMailId(String eMailId) {
        this.eMailId = eMailId;
    }

    public Object getResponse() {
        return response;
    }

    public void setResponse(Object response) {
        this.response = response;
    }

    @Override
    public String toString() {
        return "EmailingResponse{" + "eMailId=" + eMailId + ", response=" + response + '}';
    }

}
