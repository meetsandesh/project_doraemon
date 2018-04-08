/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package io.github.meetsandesh.module_greeting.interfaces;

import io.github.meetsandesh.module.utility.ProjectDoraemonUltil;
import io.github.meetsandesh.module_greeting.GreetingResponse;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Random;
import org.springframework.stereotype.Component;

/**
 *
 * @author sandesh
 */
@Component
public class ModuleGreetingResponseImpl implements ModuleGreetingResponse {
    
    private final List<String> possibleResponseGeneral;
    private final List<String> possibleResponseMorning;
    private final List<String> possibleResponseNoon;
    private final List<String> possibleResponseEvening;
    private final List<String> possibleResponseNight;
    
    public ModuleGreetingResponseImpl(){
        InputStream in = this.getClass().getClassLoader().getResourceAsStream("module_greeting_responses_general.txt");
        String str=ProjectDoraemonUltil.getStringFromInputStream(in);
        String[] arr=str.split("\n");
        possibleResponseGeneral=Arrays.asList(arr);
        
        InputStream in1 = this.getClass().getClassLoader().getResourceAsStream("module_greeting_responses_morning.txt");
        String str1=ProjectDoraemonUltil.getStringFromInputStream(in1);
        String[] arr1=str1.split("\n");
        possibleResponseMorning=Arrays.asList(arr1);
        
        InputStream in2 = this.getClass().getClassLoader().getResourceAsStream("module_greeting_responses_noon.txt");
        String str2=ProjectDoraemonUltil.getStringFromInputStream(in2);
        String[] arr2=str2.split("\n");
        possibleResponseNoon=Arrays.asList(arr2);
        
        InputStream in3 = this.getClass().getClassLoader().getResourceAsStream("module_greeting_responses_evening.txt");
        String str3=ProjectDoraemonUltil.getStringFromInputStream(in3);
        String[] arr3=str3.split("\n");
        possibleResponseEvening=Arrays.asList(arr3);
        
        InputStream in4 = this.getClass().getClassLoader().getResourceAsStream("module_greeting_responses_night.txt");
        String str4=ProjectDoraemonUltil.getStringFromInputStream(in4);
        String[] arr4=str4.split("\n");
        possibleResponseNight=Arrays.asList(arr4);
    }

    @Override
    public Object obeyCommand(String typeOfGreeting) {
        try {
            String timeStamp = new SimpleDateFormat("HH:mm:ss").format(Calendar.getInstance().getTime());
            switch (typeOfGreeting.toUpperCase()) {
                case "GENERAL":
                    return new GreetingResponse(possibleResponseGeneral.get(getRandomIndex(possibleResponseGeneral.size())));
                case "MORNING":
                    if(isTimeBetweenTwoTime("00:00:00","12:00:00",timeStamp)){
                        return new GreetingResponse(possibleResponseMorning.get(getRandomIndex(possibleResponseMorning.size())));
                    }
                    else{
                        return new GreetingResponse("it is not morning actually however greetings of the day");
                    }
                case "NOON":
                    if(isTimeBetweenTwoTime("12:00:00","17:00:00",timeStamp)){
                        return new GreetingResponse(possibleResponseNoon.get(getRandomIndex(possibleResponseNoon.size())));
                    }
                    else{
                        return new GreetingResponse("it is not afternoon actually however greetings of the day");
                    }
                case "EVENING":
                    if(isTimeBetweenTwoTime("12:00:00","17:00:00",timeStamp)){
                        return new GreetingResponse(possibleResponseEvening.get(getRandomIndex(possibleResponseEvening.size())));
                    }
                    else{
                        return new GreetingResponse("it is not evening actually however greetings of the day");
                    }
                case "NIGHT":
                    if(isTimeBetweenTwoTime("17:00:00","00:00:00",timeStamp) || isTimeBetweenTwoTime("00:00:00","04:00:00",timeStamp)){
                        return new GreetingResponse(possibleResponseNight.get(getRandomIndex(possibleResponseNight.size())));
                    }
                    else{
                        return new GreetingResponse("it is not a night actually however greetings of the day");
                    }
                default:
                    break;
            }
        }
        catch (Exception ex) {
            return new GreetingResponse("greetings");
        }
        return new GreetingResponse("greetings");
    }
    
    private int getRandomIndex(int size){
        Random r = new Random();
        int Low = 0;
        int High = size;
        return r.nextInt(High-Low) + Low;
    }
    
    private boolean isTimeBetweenTwoTime(String initialTime, String finalTime, String currentTime) throws Exception {
        String reg = "^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$";
        boolean valid = false;
        if (initialTime.matches(reg) && finalTime.matches(reg) && currentTime.matches(reg)) 
        {
            //Start Time
            Date inTime = new SimpleDateFormat("HH:mm:ss").parse(initialTime);
            Calendar calendar1 = Calendar.getInstance();
            calendar1.setTime(inTime);

            //Current Time
            Date checkTime = new SimpleDateFormat("HH:mm:ss").parse(currentTime);
            Calendar calendar3 = Calendar.getInstance();
            calendar3.setTime(checkTime);

            //End Time
            Date finTime = new SimpleDateFormat("HH:mm:ss").parse(finalTime);
            Calendar calendar2 = Calendar.getInstance();
            calendar2.setTime(finTime);

            if (finalTime.compareTo(initialTime) < 0) 
            {
                calendar2.add(Calendar.DATE, 1);
                calendar3.add(Calendar.DATE, 1);
            }

            Date actualTime = calendar3.getTime();
            if ((actualTime.after(calendar1.getTime()) || actualTime.compareTo(calendar1.getTime()) == 0) && actualTime.before(calendar2.getTime())) 
            {
                valid = true;
            }
        }
        else 
        {
            throw new Exception("Not a valid time, expecting HH:MM:SS format");
        }
        return valid;
    }
    
}
