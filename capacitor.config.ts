import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tutrain',
  appName: 'Tutrain',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: false,
      androidSplashResourceName: 'splash',
      backgroundColor: '#031a70' // YOUR SPLASH SCREEN MAIN COLOR
    }
}
};

export default config;
