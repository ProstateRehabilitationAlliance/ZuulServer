package com.prostate.zuul.util;

import com.alibaba.fastjson.JSONObject;
import org.springframework.stereotype.Component;

@Component
public class JsonUtils<E> {



    /**
     * 把java对象转换成json对象，并转化为字符串
     */
    public static String jsonToStr(Object obj) {
        if (obj == null) {
            return "";
        }
        return JSONObject.toJSONString(obj);

    }

    public static Object jsonToObj(String jsonStr) {
        if ("".equals(jsonStr)) {
            return null;
        }
        return JSONObject.parseObject(jsonStr);
    }

}
