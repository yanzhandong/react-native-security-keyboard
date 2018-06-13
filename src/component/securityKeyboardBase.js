import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Animated,
    Modal,
    Button,
    Icon,
    DeviceEventEmitter,
    Image
} from 'react-native';
import styles from '../style/securityKeyboard'
import SecurityKeyboardInput from './securityKeyboardInput'
import PropTypes from 'prop-types';


class SecurityKeyboard extends Component{
    static propTypes = {
        value: PropTypes.any, //内容
        placeholder: PropTypes.string, //提示文字
        placeholderTextColor: PropTypes.string, //提示文字颜色
        disabled:PropTypes.bool, //是否可以输入
        caretHidden: PropTypes.bool, //是否隐藏光标
        secureTextEntry: PropTypes.bool, //是否开启密码模式
        style: PropTypes.any, //外壳样式
        valueStyle: PropTypes.any, //内容样式
        regs: PropTypes.func,//校验函数
        onChangeText: PropTypes.func,  //内容更改后的回调
        onFocus: PropTypes.func,  //得到焦点后的回调
        onBlur: PropTypes.func,  //失去焦点后的回调
    };
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false, //弹窗锁
            caretHidden: false,//隐藏光标
            secureTextEntry: false,//密码模式
            valueArr:[],//文字,
            numArr:[1,2,3,4,5,6,7,8,9,'.',0,'X'], //键盘数组
            cursorLock:true,//光标锁
        };
    }
    componentDidMount() {
        let that = this;
        //设置密码模式
        this.props.secureTextEntry && this.setState({
            secureTextEntry: true
        });
        this.props.caretHidden && this.setState({
            caretHidden: true
        });
    }
    shouldComponentUpdate(nextProps,nextState){
        //去除不必要的渲染
        if(
            this.state.modalVisible != nextState.modalVisible ||
            this.state.cursorLock != nextState.cursorLock ||
            this.props.disabled != nextProps.disabled
        ){
            return true
        }
        return false
    }
    //显示键盘
    show(){
        this.setState({
            modalVisible:true,
            cursorLock:false
        });
        this.onFocus();
    }
    //隐藏键盘
    hide(){
        this.setState({
            modalVisible:false,
            cursorLock:true
        });
        this.onBlur();
    }
    //发送事件 附带input内容
    inputEvent(value){
        DeviceEventEmitter.emit('securityKeyboardInput',value);
        this.onChangeText(value);
    }
    //回调onChangeText
    onChangeText(value){
        if(value == undefined || value== null) return false;
        this.props.onChangeText && this.props.onChangeText(value.join(''))
    }
    //得到焦点
    onFocus(){
        this.props.onFocus && this.props.onFocus()
    }
    //失去焦点
    onBlur(){
        this.props.onBlur && this.props.onBlur()
    }
    //校验文字
    regs(valueArr){
        if(!this.props.regs){
            return valueArr
        }
        valueArr = this.props.regs(valueArr.join(''));
        valueArr = valueArr.split('');
        return valueArr
    }
    //增加文字
    add(value){
        let valueArr = this.state.valueArr;
        valueArr.push(value);
        if(valueArr == '' || valueArr == undefined || valueArr == null){
            return
        }
        valueArr = this.regs(valueArr);
        this.setState({
            valueArr:valueArr
        });
        this.inputEvent(valueArr)
    }

    //删除文字
    remove(){
        let valueArr = this.state.valueArr;
        if(valueArr.length == 0){ return };
        valueArr.pop();
        this.setState({
            valueArr:valueArr
        });
        this.inputEvent(valueArr)
    }
    //长按删除
    removeAll(){
        let valueArr = this.state.valueArr;
        if(valueArr.length == 0){ return };
        valueArr = [];
        this.setState({
            valueArr:valueArr
        });
        this.inputEvent(valueArr)
    }
    //渲染文字
    renderNumText(flag){
        return this.state.numArr.slice(flag,(flag+3)).map((item,index)=>{
            let styleLine = (item == 'X' || item == '.') ? styles.toolLine : styles.line;
            let styleNumText = (item == 'X' || item == '.') ? styles.specialNumText : styles.numText;
            if(item == 'X'){
                return(
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styleLine}
                        valueStyle={this.props.valueStyle}
                        key={index}
                        onPress={this.remove.bind(this)}
                        onLongPress={this.removeAll.bind(this)}
                    >
                        <Image style={styles.removeIcon} source={require('../images/icon-delete.png')}/>
                    </TouchableOpacity>
                )
            }
            return(
                <TouchableOpacity style={styleLine} activeOpacity={0.7} key={index} onPress={this.add.bind(this,item)}>
                    <Text style={styleNumText}>{item}</Text>
                </TouchableOpacity>
            )
        })
    }
    renderNum(){
        return this.state.numArr.map((item,index)=>{
            if(index % 3 == 0){
                return(
                    <View style={styles.numWrap} key={index}>
                        {this.renderNumText(index)}
                    </View>
                )
            }
        })
    }
    render() {
        return (
            <View>
                <SecurityKeyboardInput
                    disabled={this.props.disabled}
                    caretHidden={this.state.caretHidden}
                    secureTextEntry={this.state.secureTextEntry}
                    value={this.props.value}
                    cursorLock={this.state.cursorLock}
                    style={this.props.style}
                    show={this.show.bind(this)}
                    placeholder={this.props.placeholder}
                    placeholderTextColor={this.props.placeholderTextColor}
                />
                <Modal
                    animationType={"fade"}
                    presentationStyle={"overFullScreen"}
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <View style={styles.root} >
                        <Text style={{position:'absolute',top:0,left:0,bottom:0,right:0,backgroundColor:'rgba(0,0,0,0)'}}
                              onPress={this.hide.bind(this)}>
                        </Text>
                        <View style={styles.keyboardWrap}>
                            <View style={styles.headerWrap}>
                                <Image style={styles.headerImage} source={require('../images/text.png')}/>
                                <TouchableOpacity onPress={this.hide.bind(this)} style={styles.closeIconWrap}>
                                    <Image style={styles.closeIcon} source={require('../images/icon-down.png')}/>
                                </TouchableOpacity>
                            </View>
                            {
                                this.renderNum()
                            }
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}


export default SecurityKeyboard
