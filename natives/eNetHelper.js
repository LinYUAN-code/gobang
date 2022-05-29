import { NativeModules, NativeEventEmitter  } from 'react-native';

const eventEmitter = new NativeEventEmitter(NativeModules.ENetHelper);
this.eventListener = eventEmitter.addListener('log', (event) => {
   console.log(event.info) // "someValue"
});

NativeModules.ENetHelper.addInviteListener = (cb) => {
    eventEmitter.addListener("invite",cb);
}

export default NativeModules.ENetHelper;