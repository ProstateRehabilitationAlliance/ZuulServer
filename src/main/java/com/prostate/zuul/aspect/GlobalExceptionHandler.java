/**
 * 全局异常捕获
 */
package com.prostate.zuul.aspect;


import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static Map<String,String> resultMap = new HashMap<>();
    /**
     * 所有异常报错
     *
     * @param request
     * @param exception
     * @return
     * @throws Exception
     */
    @ExceptionHandler(value = Exception.class)
    public Map<String,String> allExceptionHandler(HttpServletRequest request, Exception exception) throws Exception {


//        exception.printStackTrace();
        log.error("我报错了：{}",exception.getLocalizedMessage());
        log.error("我报错了：{}",exception.getCause());
        log.error("我报错了：{}",exception.getSuppressed());
        log.error("我报错了：{}",exception.getMessage());
        log.error("我报错了：{}",exception.getStackTrace());

        resultMap.put("errorcode","50000");
        resultMap.put("errormsg",exception.getLocalizedMessage());

        return resultMap;
    }

//    @ExceptionHandler(value = ClientException.class)
//    public Map<String,String> clientExceptionHandler(HttpServletRequest request, ClientException exception) throws Exception {
//
////        exception.printStackTrace();
//
//        log.error("我报错了：{}",exception.getLocalizedMessage());
//        log.error("我报错了：{}",exception.getCause());
//        log.error("我报错了：{}",exception.getSuppressed());
//        log.error("我报错了：{}",exception.getMessage());
//        log.error("我报错了：{}",exception.getStackTrace());
//
//        resultMap.put("errorcode","50001");
//        resultMap.put("errormsg",exception.getLocalizedMessage());
//
//        return resultMap;
//    }
//
//
//    @ExceptionHandler(value = ZuulException.class)
//    public Map<String,String> zuulExceptionHandler(HttpServletRequest request, ZuulException exception) throws Exception {
//
////        exception.printStackTrace();
//        log.error("我报错了：{}",exception.getLocalizedMessage());
//        log.error("我报错了：{}",exception.getCause());
//        log.error("我报错了：{}",exception.getSuppressed());
//        log.error("我报错了：{}",exception.getMessage());
//        log.error("我报错了：{}",exception.getStackTrace());
//
//        resultMap.put("errorcode","50002");
//        resultMap.put("errormsg",exception.getLocalizedMessage());
//
//        return resultMap;
//    }
}
