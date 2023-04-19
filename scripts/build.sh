PLATFORM=$1
MODE=$2
TARGET=$3
ENV='.env'

prebuild(){
	cp ./src/mobile/modules/web3/services/webview-inpage/EthereumProvider.js ios
}

prebuild_ios(){
	prebuild
}

prebuild_android(){
	prebuild
	# Copy JS files for injection
	yes | cp -rf app/core/WebViewInjection.js android/app/src/main/assets/.
}

buildiOSRun(){
	prebuild_ios
	expo run:ios -d
}

buildAndroidRun(){
	prebuild_android
	expo run:android
}



buildiOSRun

