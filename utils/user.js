import AsyncStorage from '@react-native-async-storage/async-storage';


export async function getUser(navigation,target) {
    try {
        let user = await AsyncStorage.getItem("user");
        user = JSON.parse(user);
        if(user===null || !user.name) {
            navigation.reset({
                index: 0,
                routes: [
                    { name: "Home" },
                    { name: 'CreateUser' }
                ],
            });
            return ;
        }
        target.current = user;
    }catch(e) {
        console.log(e);
    }
}