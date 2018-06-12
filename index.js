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
import SecurityKeyboardInput from './src/component/securityKeyboardInput'
import PropTypes from 'prop-types';


class SecurityKeyboard extends Component{
    static propTypes = {
        value: PropTypes.any, //内容
        placeholder: PropTypes.string, //提示文字
        placeholderTextColor: PropTypes.string, //提示文字颜色
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
            modalVisible:false, //弹窗锁
            valueArr:[],//文字,
            numArr:[1,2,3,4,5,6,7,8,9,'.',0,'X'], //键盘数组
            cursorLock:true,//光标锁
        };
    }
    componentDidMount() {
        let that = this;
    }
    shouldComponentUpdate(nextProps,nextState){
        //去除渲染
        if(this.state.modalVisible != nextState.modalVisible || this.state.cursorLock != nextState.cursorLock){
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
    //增加文字
    add(value){
        let valueArr = this.state.valueArr;
        valueArr.push(value);

        valueArr = this.props.regs(valueArr.join(''));
        if(valueArr == '' || valueArr == undefined || valueArr == null){
            return
        }
        valueArr = valueArr.split('');
        this.setState({
            valueArr:valueArr
        });
        this.inputEvent(valueArr)
    }
    //清除内容（删除全部文字别名）
    clear(){
        this.removeAll();
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
                        <Image style={styles.removeIcon} source={require('./src/images/icon-delete.png')}/>
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
                                <Image style={styles.headerImage} source={require('./src/images/text.png')}/>
                                <TouchableOpacity onPress={this.hide.bind(this)} style={styles.closeIconWrap}>
                                    <Image style={styles.closeIcon} source={require('./src/images/icon-down.png')}/>
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


const styles = StyleSheet.create({
    textInputWrap:{
        borderWidth:1,
        height:40,
        borderColor:'#999999',
        borderRadius:5,
        flexDirection:'row',
        alignItems:'center',
        paddingLeft:px2dp(10)
    },
    cursorWrap:{
        height:40,
        flexDirection:'row',
        alignItems:'center',
    },
    cursor:{
        fontSize:30,
        fontWeight:'300'
    },
    root:{
        flex:1,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center'
    },
    headerWrap:{
        height:42,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    headerText:{
        fontSize:14,
        color:'#5FBF9F'
    },
    headerImage:{
        width:px2dp(260),
        resizeMode:'contain'
    },
    closeIconWrap:{
        position:'absolute',
        right:10
    },
    closeIcon:{
        width:px2dp(40),
        resizeMode:'contain'
    },
    removeIcon:{
        width:px2dp(50),
        resizeMode:'contain'
    },
    keyboardWrap:{
        height:285,
        position:'absolute',
        bottom:0,
        left:0,
        right:0,
        backgroundColor:'#ffffff',
        borderWidth:1,
        borderTopColor:'#cccccc'
    },
    numWrap:{
        flexDirection:'row',
        justifyContent:'space-around'
    },
    toolLine:{
        borderTopColor:'#cccccc',
        borderRightColor:'#cccccc',
        borderTopWidth:1,
        borderRightWidth:1,
        alignItems:'center',
        justifyContent:'center',
        flex:1,
        height:60,
        backgroundColor:'#F5F8FC'
    },
    line:{
        borderTopColor:'#cccccc',
        borderRightColor:'#cccccc',
        borderTopWidth:1,
        borderRightWidth:1,
        alignItems:'center',
        justifyContent:'center',
        flex:1,
        height:60
    },
    specialNumText:{
        paddingBottom:px2dp(15),
        color:'#000000',
        fontSize:26,
        fontWeight:'900'
    },
    numText:{
        color:'#000000',
        fontSize:26,
        fontWeight:'600'
    },
    bottomWrap:{
        flexDirection:'row',
        justifyContent:'space-around'
    }
});
export default SecurityKeyboard
