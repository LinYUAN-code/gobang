

import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View ,Alert, Modal, Button, BackHandler } from "react-native";
import Board from '../components/Board';
import NetBoard from '../components/NetBoard';
import mid from '../utils/Mid';
import WS from 'react-native-websocket'
import ENetHelper from '../natives/eNetHelper';



export default function EGame({ route, navigation }) {
    
    const [color,setColor] = React.useState(0);
    const [showModal,setShowModal] = React.useState(false);
    const [winnerText,setWinnerText] = React.useState("");
    React.useEffect(()=>{
        ENetHelper.getIsFirst().then((res)=>{
            if(res) {
                setColor(1);
            } else {
                setColor(2);
            }
        }).catch(err=>{
            console.log(err);
        })
    },[]);

    const waitFor = () => {
        console.log("wait");
        ENetHelper.readXY((res)=>{
            if(res==='close') {
                // 连接关闭
                setWinnerText("对方离开房间");
                setShowModal(true);
                return ;
            }
            let arr = res.split(",");
            let x = parseInt(arr[0]);
            let y = parseInt(arr[1]);
            console.log("readxy: ",res);
            mid.send("fa",x,y);
        })
    }

    React.useEffect(()=>{
        // 先等待
        if(color===2) {
            waitFor();
        }
    },[color]);

    React.useEffect(()=>{
        mid.init("fa",(x,y)=>{
            ENetHelper.sendXY(x,y,(res)=>{
                if(res==='close') {
                    // 连接关闭
                    setWinnerText("对方离开房间");
                    setShowModal(true);
                    return ;
                }
            });
            waitFor();
        });
        return () => {
            mid.remove("fa");
        }
    },[mid]); 

    const finCb = (color) => {
        console.log("游戏结束")
        setWinnerText((color===1?"黑棋":"白棋")+"胜利!");
        setShowModal(true);
    }

    const board = new Board(18,15);


    const close = () => {
        setShowModal(false);
        navigation.popToTop();
    }

    const again = () => {
        navigation.popToTop();
        navigation.navigate("EGame");
    }
    const [leaveModal,setLeaveModal] = React.useState(false);
    // 注册back监听
    React.useEffect(()=>{
        console.log("注册back监听")
        const handler = function(){
            console.log("back");
            setLeaveModal(true);
                // 接管
            return true;
        }
        BackHandler.addEventListener("hardwareBackPress",handler)
        return ()=>{
            BackHandler.removeEventListener("hardwareBackPress",handler);
        }
    },[]);
    const leave = () => {
        setLeaveModal(false);
        ENetHelper.exitGame();
        navigation.popToTop();
    }
    return (
        <View
            style={styles.button}
        >
            <NetBoard finCb={finCb} color={color}  n={18} m={15} mid={mid}></NetBoard>
            <Modal
                visible={showModal}
                animationType="slide"
                transparent={true}
                onRequestClose={
                    () => {
                        console.log("close");
                    }
                }
            >
                <View
                    style={styles.ModalContainer}
                >
                    <View 
                        style={styles.ModalContent}
                    >
                        <Text
                            style={styles.ModalText}
                        >   
                            {winnerText}
                        </Text>
                        <View
                            style={styles.buttonCC}
                        >
                            <View
                                style={styles.buttonContainer}
                            >
                                <Button
                                    title='关闭'
                                    onPress={close}
                                />
                            </View>
                            {
                                (winnerText=="对方离开房间")?null:<View
                                    style={styles.buttonContainer}
                                >
                                    <Button
                                        title='再来一局'
                                        onPress={again}
                                    />
                                </View>
                            }
                        </View>
                    </View>
                </View>
            </Modal>


            <Modal
                visible={leaveModal}
                animationType="slide"
                transparent={true}
                onRequestClose={
                    () => {
                        console.log("close");
                    }
                }
            >
                <View
                    style={styles.ModalContainer}
                >
                    <View 
                        style={styles.ModalContent}
                    >
                        <Text
                            style={{
                                ...styles.ModalText,
                                marginLeft: -30,
                            }}
                        >   
                            确定要离开房间嘛?
                        </Text>
                        <View
                            style={styles.buttonCC}
                        >
                          <View
                                style={styles.buttonContainer}
                            >
                                <Button
                                    title='确定'
                                    onPress={leave}
                                />
                            </View>
                            <View
                                style={styles.buttonContainer}
                            >
                                <Button
                                    title='取消'
                                    onPress={()=>{
                                        setLeaveModal(false);
                                    }}
                                />
                             </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}


const styles = StyleSheet.create({
    button: {   
        height: "100%",
        width: "100%",
        padding: 20,
    },
    ModalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,.5)",
    },
    ModalContent: {
        height: 150,
        width: 190,
        borderRadius: 10,
        backgroundColor: "#fff",
        position: "relative",
    },
    ModalText: {
        color: "#000",
        position: "absolute",
        top: "30%",
        left: "33%",
        fontWeight: "700",
        fontSize: 16,
    },
    buttonCC: {
        flexDirection: "row",
        position: "absolute",
        bottom: 10,
    },
    buttonContainer: {
        width: 80,
        marginLeft: 10,
    },
    buttonContainer: {
        width: 80,
        marginLeft: 10,
    },
})