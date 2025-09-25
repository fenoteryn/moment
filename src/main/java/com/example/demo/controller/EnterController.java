package com.example.demo.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
public class EnterController {

    @GetMapping("/enter")
    public String getMethodName(@RequestParam String param) {
        return enter(param); // 여기서 enter 호출
    }

    public String enter(String text) {
        return "입력값: " + text;
    }
}
