import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Keyboard,
  ActivityIndicator,
} from 'react-native'; /** Icone de loading ja estilizado no OS */
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';

import {
  Container,
  Form,
  SubmitButton,
  Input,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
} from './styles';

class Main extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    newUser: '',
    users: [],
    loading: false,
  };

  async componentDidMount() {
    const users = await AsyncStorage.getItem('users');
    if (users) {
      this.setState({ users: JSON.parse(users) });
    }
  }

  async componentDidUpdate(_, prevState) {
    // props anteriores nao preciso, entao fica como _ primeiro parametro
    const { users } = this.state;
    if (prevState.users !== users) {
      // nao precisa de await, pq nao eh pre requisito para nenhum passo
      AsyncStorage.setItem('users', JSON.stringify(users));
    }
  }

  handleAddUser = async () => {
    this.setState({ loading: true });
    const { users, newUser } = this.state;

    const response = await api.get(`/users/${newUser}`);

    const data = {
      name: response.data.name,
      login: response.data.login,
      bio: response.data.bio,
      avatar: response.data.avatar_url,
    };

    this.setState({
      users: [...users, data],
      newUser: '',
      loading: false,
    });

    Keyboard.dismiss();
  };

  handleNavigate = user => {
    const { navigation } = this.props;
    navigation.navigate('User', { user });
  };

  static navigationOptions = {
    title: 'Usuários',
  };

  render() {
    const { users, newUser, loading } = this.state;

    return (
      <Container>
        <Form>
          <Input
            autoCorrect={false} // nao autocorrige
            autoCapitalize="none" // nao coloca a primeira letra maiscula automaticamente
            placeholder="Adicionar usuário"
            value={newUser} // valor no input
            onChangeText={text => this.setState({ newUser: text })}
            returnKeyType="send" // funcao do botao enter do teclado
            onSubmitEditing={this.handleAddUser} // quando o user pressiona send, aciona essa function
          />
          <SubmitButton loading={loading} onPress={this.handleAddUser}>
            {loading ? (
              <ActivityIndicator color="FFF" />
            ) : (
              <Icon name="add" size={20} color="#FFF" />
            )}
          </SubmitButton>
        </Form>
        <List
          data={users}
          keyExtractor={user => user.login}
          renderItem={({ item }) => (
            <User>
              <Avatar source={{ uri: item.avatar }} />
              <Name>{item.name}</Name>
              <Bio>{item.bio}</Bio>
              <ProfileButton onPress={() => this.handleNavigate(item)}>
                <ProfileButtonText>Ver Perfil</ProfileButtonText>
              </ProfileButton>
            </User>
          )}
        />
      </Container>
    );
  }
}

export default Main;
