/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package io.github.meetsandesh.module_test;

import java.io.Serializable;

/**
 *
 * @author sandesh
 */
public class GreetingResponse implements Serializable{

    private static final long serialVersionUID = 1L;
    
    private String response;

    public GreetingResponse(String response) {
        this.response = response;
    }

    public GreetingResponse() {
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }
    
    @Override
    public String toString() {
        return "GreetingResponse{" + "response=" + response + '}';
    }
    
}
