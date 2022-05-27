package com.awesomeproject;

import android.widget.Toast;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

public class HelloWorld extends ReactContextBaseJavaModule {

    private static final String VERSION = "0.0.1";
    private static final String AUTHOR  = "LRJ";
    private static ReactApplicationContext reactContext;

    public HelloWorld(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "HelloWorld";
    }

//    注册常量
    @Override
    public Map<String,Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("version", HelloWorld.VERSION);
        constants.put("author", HelloWorld.AUTHOR);
        return constants;
    }


//    注册方法--不可以有返回值
//    类型映射--参考官网
//    Boolean -> Bool
//    Integer -> Number
//    Double -> Number
//    Float -> Number
//    String -> String
//    Callback -> function
//    ReadableMap -> Object
//    ReadableArray -> Array
    @ReactMethod
    public void show(String message, int duration) {
        Toast.makeText(getReactApplicationContext(), message, duration).show();
    }

}
