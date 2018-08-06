package com.prostate.zuul.filter;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.prostate.zuul.cache.redis.RedisSerive;
import com.prostate.zuul.util.JsonUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.netflix.zuul.filters.support.FilterConstants;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Created by MaxCoder
 */
@Slf4j
@Component
public class AccessFilter extends ZuulFilter {

    //无需token 的请求
    private static String[] enableUrl = {"/api-doctor/doctor/login", "/api-doctor/doctor/register", "/api-doctor/weChat/login","/api-file/file/upload", "/api-doctor/weChat/oauth","/api-third/file/upload","/api-third/sms/sendLoginCode","/api-third/sms/sendPasswordReplaceCode","/api-third/sms/sendRegisterCode"};

    @Autowired
    private RedisSerive redisSerive;

    @Override
    public String filterType() {
        return FilterConstants.PRE_TYPE;
    }

    @Override
    public int filterOrder() {
        return 0;
    }

    @Override
    public boolean shouldFilter() {
        return true;
    }


    private static final ThreadLocal<String> userHolder = new ThreadLocal<String>();

    private static final ThreadLocal<HttpServletRequest> requestHolder = new ThreadLocal<HttpServletRequest>();

    @Override
    public Object run() {
        RequestContext ctx = RequestContext.getCurrentContext();
        HttpServletRequest request = ctx.getRequest();
        Object token = request.getParameter("token");
        ThreadLocal<Object> t = new ThreadLocal<>();

        String servletPath = request.getServletPath();
        log.info("TOKEN=" + token);
        log.info("request=" + request.getSession().getId());
        log.info("ServletPath=" + servletPath);

        if (Arrays.asList(enableUrl).contains(servletPath) || servletPath.indexOf("api-stata") != -1) {
            return null;
        }
        //校验token
        if (token != null) {
            String user = redisSerive.get(token.toString());
            if (user != null) {
                return null;
            }
        }
        //TODO 根据token获取相应的登录信息，进行校验（略）
        ctx.setSendZuulResponse(false);
        ctx.setResponseStatusCode(200);
        Map<String, Object> resultMap = new LinkedHashMap<>();
        resultMap.put("code", "40001");
        resultMap.put("msg", "LOGIN TIMEOUT !");
        ctx.setResponseBody(JsonUtils.jsonToStr(resultMap));
        //添加Basic Auth认证信息

        return null;

    }

}