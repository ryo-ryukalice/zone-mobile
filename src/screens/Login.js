import React from 'react';
import { View, Text, Button, TextInput, ActivityIndicator, StyleSheet, AsyncStorage } from 'react-native';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { accountId: '', password: '', loading: false, failed: false };
  }

  async componentDidMount() {
    if (await AsyncStorage.getItem('api_token')) {
      this.props.navigation.navigate('main')
    }
  }

  onSubmit() {
    this.setState({ loading: true })
    return (
      fetch(`https://zone-web.herokuapp.com/api/login.json?account_id=${this.state.accountId}&password=${this.state.password}`)
        .then((response) => response.json())
        .then((jsonData) => {
          this.setState({ loading: false })
          if (jsonData['api_token']) {
            AsyncStorage.setItem('api_token', jsonData['api_token']);
            this.props.navigation.navigate('main')
          }
          else {
            this.setState({ failed: true })
          }
        })
        .catch((error) => console.error(error))
    )
  }

  loginButton() {
    if (this.state.loading) {
      return <ActivityIndicator size="small" />
    }
    else {
      return <Button title="ログイン" onPress={() => {this.onSubmit()}} />
    }
  }

  render() {
    return (
      <View>
        {this.state.failed && <Text>ログインに失敗しました。</Text>}

        <TextInput
          style={styles.textInput}
          placeholder="アカウントID"
          onChangeText={(accountId) => this.setState({accountId})}
        />

        <TextInput
          secureTextEntry={true}
          style={styles.textInput}
          placeholder="パスワード"
          onChangeText={(password) => this.setState({password})}
        />

        {this.loginButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    height: 60,
    width: 300,
    paddingLeft: 20,
    margin: 10,
    borderWidth: 1,
    borderRadius: 8,
  }
});
