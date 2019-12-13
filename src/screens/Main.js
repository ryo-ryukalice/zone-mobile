import React from 'react';
import { View, FlatList, TextInput, Button, AsyncStorage, ActivityIndicator, StyleSheet } from 'react-native';
import { CheckBox } from 'react-native-elements';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = { taskName: '', tasks: [], loading: '', apiToken: '' };
  }

  async componentDidMount() {
    this.setState({ loading: true, apiToken: await AsyncStorage.getItem('api_token') })
    fetch(`https://zone-web.herokuapp.com/api/tasks.json?api_token=${this.state.apiToken}`)
      .then((response) => response.json())
      .then((jsonData) => (this.setState({ loading: false, tasks: jsonData })))
      .catch((error) => console.error(error));
  }

  submitCreateTask() {
    if (!this.state.taskName) return

    this.setState({ loading: true })
    fetch(`https://zone-web.herokuapp.com/api/tasks`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_token: this.state.apiToken, task: { name: this.state.taskName } })
    })
    .then(response => response.json())
    .then(json => { this.setState({ tasks: this.state.tasks.concat(json), taskName: '', loading: false }) })
    .catch((error) => console.error(error));
  }

  changeFinished(item) {
    item.finished = !item.finished
    this.setState({ loading: true })

    fetch(`https://zone-web.herokuapp.com/api/tasks/${item.id}`, {
      method: 'PATCH',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_token: this.state.apiToken, task: { finished: item.finished } })
    })
    .then(response => this.setState({ loading: false }))
    .catch((error) => console.error(error));
  }

  createTaskButton() {
    if (this.state.loading) return <ActivityIndicator size="small" />
    else return <Button title="作成" onPress={() => {this.submitCreateTask()}} />
  }

  renderTasks() {
    if (this.state.loading) return <FlatList />
    else {
      return(
        <FlatList
          data={this.state.tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CheckBox title={item.name} checked={item.finished} onPress={() => this.changeFinished(item)} />
          )}
        />
      )
    }
  }

  logout() {
    AsyncStorage.removeItem('api_token');
    this.props.navigation.navigate('login')
  }

  render() {
    return (
      <View>
        <View style={styles.form}>
          <TextInput
            style={styles.textInput}
            placeholder="タスク名"
            value={this.state.taskName}
            onChangeText={(taskName) => this.setState({taskName})}
          />

          {this.createTaskButton()}
        </View>

        {this.renderTasks()}

        <View style={styles.logout}>
          <Button title="ログアウト" onPress={() => {this.logout()}} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  form: { margin: 40 },
  textInput: {
    height: 60,
    width: 300,
    paddingLeft: 20,
    margin: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  logout: { marginBottom: 20 }
});
