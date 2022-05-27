
import React from 'react';
import {
    View,
    Text,
} from 'react-native'
import { getUser } from '../utils/user';
import ENetHelper from '../natives/eNetHelper';

export default function EPlay({ navigation }) {

    const user = React.useRef({});
    getUser(navigation,user);

    ENetHelper.getNativeIp().then((res)=>{
        console.log(res);
    });
    return (
        <View>
            <Text>
                Eplay
            </Text>
        </View>
    )
}