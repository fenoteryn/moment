package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class ButtonController {

    @GetMapping("/api/button-label")
    public Map<String, String> getButtonLabel() {
        Map<String, String> response = new HashMap<>();
        response.put("label", "안녕하세요 반갑습니다");
        return response;
    }
}


