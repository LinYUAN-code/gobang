import React from 'react';
import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    TextInput,
    Button,
    Image,
} from 'react-native'
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateUser() {
    const [name,setName] = React.useState("");
    const [uri,setUri] = React.useState("");

    React.useEffect(()=>{
        (async () => {
            try {
                let user = await AsyncStorage.getItem("user");
                user = JSON.parse(user);
                console.log(user);
                if(!user) {
                    user = {
                        name: "",
                        uri: "",
                    }
                }
                setUri(user.uri);
                setName(user.name);
            } catch(e) {
                console.log(e);
            }

        })();
    },[]);

    const uploadAvatar = () => {
        ImagePicker.openPicker({
            width: 200,
            height: 300,
            cropping: true,
            cropperCircleOverlay: true,
        }).then(image => {
            setUri(image.path);
            AsyncStorage.setItem("user",JSON.stringify({
                name: name,
                uri: image.path,
            })).catch(e=>{
                console.log(e);
            })

            const user = {};
        }).catch((e)=>{
            console.log(e);
        })
    }
    const changeName = (text) => {
        setName(text);
        AsyncStorage.setItem("user",JSON.stringify({
            name: text,
            uri: uri
        })).catch(e=>{
            console.log(e);
        })
    }

    return (
		<ImageBackground
			source={require("../static/2.jpg")}
			style={styles.back}
		>
        <View style={styles.avatarContainer}>
            <Image
                style={styles.avatar}
                source={uri?{uri}:require("../static/4.jpeg")}
            />
            <Button
                title="上传头像"
                onPress={uploadAvatar}
            />
        </View>
        <View style={styles.nameContainer}>
            <Text
                style={styles.label}
            >
                输入用户名
            </Text>
            <TextInput
                style={styles.input}
                onChangeText={text => changeName(text)}
                onSubmitEditing={changeName}
                value={name}
            />
        </View>

        </ImageBackground>
    )
}

const styles = StyleSheet.create({
	back: {
		width: "100%",
		height: "100%",
		position: "relative",
        alignItems: "center",
	},
    input: {
        height: 40,
        width: 200,
        color: "#000",
        backgroundColor: "rgba(255,255,255,.7)",
        borderRadius: 10,
    },
    nameContainer: {
        flexDirection: "row",
        marginTop: 30,
    },
    label: {
        fontWeight: "700",
        lineHeight: 40,
        color: "#000",
        fontSize: 15,
		textShadowColor: "rgba(0,0,0,.5)",
		textShadowOffset: {width:2,height:2},
		textShadowRadius: 4,
    },
    avatarContainer: {

    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginTop: 250,
        marginBottom: 20,
    }
})

