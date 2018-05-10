package com.prostate.zuul.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;

@Slf4j
@Order(10)
@Aspect
@Component
public class WebLogAspect {


    @Pointcut("execution(public * com.prostate.zuul.filter.*..*.*(..))")
    public void webLog(){

    }

    @Before("webLog()")
    public void doBefore(JoinPoint joinPoint) throws Throwable {
        // 接收到请求，记录请求内容
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();
        // 记录下请求内容
        log.info("URL : " + request.getRequestURL().toString());
        log.info("HTTP_METHOD : " + request.getMethod());
        log.info("IP : " + request.getRemoteAddr());
        log.info("CLASS_METHOD : " + joinPoint.getSignature().getDeclaringTypeName() + "." + joinPoint.getSignature().getName());
        log.info("ARGS : " + Arrays.toString(joinPoint.getArgs()));


    }
    @AfterReturning(returning = "ret", pointcut = "webLog()")
    public void doAfterReturning(Object ret) throws Throwable {
        // 处理完请求，返回内容
        log.info("RESPONSE : " + ret);
    }
    @After("webLog()")
    public void doAfter() throws Throwable {
        // 处理完请求，返回内容
//        log.info("After : " );
    }

//    @Around("webLog()")
    public void doAround() throws Throwable {
        // 处理完请求，返回内容
//        log.info("Around : " );
    }

//    @AfterThrowing("webLog()")
    public void doAfterThrowing() throws Throwable {
        // 处理完请求，返回内容
        log.info("AfterThrowing : " );
    }
//    前置通知、后置最终通知、后置返回通知、后置异常通知、环绕通知
//    使用@Aspect注解将一个java类定义为切面类
//    使用@Pointcut定义一个切入点，可以是一个规则表达式，比如下例中某个package下的所有函数，也可以是一个注解等。根据需要在切入点不同位置的切入内容
//    使用@Before在切入点开始处切入内容
//    使用@After在切入点结尾处切入内容
//    使用@AfterReturning在切入点return内容之后切入内容（可以用来对处理返回值做一些加工处理）
//    使用@Around在切入点前后切入内容，并自己控制何时执行切入点自身的内容
//    使用@AfterThrowing用来处理当切入内容部分抛出异常之后的处理逻辑
}
