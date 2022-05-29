import { StyleSheet, Text, TouchableOpacity, View, Alert, UIManager } from "react-native";
import React from 'react'



export default function NetBoard(props) {
    // [0,n]
    // [0,m]
    const dotArray = [
        [3,3],[3,12],[15,3],[15,12]
    ];
    const n = props.n;
    const m = props.m;
    // const targetColor = props.color;
    const targetColor = React.useRef(0);
    targetColor.current = props.color;
    const mid = props.mid;
    const finCb = props.finCb;   
    // 用来记录上一个棋子的位置 方便进行胜负判断 
    const preX = React.useRef(-1);
    const preY = React.useRef(-1);

    React.useEffect(()=>{
        mid.init("son",(x,y)=>{
            console.log(x,y);
            // 这里有坑--会形成闭包
            if(color.current === targetColor.current) {
                console.log("error!!! NetBoard");
                return ;
            }
            board.current[y][x] = color.current;
            preX.current = x;
            preY.current = y;
            color.current = targetColor.current;
            if(color.current === 0) {
                color.current = 2;
            }
            console.log(color.current,targetColor.current);
            // 强制刷新
            setShow(true);
            setShow(false);
        })
        return ()=>{mid.remove("son");}
    },[mid]);

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
        if(color.current !== targetColor.current)return ;
        setShow(true);
        let x = e.nativeEvent.pageX-rootX.current;
        let y = e.nativeEvent.pageY-rootY.current;
        const wUnit = sWidth / 2;
        const hUnit = sHeight / 2;
        let rx = Math.floor((Math.floor(x / wUnit)+1)/2);
        let ry = Math.floor((Math.floor(y / hUnit)+1)/2);
        if(ry<0)ry = 0;
        if(ry>=n)ry = n;
        if(rx<0)rx = 0;
        if(rx>=m)rx = m;
        setMoveX((rx-0.5) * sWidth);
        setMoveY((ry-0.5) * sHeight);
    }

    const onRelease = (e) => {
        if(color.current !== targetColor.current)return ;
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
            
            preX.current = rx;
            preY.current = ry;

            color.current = color.current === 1 ? 2 : 1;

            // 告知父组件下棋子了
            mid.send("son",rx,ry);
        }
        setShow(false);
    }

    const onLayout = (e) => {
        ref.current.measure((x,y,w,h,px,py)=>{
            rootX.current = px;
            rootY.current = py;
        })
    }
    // 判断下这一个子之后是否胜利
    // 实际调用的时候传入的参数时 (y,x)
    const isWin = React.useCallback((x,y)=>{
        let nc = board.current[x][y];
        // 统计几个方向就好了
        let dir = [[[0,-1],[0,1]],[[1,0],[-1,0]],[[-1,-1],[1,1]],[[1,-1],[-1,1]]];
        for(let arr of dir) {
            let tmp = 1;
            for(let dd of arr) {
                let tx = x;
                let ty = y;
                while(true) {
                    tx += dd[0];
                    ty += dd[1];
                    if(tx < 0 || tx >= m || ty < 0 || ty>=m)break;
                    if(board.current[tx][ty] !== nc) {
                        break;
                    }
                    tmp++;
                }
            }
            if(tmp >= 5)return true;
        }
        return false;
    })


    // 因为修改board的时候采用show进行强制刷新的--所以监听show的变化进行胜利还是失败判断
    React.useEffect(()=>{
        if(preX.current===-1 || preY.current===-1)return ;
        if(isWin(preY.current,preX.current)) { // gameOver
            console.log(board.current[preY.current][preX.current])
            finCb(board.current[preY.current][preX.current]);
            targetColor.current = -1;
        }
    },[show]);
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
            {  
                dotArray.map(v=>{
                    return (
                        <View
                            key={`dot${v[0]}dot${v[1]}`}
                            style = {{
                                width: 6,
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: "rgba(0,0,0,.4)",
                                position: "absolute",
                                top: (v[0]-0.1)*sHeight,
                                left: (v[1]-0.05)*sWidth,
                            }}
                        >
                        </View>
                    )
                }) 
            }
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        backgroundColor: "#f9e8b7",
        paddingLeft: 2,
        height: 380,
        paddingTop: .6,
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