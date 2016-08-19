package com.rntest;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.auth0.lock.react.LockReactPackage;
import com.auth0.lock.react.LockReactPackage;
import com.auth0.lock.react.LockReactPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.reactnativerecordsound.ReactNativeRecordSoundPackager;
import com.rnfs.RNFSPackage;
import com.zmxv.RNSound.RNSoundPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new LockReactPackage(),
          new MapsPackage(),
          new ReactNativeRecordSoundPackager(),
          new RNFSPackage(),
          new RNSoundPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
