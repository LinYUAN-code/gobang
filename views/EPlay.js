
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    ToastAndroid,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native'
import { getUser } from '../utils/user';
import ENetHelper from '../natives/eNetHelper';

export default function EPlay({ navigation }) {

    const user = React.useRef({});
    getUser(navigation,user);
    const [ip,setIp] = React.useState("");
    React.useEffect(()=>{
        console.log(user.current);
        if(!user.current.name)return ;
        ENetHelper.addInviteListener((res)=>{
            console.log("已经建立连接");
            setTimeout(()=>{
                navigation.navigate({
                    name: "EGame"
                });
            },1000)
        })
        ENetHelper.getNativeIp(user.current.name).then((res)=>{
            if(!res) {
                ToastAndroid.show("请先打开热点或者连接入主机热点WiFi",ToastAndroid.LONG);
                // 1秒后跳转回主页
                setTimeout(()=>{
                    navigation.popToTop()
                },1000);
            } else {
                ENetHelper.init();
                setIp(res);
            }
        });

    },[user.current.name]);


    const [roomList,setRoomList] = React.useState([]);
    React.useEffect(()=>{
        let timer;
        let isConcel = false;
        // 每一秒查找一次
        timer = setInterval(()=>{
            ENetHelper.getIdleUser((res)=>{
                if(isConcel)return ;
                let arr = [];
                for(let x of res) {
                    if(x!=null && x!=="null" && x!=="-1" && x.length) {
                        x = x.split("#");
                        arr.push({
                            ip: x[0],
                            name: x[1],
                            state: x[2],
                        });
                    }
                }
                setRoomList(arr);
            })
        },1000);
        return ()=>{
            isConcel = true;
            clearInterval(timer);
        }
    },[])

    const invite = (v) => {
        if(v.state !== "idle") { //当前用户不可邀请
            return ;
        }
        ENetHelper.invite(v.ip).then(res=>{
            if(res) {
                navigation.navigate({
                    name: "EGame",
                })
            } else {
                // 拒绝或错误
                Alert.alert("对方拒绝了你的请求或发生了错误")
            }
        })

        // navigation.navigate({
        //     name: "EGame",
        //     params: {
        //         mode: "ePlay",
        //         userName: v.name,
        //         userIp:   v.ip,
        //     }
        // })
    }

    return (
		<ImageBackground
			source={require("../static/3.jpg")}
			style={styles.back}
		>

            <Text>
                本机Ip为: {ip}
            </Text>
            <Text>
                醉后不知天在水，满床星梦压星河。
            </Text>
            <Text
                style={styles.header}
            >
                选择一个房间加入
            </Text>
            <ScrollView
                style={styles.scrollContainer}
            >
            {
                roomList.map((v,index)=>{
                    return (
                    <View
                        key={v.ip}
                        style={styles.roomContainer}
                    >   
                        <Text style={styles.name}>{v.name}</Text>
                        <Text style={styles.ip}>{v.ip} 状态:{v.state}</Text>
                        <TouchableOpacity
                            style={v.state==="idle"?styles.inviteButton:styles.forbidButton}
                            onPress={()=>{invite(v)}}
                            activeOpacity={v.state==="idle"?0.4:1}
                        >
                            <Text>邀请</Text>
                        </TouchableOpacity>
                    </View>)
                })
            }
            </ScrollView>
        </ImageBackground>
    )
}


const styles = StyleSheet.create({
	back: {
		width: "100%",
		height: "100%",
		position: "relative"
	},
    header: {
        color: "#000",
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 50,
        marginLeft: -20,
        fontSize: 25,
		textShadowColor: "rgba(0,0,0,.3)",
		textShadowOffset: {width:2,height:2},
		textShadowRadius: 4,
    },
    scrollContainer: {
    },
    roomContainer: {
        flexDirection: "row",
        flexWrap: "nowrap",
        backgroundColor: "rgba(24, 220, 255,.8)",
        height: 40,
        alignItems: "center",
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20,
        borderRadius: 10,
        position: "relative",
    },
    name: {
        marginLeft: 10,
        color: "#000",
        fontWeight: "700",
        fontSize: 15,
    },
    ip: {
        marginLeft: 40,
        color: "rgba(0,0,0,.5)",
    },
    inviteButton: {
        backgroundColor: "#74b9ff",
        marginLeft: 70,
        height: 25,
        width: 40,
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        right: 5,
    },  
    forbidButton: {
        backgroundColor: "rgba(255, 56, 56,1.0)",
        marginLeft: 70,
        height: 25,
        width: 40,
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        right: 5,
    }
})