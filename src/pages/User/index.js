import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native'; /** Icone de loading ja estilizado no OS */
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  LoadingIndicator,
  LoadingIndicatorText,
  LoadingMoreIndicator,
  LoadingMoreIndicatorText,
} from './styles';

class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  /** entre chaves e parenteses para mostrar que eh um objeto */
  state = {
    stars: [],
    loading: true,
    loadingMore: false,
    page: 1,
    per_page: 15,
    endOfRepository: false,
    refreshing: false,
  };

  async componentDidMount() {
    this.load();
  }

  load = async () => {
    const { navigation } = this.props;
    const { page, per_page } = this.state;
    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred`, {
      params: {
        page,
        per_page,
      },
    });

    this.setState({
      stars: response.data,
      loading: false,
    });
  };

  handleNavigate = star => {
    const { navigation } = this.props;
    navigation.navigate('Repository', { star });
  };

  refreshList = async () => {
    await this.setState({ refreshing: true, page: 1, endOfRepository: false });
    this.load();
    this.setState({ refreshing: false });
  };

  loadMore = async () => {
    const { navigation } = this.props;
    const { page, per_page, stars, endOfRepository } = this.state;
    const user = navigation.getParam('user');
    if (!endOfRepository) {
      this.setState({ loadingMore: true });
      const response = await api.get(`/users/${user.login}/starred`, {
        params: {
          page: page + 1,
          per_page,
        },
      });

      console.log(response.data.length);
      if (response.data.length > 0) {
        this.setState({
          stars: [...stars, ...response.data],
          page: page + 1,
        });
      } else {
        this.setState({ endOfRepository: true });
      }
      this.setState({ loadingMore: false });
    }
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, loadingMore, refreshing } = this.state;
    const user = navigation.getParam('user');
    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading ? (
          <LoadingIndicator>
            <LoadingIndicatorText>Carregando...</LoadingIndicatorText>
            <ActivityIndicator />
          </LoadingIndicator>
        ) : (
          <Stars
            onEndReachedThreshold={0.2} // Carrega mais itens quando chegar em 20% do fim
            onEndReached={this.loadMore} // Função que carrega mais itens
            onRefresh={this.refreshList} // Função dispara quando o usuário arrasta a lista pra baixo
            refreshing={refreshing} // Variável que armazena um estado true/false que representa se a lista está atualizando
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred onPress={() => this.handleNavigate(item)}>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
        {loadingMore ? (
          <LoadingMoreIndicator>
            <LoadingMoreIndicatorText>Carregando...</LoadingMoreIndicatorText>
            <ActivityIndicator />
          </LoadingMoreIndicator>
        ) : (
          <></>
        )}
      </Container>
    );
  }
}
export default User;
