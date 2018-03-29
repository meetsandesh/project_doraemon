/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package io.github.meetsandesh.module_test.interfaces;

import io.github.meetsandesh.module.utility.ProjectDoraemonUltil;
import io.github.meetsandesh.module_test.GreetingResponse;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.Random;
import org.springframework.stereotype.Component;

/**
 *
 * @author sandesh
 */
@Component
public class ModuleTestResponseImpl implements ModuleTestResponse {
    
    private final List<String> possibleResponse;
    
    public ModuleTestResponseImpl(){
        InputStream in = this.getClass().getClassLoader().getResourceAsStream("module_test_responses.txt");
        String str=ProjectDoraemonUltil.getStringFromInputStream(in);
        String[] arr=str.split("\n");
        possibleResponse=Arrays.asList(arr);
    }

    @Override
    public Object obeyCommand() {
        return new GreetingResponse(possibleResponse.get(getRandomIndex()));
    }
    
    private int getRandomIndex(){
        Random r = new Random();
        int Low = 0;
        int High = possibleResponse.size();
        return r.nextInt(High-Low) + Low;
    }
    
}
