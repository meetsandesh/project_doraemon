/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package io.github.meetsandesh.controllers.rest;

import io.github.meetsandesh.interfaces.ReceiveCommand;
import io.github.meetsandesh.module_data_model.Command;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author sandesh
 */
@RestController
public class CommandResonseController {
    
    @Autowired
    private ReceiveCommand receiveCommand;
    
    @RequestMapping(name="/command/results",method = {RequestMethod.POST})
    public Object commandResults(@RequestBody Command command) {
        Object obj=receiveCommand.returnCommandResults(command);
        return obj;
    }
    
}
