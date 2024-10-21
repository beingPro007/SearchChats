import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory and file name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'development', // Change to 'production' for production builds
  entry: {
    content: './frontend/content.js', // Entry point for content script
    popup: './frontend/popup.js', // Entry point for popup script
  },
  output: {
    filename: '[name].bundle.js', // Output bundle file name using the entry point name
    path: path.resolve(__dirname, 'dist'), // Output directory
    clean: true, // Clean the output directory before each build
  },
  resolve: {
    extensions: ['.js'], // Resolve .js files automatically
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Match JavaScript files
        exclude: /node_modules/, // Exclude node_modules directory
        use: {
          loader: 'babel-loader', // Use Babel to transpile JavaScript
          options: {
            presets: ['@babel/preset-env'], // Use the preset for modern JavaScript
          },
        },
      },
    ],
  },
  devtool: 'source-map', // Enable source maps for easier debugging
};
