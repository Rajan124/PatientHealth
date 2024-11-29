module.exports = function (api) {
    api.cache(true);
    return {
      presets: [
        'metro-react-native-babel-preset', // Use React Native preset
        '@babel/preset-env', // Transpile ES6+ features
        '@babel/preset-react', // To handle JSX syntax
      ],
      plugins: [
        '@babel/plugin-transform-runtime', // To avoid issues with helpers and polyfills
      ],
    };
  };
  