/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package io.github.meetsandesh.module.interfaces;

import io.github.meetsandesh.module.utility.ProjectDoraemonUltil;
import io.github.meetsandesh.module_data_model.Command;
import io.github.meetsandesh.module_data_model.Response;
import io.github.meetsandesh.module_test.interfaces.ModuleTestResponse;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
/**
 *
 * @author sandesh
 */
@Component
public class ModuleTestAcceptComamndImpl implements AcceptCommand {
    
    private final List<String> possibleCommands;
    private final List<String> possibleContexts;
    @Autowired
    private ModuleTestResponse moduleGreetingResponse;
    
    public ModuleTestAcceptComamndImpl(){
        InputStream in = this.getClass().getClassLoader().getResourceAsStream("module_test_commands.txt");
        String str=ProjectDoraemonUltil.getStringFromInputStream(in);
        String[] arr=str.split("\n");
        possibleCommands=Arrays.asList(arr);
        InputStream in1 = this.getClass().getClassLoader().getResourceAsStream("module_test_contexts.txt");
        String str1=ProjectDoraemonUltil.getStringFromInputStream(in1);
        String[] arr1=str1.split("\n");
        possibleContexts=Arrays.asList(arr1);
    }

    @Override
    public Object processCommand(Command command) {
        for(String s:possibleCommands){
            if(s.toLowerCase().equals(command.getCommandText().toLowerCase())){
                return wrapResponseObject(moduleGreetingResponse.obeyCommand());
            }
        }
        return null;
    }
    
    private Response wrapResponseObject(Object object){
        return new Response(possibleContexts, object);
    }
    
}
