

import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View ,Alert } from "react-native";
import Board from '../Board';

export default function Play() {
    const board = new Board(18,15);
    return (
        <TouchableOpacity
            style={styles.button}
            activeOpacity={1}
        >
            <Board n={18} m={15}></Board>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    button: {   
        height: "70%",
        width: "100%",
        padding: 20,
    },
})