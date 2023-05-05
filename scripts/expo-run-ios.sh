PLATFORM=$1
MODE=$2
TARGET=$3
ENV='.env'

prebuild_ios(){
	cp ./src/mobile/modules/web3/services/webview-inpage/EthereumProvider.js ios
}

buildiOSRun(){
	prebuild_ios
	expo run:ios -d
}

buildiOSRun

