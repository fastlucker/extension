PLATFORM=$1
MODE=$2
TARGET=$3
ENV='.env'

prebuild_android(){
	# Copy JS files for injection
	cp -rf ./src/mobile/modules/web3/services/webview-inpage/EthereumProvider.js ./android/app/src/main/assets
}

buildAndroidRun(){
	prebuild_android
	expo run:android
}

buildAndroidRun

