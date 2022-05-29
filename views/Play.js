

import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View ,Alert, Modal, Button } from "react-native";
import Board from '../components/Board';

export default function Play({ navigation }) {
    const board = new Board(18,15);
    const [showModal,setShowModal] = React.useState(false);
    const [winnerText,setWinnerText] = React.useState("");
    const finCb = (color) => {
        console.log("游戏结束",color);
        setWinnerText((color===1?"黑棋":"白棋")+"胜利!");
        setShowModal(true);
    }

    const close = () => {
        setShowModal(false);
        navigation.popToTop();
    }

    const again = () => {
        navigation.popToTop();
        navigation.navigate("Play");
    }
    return (
        <View
            style={styles.container}
        >
            <Board n={18} m={15} finCb={finCb} ></Board>
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
                            <View
                                style={styles.buttonContainer}
                            >
                                <Button
                                    title='再来一局'
                                    onPress={again}
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
    container: {   
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
    }
})