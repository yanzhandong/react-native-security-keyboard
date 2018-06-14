# react-native-security-keyboard

A security keyboard, Re - realized TextInput, and more powerful.

<p align="center">
<img src="http://img-steward-online.goodaa.com.cn/d924715db5be4e9ebea58d161e16270c.gif" alt="Scroll demo" width="400">
</p>

## Installation
Installation can be done through ``npm`` or `yarn`:

```shell
npm i react-native-security-keyboard --save
```

```shell
yarn add react-native-security-keyboard
```

## Usage

Import ``react-native-security-keyboard`` and wrap your content inside
it:

```js
import SecurityKeyboard from 'react-native-security-keyboard'
```

```jsx
<SecurityKeyboard
    placeholder={"手动输入金额"}
    placeholderTextColor={'#E0E0E0'}
    onChangeText={this.XXXX.bind(this)}
    onFocus={this.XXXX.bind(this)}
    style={styles.XXX}
    valueStyle={styles.XXXX}
    ref={$moneyInput=>{
        this.$moneyInput = $moneyInput;
    }}
    regs={this.XXX.bind(this)}
/>
```


## API
### Props

| **Prop** | **Type** | **Description** |
|----------|----------|-----------------|
| `disabled` | `String` | prohibit input, The default is false. |
| `caretHidden` | `String` | hide cursor, The default is false. |
| `secureTextEntry` | `String` |password modal, The default is false.. |
| `placeholderTextColor` | `String` | The color of the text displayed by the placeholder string. |
| `style` | `Object` | custom TextInput external style Style, does not support font Style. |
| `valueStyle` | `Object` | Text content style.|
| `keyboardHeader` | `element` | Customizing the top of the keyboard.|
| `regs` | `Func(value)` | value check, need to return the check after the value out. |
| `onChangeText` | `Func(value)` | Value modified callback. |
| `onFocus` | `Func` | The callback function of the focus. |
| `onBlur` | `Func` | A callback function that loses focus |

### Methods

| **Method** | **Parameter** | **Description** |
|------------|---------------|-----------------|
| `clear` | none | Clear all the content |
| `isFocused` | none |The return value indicates whether the current input box has got the focus. |
| `blur` | none | Lose focus. |
| `focus` | none | Get the focus. |


## Contact
More methods are needed. Please contact me amaze_y@163.com

## Author
Yan