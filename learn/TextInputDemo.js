import React from 'react'
import {Text,TextInput} from 'react-native'


export default function TextInputDemo() {
    const [name,setName] = React.useState("");

    return (
        <>
            <Text>文本输入框</Text>
            <TextInput
                placeholder='请输入名字'
                defaultValue={name}
                onChangeText={text=>setName(text)}
            />
        </>
    )
}


