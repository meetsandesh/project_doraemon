/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package io.github.meetsandesh.module.interfaces;

import io.github.meetsandesh.module_data_model.Command;

/**
 *
 * @author sandesh
 */
public interface AcceptCommand {
    
    public Object processCommand(Command command);
    
}
