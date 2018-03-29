/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package io.github.meetsandesh.interfaces;

import io.github.meetsandesh.module.interfaces.AcceptCommand;
import io.github.meetsandesh.module_data_model.Command;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author sandesh
 */
@Service
public class ReceiveCommandImpl implements ReceiveCommand{

    @Autowired
    private List<AcceptCommand> moduleList;
    
    @Override
    public Object returnCommandResults(Command command) {
        List<Object> responseObject=new ArrayList<>();
        moduleList.stream().map((ac) -> ac.processCommand(command)).filter((obj) -> (obj!=null)).forEachOrdered((obj) -> {
            responseObject.add(obj);
        });
        return responseObject;
    }
    
}
