package com.prostate.zuul.filter;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.prostate.zuul.cache.redis.RedisSerive;
import com.prostate.zuul.util.JsonUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
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
    private static String[] enableUrl = {"/api-doctor/doctor/login", "/api-doctor/doctor/register", "/api-doctor/weChat/login","/api-user/weChat/login","/api-file/file/upload","/api-third/cos/upload", "/api-doctor/weChat/oauth","/api-third/file/upload","/api-user/doctor/loginSms","/api-user/doctor/passwordSms","/api-user/doctor/registerSms","/api-user/doctor/register","/api-user/doctor/login","/api-user/doctor/smsLogin","/api-user/doctor/passwordReset"};

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

    @Override
    public Object run() {
        RequestContext ctx = RequestContext.getCurrentContext();
        HttpServletRequest request = ctx.getRequest();
        StringBuilder token = new StringBuilder();

        token.append(StringUtils.isBlank(request.getParameter("token"))?"":request.getParameter("token"));

        token.append(StringUtils.isBlank(request.getHeader("token"))?"":request.getHeader("token"));

        String servletPath = request.getServletPath();
        log.info("TOKEN=" + token+"----"+"ServletPath=" + servletPath);

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