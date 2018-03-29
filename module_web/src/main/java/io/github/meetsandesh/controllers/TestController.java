package io.github.meetsandesh.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class TestController extends BaseController{

	@RequestMapping("/testPage")
	public String welcome() {
		return "test";
	}
        
	@RequestMapping("/speech_to_text_1")
	public String speech_to_text_1() {
		return "speech_to_text_1";
	}
        
	@RequestMapping("/speech_to_text_2")
	public String speech_to_text_2() {
		return "speech_to_text_2";
	}

}