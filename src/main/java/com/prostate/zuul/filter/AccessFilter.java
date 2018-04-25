package com.prostate.zuul.filter;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.prostate.zuul.cache.redis.RedisSerive;
import com.sun.scenario.effect.impl.sw.sse.SSEBlend_SRC_OUTPeer;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.connector.Response;
import org.apache.commons.codec.binary.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.netflix.zuul.filters.support.FilterConstants;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

/**
 * Created by MaxCoder
 */
@Slf4j
@Component
public class AccessFilter extends ZuulFilter {

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
        Object token = request.getParameter("token");

        System.out.println("token============================="+token);

        String servletPath = ctx.getRequest().getServletPath();
        if("/api-doctor/doctor/login".equals(servletPath)||("/api-doctor/doctor/register").equals(servletPath)||servletPath.indexOf("api-stata")!=-1){
            return null;
        }
        //校验token
        if(token!=null){
           String user =  redisSerive.get(token.toString());
           if(user!=null){
               return null;
           }
        }
        //TODO 根据token获取相应的登录信息，进行校验（略）
        ctx.setSendZuulResponse(false);
        ctx.setResponseStatusCode(40001);
        //添加Basic Auth认证信息

        return null;

    }

}