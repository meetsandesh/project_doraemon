/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package io.github.meetsandesh.module_data_model;

import java.util.List;

/**
 *
 * @author sandesh
 */
public class Response {
    
    private List<String> context;
    private Object relatedResponseObject;

    public Response() {
    }

    public Response(List<String> context, Object relatedResponseObject) {
        this.context = context;
        this.relatedResponseObject = relatedResponseObject;
    }

    public List<String> getContext() {
        return context;
    }

    public void setContext(List<String> context) {
        this.context = context;
    }

    public Object getRelatedResponseObject() {
        return relatedResponseObject;
    }

    public void setRelatedResponseObject(Object relatedResponseObject) {
        this.relatedResponseObject = relatedResponseObject;
    }

    @Override
    public String toString() {
        return "Response{" + "context=" + context + ", relatedResponseObject=" + relatedResponseObject + '}';
    }

}
