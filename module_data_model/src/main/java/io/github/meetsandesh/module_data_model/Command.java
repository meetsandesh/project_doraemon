/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package io.github.meetsandesh.module_data_model;

import java.io.Serializable;

/**
 *
 * @author sandesh
 */
public class Command implements Serializable{

    private static final long serialVersionUID = 1L;
    
    private String commandText;

    public Command(String commandText) {
        this.commandText = commandText;
    }

    public Command() {
    }
    
    @Override
    public String toString() {
        return "Command{" + "commandText=" + commandText + '}';
    }

    public String getCommandText() {
        return commandText;
    }

    public void setCommandText(String commandText) {
        this.commandText = commandText;
    }
    
}
