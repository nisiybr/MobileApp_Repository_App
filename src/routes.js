import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from './pages/Main';
import User from './pages/User';

const Routes = createAppContainer(
  createStackNavigator(
    {
      Main,
      User,
    },
    {
      headerLayoutPreset: 'center', // Deixa o titulo no centro por padrao
      headerBackTitleVisible: false, // Texto no botao de voltar, desabilitado
      defaultNavigationOptions: {
        headerStyle: {
          backgroundColor: '#7159c1', // cor do fundo
        },
        headerTintColor: '#FFF', // cor da letra e botoes
      },
    }
  )
);

export default Routes;
