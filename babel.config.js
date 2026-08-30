module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // worklets eklentisi listenin sonunda olmalı (Reanimated 4 gereksinimi)
    plugins: ['nativewind/babel', 'react-native-worklets/plugin'],
  };
};
