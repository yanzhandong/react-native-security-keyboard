import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';
import SecurityKeyboard from 'react-native-security-keyboard'

export default class App extends Component<Props> {
    _onChangeText(value){
        console.log(value)
    }
    _onFocus(){
        console.log('_onFocus')
    }
    _onBlur(){
        console.log('_onBlur')
    }
    parsePrice(obj) {
        //必须保证第一位为数字而不是.
        obj = obj.replace(/[^\d.]/g, "");
        //保证只有出现一个.而没有多个.
        obj = obj.replace(/^\./g, "");
        //保证.只出现一次，而不能出现两次以上
        obj = obj.replace(/\.{2,}/g, ".");
        obj = obj.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        //只能输入两个小数
        obj = obj.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
        return obj;
    }
    keyboardHeader(){
        return(
            <View style={styles.header}>
                <Text>自定义头部</Text>
            </View>
        )
    }
    render() {
        return (
            <View style={styles.container}>
                <SecurityKeyboard
                    keyboardHeader={this.keyboardHeader()}
                    style={styles.securityKeyboard}
                    valueStyle={styles.value}
                    placeholderTextColor={'red'}
                    onChangeText={this._onChangeText.bind(this)}
                    regs={this.parsePrice.bind(this)}
                    onFocus={this._onFocus.bind(this)}
                    onBlur={this._onBlur.bind(this)}
                    secureTextEntry={false}
                    caretHidden={false}
                    disabled={false}
                    ref={$moneyInput=>{
                        this.$moneyInput = $moneyInput;
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF',
    },
    securityKeyboard:{
        width:'100%',
        borderColor:'#cccccc',
        borderWidth:1
    },
    value:{
        fontSize:20,
        color:'#000000'
    },
    header:{
        justifyContent:'center',
        flexDirection:'row'
    }
});
