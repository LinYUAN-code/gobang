package com.awesomeproject;

import android.telecom.Call;
import android.telecom.Connection;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.devsupport.LogBoxDialog;
import com.facebook.react.devsupport.LogBoxModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.BufferedWriter;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.NetworkInterface;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

/*
    主要的功能:
        1.查看本机IP的作用(以获取子网)
        2.获取空闲用户列表-->监听特定端口,同时回复当前用户状态

    通信功能使用WebSocket实现


    Callback 不能被多次调用 --- 坑 2022.5.29
    需要多次调用用event机制
 */
public class ENetHelper extends ReactContextBaseJavaModule implements LifecycleEventListener {

    private static ReactApplicationContext reactContext;
    private static final String VERSION = "0.0.1";
    private static final String AUTHOR  = "LRJ";
    private static final int PORT = 4569;
    private static final String INVITE = "invite";
    private static final String DETECT = "detect";
    public boolean isInit = false;

    public String ipAddr = "";
    public String userName = "";
    public String State = "idle";
    public String[] states;
//    保存棋局正在进行的socket
    public Socket sk;
    public boolean isFirst = false;


    public ENetHelper(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        states = new String[256];
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


    public void handleSocket(Socket socket) throws IOException {
        byte[] buf = new byte[100];
//        socket的is 只会从socket 缓存区中取读取数据--不会阻塞
//        会有个问题--如果我read比数据到达的时间更早 那怎么办.
        InputStream inputStream = socket.getInputStream();
        int n = inputStream.read(buf);
        if(INVITE.equals(new String(buf).substring(0,n))) {
            log("invite");
            OutputStream outputStream = socket.getOutputStream();
            outputStream.write(INVITE.getBytes(StandardCharsets.UTF_8));
//            开始游戏咯
//            被邀请者是黑子
            isFirst = true;
            State = "busy";
            sk = socket;
            logInvite();
        } else {
            OutputStream outputStream = socket.getOutputStream();
            outputStream.write((ipAddr+"#"+userName+"#"+State).getBytes(StandardCharsets.UTF_8));
            socket.close();
        }
    }

    @ReactMethod
    public void  init() {
        if(isInit) {
            return ;
        }
        log("ENetHelper init");
        initENet();
        isInit = true;
    }



//    监听特点端口并回复其他用户
//    注意避免多次调用
    public void initENet() {
//        启动一个线程进行监听
        new Thread(new Runnable() {
            @Override
            public void run() {
                ServerSocket serverSocket = null;
                try {
                    serverSocket = new ServerSocket(PORT);
                    while (true) {
                        Socket s = serverSocket.accept();
                        if(s==null)continue;
                        new Thread(new Runnable(){
                            @Override
                            public void run() {
                                try {
                                    handleSocket(s);
                                } catch (IOException err) {
                                    log("handleSocket: "+err.toString());
                                }
                            }
                        }).start();
                    }
                }catch (IOException err) {
                } finally {
                    if (serverSocket != null) {
                        try {
                            serverSocket.close();
                        } catch (IOException err){
                        }
                    }
                }

            }
        }).start();

        new Thread(new Runnable() {
            @Override
            public void run() {
                String[] arr = ipAddr.split("\\.");
                String prefix = "";
                for(int i=0;i<=2;i++) {
                    prefix += arr[i] + ".";
                }

//              开启16个线程，用于检测
                for(int i=1;i<=16;i++) {
                    String finalPrefix = prefix;
                    int start = (i-1)*16 + 1;
                    new Thread(new Runnable() {
                            @Override
                            public void run() {
                                detectRange(finalPrefix, start, Math.min(start +15,254));
                            }

                    }).start();
                }
            }
        }).start();
    }

    @ReactMethod
    public void getNativeIp(String userName,Promise promise) {
        if(ipAddr.length()!=0) {
            this.userName = userName;
            promise.resolve(ipAddr);
            return ;
        }
        this.userName = userName;
        InetAddress inetAddress;
        try {
            for (Enumeration<NetworkInterface> networkInterface = NetworkInterface.getNetworkInterfaces();networkInterface.hasMoreElements();
            ) {
                NetworkInterface singleInterface = networkInterface.nextElement();
//                一般来说ap0就是热点开启的人 wlan0是连接热点的wifi接口
//                可以通过adb shell ifconfig 进行查看
                if (singleInterface.getDisplayName().contains("ap0") || singleInterface.getDisplayName().contains("wlan0")) {
                    for (Enumeration<InetAddress> ipAddress = singleInterface.getInetAddresses();ipAddress.hasMoreElements();) {
                        inetAddress = ipAddress.nextElement();
                        if (inetAddress.getAddress().length <= 15) {
                            ipAddr = inetAddress.getHostAddress();
                        }
                    }
                }
            }
        } catch (SocketException err) {
            Log.e("error",err.toString());
        }
        promise.resolve(ipAddr);
    }


//    获取用户的 ip地址,以及用户姓名
    @ReactMethod
    public void getIdleUser(Callback callback) {
        WritableArray res = new WritableNativeArray();
        for(int i=0;i<=254;i++) {
            res.pushString(states[i]);
        }
//        注意这里写的是正则
        callback.invoke(res);
    }

//    循环检测
    public void detectRange(String prefix,int start,int end) {
        for(int i=start;i<=end;i++) {
            if(ipAddr.equals(prefix+i)) {
                states[i] = "-1";
                continue;
            }
            states[i] = detectIp(prefix+i);
            if(i==end)i = start;
        }
    }


    public String detectIp(String ip) {
//        log(ip);
        try {
            Socket client = new Socket();
//            超时时间设置为10ms
//            java NoRouteToHostException 好像不受这个影响？
            client.connect(new InetSocketAddress(ip,PORT),300);
            OutputStream outputStream = client.getOutputStream();
            outputStream.write(DETECT.getBytes(StandardCharsets.UTF_8));
            InputStream inFromServer = client.getInputStream();
            byte[] buf = new byte[100];
            inFromServer.read(buf);
            client.close();
            return new String(buf);
        } catch (IOException err) {
            return "-1";
        }
    }


    @ReactMethod
    public void invite(String ip,Promise promise) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
//                    State加锁
                    State = "busy";
                    Socket client = new Socket();
                    client.connect(new InetSocketAddress(ip,PORT),1000);
                    OutputStream outputStream = client.getOutputStream();
                    outputStream.write(INVITE.getBytes(StandardCharsets.UTF_8));
                    byte[] buf = new byte[100];
                    InputStream inputStream = client.getInputStream();
                    int n = inputStream.read(buf);
                    if(INVITE.equals(new String(buf).substring(0,n))) {
                        sk = client;
                        isFirst = false;
                        promise.resolve("ok");
                    } else {
                        State = "idle";
                        promise.resolve("");
                    }
                } catch (IOException err) {
                    State = "idle";
                    promise.resolve(err.toString());
                }
            }
        }).start();
    }

    @ReactMethod
    public void getIsFirst(Promise promise) {
        promise.resolve(isFirst);
    }

    @ReactMethod
    public void sendXY(int x,int y,Callback callback) {
        if(sk==null)return ;
        try {
            OutputStream outputStream = sk.getOutputStream();
            outputStream.write((x+","+y).getBytes(StandardCharsets.UTF_8));
            callback.invoke("ok");
        } catch (IOException err) {
            State = "idle";
            log("sendXYerr: "+err.toString());
            try {
                sk.close();
            } catch (IOException e) {
                log(e.toString());
            }
//            连接被关闭
            callback.invoke("close");
            sk = null;
        }
    }

    @ReactMethod
    public void readXY(Callback callback) {
        if(sk==null)return ;
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    InputStream inputStream = sk.getInputStream();
                    byte[] buf = new byte[100];
                    int n = inputStream.read(buf);
                    if (n!=0) {
                        callback.invoke(new String(buf));
                        return ;
                    }
                } catch (IOException err) {
                    State = "idel";
                    log("readXYerr: "+err.toString());
                    try {
                        sk.close();
                    } catch (IOException e) {
                        log(e.toString());
                    }
//                    对方以及关闭连接
                    callback.invoke("close");
                    sk = null;
                }
            }
        }).start();
    }

//  主动退出房间
//  那么我们需要监听返回键
    @ReactMethod
    public void exitGame() {
        if(sk==null)return ;
        State = "idle";
        try {
            sk.close();
            sk = null;
        } catch (IOException err) {

        }

    }

    public static void log(String content) {
        if(reactContext != null) {
            WritableMap params = Arguments.createMap();
            params.putString("info", content);
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("log",params);
        }
    }

    public static void logInvite() {
        if(reactContext != null) {
            WritableMap params = Arguments.createMap();
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("invite",params);
        }
    }

    @ReactMethod
    public void addListener(String eventName) {
        // Set up any upstream listeners or background tasks as necessary
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        // Remove upstream listeners, stop unnecessary background tasks
    }

    @Override
    public void onHostResume() {
        log("resume");
    }

    @Override
    public void onHostPause() {
        // Activity `onPause`
        log("pause");
    }

    @Override
    public void onHostDestroy() {
        log("destory");
    }
}
