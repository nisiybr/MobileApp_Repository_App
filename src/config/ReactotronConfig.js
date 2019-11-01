import Reactotron from 'reactotron-react-native';

if (__DEV__) {
  // variavel global do react native, so vem true se for ambiente de DEV
  const tron = Reactotron.configure()
    .useReactNative()
    .connect();
  console.tron = tron;
  tron.clear(); // limpa a timeline toda fez que der refresh
}
