import { StyleSheet, Text, TouchableOpacity, View, Alert, UIManager } from "react-native";
import React from 'react'



export default function Board(props) {
    // [0,n]
    // [0,m]
    const n = props.n;
    const m = props.m;
    const mode = props.mode; //1本地模式 2联机模式
    const board = React.useRef([]);
    if(!board.current.length) {
        for(let i=0;i<=n;i++) {
            board.current[i] = [];
        }
        for(let i=0;i<=n;i++) 
            for(let j=0;j<=m;j++) {
                board.current[i][j] = 0; // 0 没下 1 黑色 2 白色
            }
    }

    const color = React.useRef(1);
    const ref = React.useRef({});
    const rootX = React.useRef(0);
    const rootY = React.useRef(0);
    const [sHeight,setSheight] = React.useState(21);
    const [sWidth,setSwidth] = React.useState(21);
    const [show,setShow] = React.useState(false);
    const [moveX,setMoveX] = React.useState(0);
    const [moveY,setMoveY] = React.useState(0);
    const onMove = (e) => {
        setShow(true);
        let x = e.nativeEvent.pageX-rootX.current;
        let y = e.nativeEvent.pageY-rootY.current;
        // 0
        // 1 2 
        // 3 4
        // 5 6
        // 7 8
        const wUnit = sWidth / 2;
        const hUnit = sHeight / 2;
        let rx = Math.floor((Math.floor(x / wUnit)+1)/2);
        let ry = Math.floor((Math.floor(y / hUnit)+1)/2);
        // 越界判断
        if(ry<0)ry = 0;
        if(ry>=n)ry = n;
        if(rx<0)rx = 0;
        if(rx>=m)rx = m;
        setMoveX((rx-0.5) * sWidth);
        setMoveY((ry-0.5) * sHeight);
    }

    const onRelease = (e) => {
        const wUnit = sWidth / 2;
        const hUnit = sHeight / 2;
        let x = e.nativeEvent.pageX-rootX.current;
        let y = e.nativeEvent.pageY-rootY.current;
        let rx = Math.floor((Math.floor(x / wUnit)+1)/2);
        let ry = Math.floor((Math.floor(y / hUnit)+1)/2);
        // 越界判断
        if(ry<0)ry = 0;
        if(ry>=n)ry = n;
        if(rx<0)rx = 0;
        if(rx>=m)rx = m;
        if(!board.current[ry][rx]) {
            board.current[ry][rx] = color.current;
            // 判断是否胜利
            color.current = color.current === 1 ? 2 : 1;
        }
        setShow(false);
    }

    const onLayout = (e) => {
        ref.current.measure((x,y,w,h,px,py)=>{
            rootX.current = px;
            rootY.current = py;
        })
    }
    const isWin = React.useCallback(()=>{

    })
    return (
        <View 
            onLayout={onLayout}
            onStartShouldSetResponder={evt=>true} 
            onMoveShouldSetResponder={evt=>true}
            onResponderMove={onMove}
            onResponderRelease={onRelease}
            style={styles.container}
            ref={ref}
        >
            {
                board.current.slice(0,n).map((v,i)=>{
                    return <View style={styles.row} key={i+"row"}>
                        {
                            board.current[i].slice(0,m).map((v,j)=>{
                                return <View style={styles.col} key={j+"col"+i+"row"}></View>
                            })
                        }
                    </View>
                })
            }
            {
                board.current.map((v,i)=>{
                    return (
                        board.current[i].map((v,j)=>{
                            if(board.current[i][j]===0) {
                                return null;
                            }
                            if(board.current[i][j]===1) {
                                return  <View 
                                            key={"black"+i+"row"+j+"col"}
                                            style={{
                                                width: sWidth,
                                                height: sWidth,
                                                backgroundColor: "#000",
                                                position: "absolute",
                                                top: (i-0.5) * sHeight,
                                                left: (j-0.5) * sWidth,
                                                borderRadius: sHeight,
                                            }}
                                        ></View>
                            } else {
                                return  <View 
                                            key={"white"+i+"row"+j+"col"}
                                            style={{
                                                width: sWidth,
                                                height: sWidth,
                                                backgroundColor: "#fff",
                                                position: "absolute",
                                                top: (i-0.5) * sHeight,
                                                left: (j-0.5) * sWidth,
                                                borderRadius: sHeight,
                                            }}
                                        ></View>
                            }
                        })
                    )
                })
            }
            {
                show ? color.current === 1 ? <View 
                    style={{
                        width: sWidth,
                        height: sWidth,
                        backgroundColor: "#000",
                        position: "absolute",
                        top: moveY,
                        left: moveX,
                        borderRadius: sHeight,
                    }}
                >
                </View> : <View 
                    style={{
                        width: sWidth,
                        height: sWidth,
                        backgroundColor: "#fff",
                        position: "absolute",
                        top: moveY,
                        left: moveX,
                        borderRadius: sHeight,
                    }}
                >
                </View> : null
            }

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
    },
    row: {
        height: 21,
        display: "flex",
        flexDirection: "row",
    },
    col: {
        width: 21,
        height: "100%",
        borderColor: "rgba(0,0,0,.5)",
        borderWidth: .2,
    }
})