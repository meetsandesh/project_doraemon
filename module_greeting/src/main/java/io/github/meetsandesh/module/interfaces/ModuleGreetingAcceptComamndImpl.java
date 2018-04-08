/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package io.github.meetsandesh.module.interfaces;

import io.github.meetsandesh.module.utility.ProjectDoraemonUltil;
import io.github.meetsandesh.module_data_model.Command;
import io.github.meetsandesh.module_data_model.Response;
import io.github.meetsandesh.module_greeting.interfaces.ModuleGreetingResponse;
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
public class ModuleGreetingAcceptComamndImpl implements AcceptCommand {
    
    private final List<String> possibleCommandsGeneral;
    private final List<String> possibleCommandsMorning;
    private final List<String> possibleCommandsNoon;
    private final List<String> possibleCommandsEvening;
    private final List<String> possibleCommandsNight;
    private final List<String> possibleContexts;
    @Autowired
    private ModuleGreetingResponse moduleGreetingResponse;
    
    public ModuleGreetingAcceptComamndImpl(){
        InputStream in = this.getClass().getClassLoader().getResourceAsStream("module_greeting_commands_general.txt");
        String str=ProjectDoraemonUltil.getStringFromInputStream(in);
        String[] arr=str.split("\n");
        possibleCommandsGeneral=Arrays.asList(arr);
        
        InputStream in1 = this.getClass().getClassLoader().getResourceAsStream("module_greeting_commands_morning.txt");
        String str1=ProjectDoraemonUltil.getStringFromInputStream(in1);
        String[] arr1=str1.split("\n");
        possibleCommandsMorning=Arrays.asList(arr1);
        
        InputStream in2 = this.getClass().getClassLoader().getResourceAsStream("module_greeting_commands_noon.txt");
        String str2=ProjectDoraemonUltil.getStringFromInputStream(in2);
        String[] arr2=str2.split("\n");
        possibleCommandsNoon=Arrays.asList(arr2);
        
        InputStream in3 = this.getClass().getClassLoader().getResourceAsStream("module_greeting_commands_evening.txt");
        String str3=ProjectDoraemonUltil.getStringFromInputStream(in3);
        String[] arr3=str3.split("\n");
        possibleCommandsEvening=Arrays.asList(arr3);
        
        InputStream in4 = this.getClass().getClassLoader().getResourceAsStream("module_greeting_commands_night.txt");
        String str4=ProjectDoraemonUltil.getStringFromInputStream(in4);
        String[] arr4=str4.split("\n");
        possibleCommandsNight=Arrays.asList(arr4);
        
        
        InputStream in_1 = this.getClass().getClassLoader().getResourceAsStream("module_greeting_contexts.txt");
        String str_1=ProjectDoraemonUltil.getStringFromInputStream(in_1);
        String[] arr_1=str_1.split("\n");
        possibleContexts=Arrays.asList(arr_1);
    }

    @Override
    public Object processCommand(Command command) {
        for(String s:possibleCommandsGeneral){
            if(s.toLowerCase().equals(command.getCommandText().toLowerCase())){
                return wrapResponseObject(moduleGreetingResponse.obeyCommand("GENERAL"));
            }
        }
        for(String s:possibleCommandsMorning){
            if(s.toLowerCase().equals(command.getCommandText().toLowerCase())){
                return wrapResponseObject(moduleGreetingResponse.obeyCommand("MORNING"));
            }
        }
        for(String s:possibleCommandsNoon){
            if(s.toLowerCase().equals(command.getCommandText().toLowerCase())){
                return wrapResponseObject(moduleGreetingResponse.obeyCommand("NOON"));
            }
        }
        for(String s:possibleCommandsEvening){
            if(s.toLowerCase().equals(command.getCommandText().toLowerCase())){
                return wrapResponseObject(moduleGreetingResponse.obeyCommand("EVENING"));
            }
        }
        for(String s:possibleCommandsNight){
            if(s.toLowerCase().equals(command.getCommandText().toLowerCase())){
                return wrapResponseObject(moduleGreetingResponse.obeyCommand("NIGHT"));
            }
        }
        return null;
    }
    
    private Response wrapResponseObject(Object object){
        return new Response(possibleContexts, object);
    }
    
}
