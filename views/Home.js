import React from 'react'
import {Text, View, ImageBackground, StyleSheet, Button} from 'react-native'

export default function Home({ navigation }) {
    return (
		<ImageBackground
			source={require("../static/home.jpg")}
			style={styles.back}
		>
			<Text
				style={styles.header}
			>
				棋魂
			</Text>
			<View
				style={styles.buttonContainer}
			>
				<View
					style={styles.button}
				>
					<Button
						title='双人模式'
						onPress={()=>{
							navigation.navigate("Play");
						}}
					/>
				</View>
				<View
					style={styles.button}
				>
					<Button
						title='局域网模式'		
						color="#2ecc71"		
						onPress={()=>{
							navigation.navigate("EPlay")
						}}
					/>
				</View>
				<View
					style={styles.button}
				>
					<Button
						title='联网模式'				
						color="#2ecc71"	
						onPress={()=>{
							navigation.navigate("IPlay")
						}}	
					/>
				</View>
				<View
					style={styles.button}
				>
					<Button
						title='修改用户信息'				
						color="#2ecc71"	
						onPress={()=>{
							navigation.navigate("CreateUser")
						}}	
					/>
				</View>
			</View>

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
		fontSize: 40,
		color: "#000",
		marginTop: 200,
		textAlign: "center",
		textShadowColor: "rgba(0,0,0,.5)",
		textShadowOffset: {width:2,height:2},
		textShadowRadius: 4,
		fontStyle: 'italic',
	},
	buttonContainer: {
		display: "flex",
		alignItems: "center",
	},
	button: {
		marginTop: 40,
		width: 100,
		height: 40,
	},
})

