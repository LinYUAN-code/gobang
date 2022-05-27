package com.awesomeproject;

import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableArray;

import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.Socket;
import java.net.SocketException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

public class ENetHelper extends ReactContextBaseJavaModule {

    private static ReactApplicationContext reactContext;
    private static final String VERSION = "0.0.1";
    private static final String AUTHOR  = "LRJ";

    public ENetHelper(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext = reactContext;
    }

    //    注册常量
    @Override
    public Map<String,Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("version", ENetHelper.VERSION);
        constants.put("author", ENetHelper.AUTHOR);
        return constants;
    }

    @NonNull
    @Override
    public String getName() {
        return "ENetHelper";
    }

    @ReactMethod
    public void getNativeIp(Promise promise) {
        InetAddress inetAddress;
        String ans = "";
        try {
            for (Enumeration<NetworkInterface> networkInterface = NetworkInterface.getNetworkInterfaces();networkInterface.hasMoreElements();
            ) {
                NetworkInterface singleInterface = networkInterface.nextElement();
                for (Enumeration<InetAddress> ipAddress = singleInterface.getInetAddresses();ipAddress.hasMoreElements();) {
                    inetAddress = ipAddress.nextElement();
                    if (singleInterface.getDisplayName().contains("ap0") && inetAddress.getAddress().length <= 15) {
                        ans = inetAddress.getHostAddress();
                    }
                }
            }
        } catch (SocketException err) {
            Log.e("error",err.toString());
        }
        promise.resolve(ans);
    }
}
