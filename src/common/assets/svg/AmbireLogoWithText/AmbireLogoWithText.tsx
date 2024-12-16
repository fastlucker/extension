import React from 'react'
import Svg, { Defs, G, LinearGradient, Path, Stop, SvgProps } from 'react-native-svg'

const AmbireLogoWithText: React.FC<SvgProps> = ({ width = 120, height = 39, ...rest }) => (
  <Svg width={width} height={height} fill="none" viewBox="0 0 120 39" {...rest}>
    <G clipPath="url(#a)">
      <Path
        fill="#1E2033"
        fillRule="evenodd"
        d="M48.426 25.53h-2.658l-1.436-2.697h-6.495L36.4 25.53h-3.209l6.559-12.06h2.733c2.194 4.02 4.386 8.04 6.576 12.06h-.633Zm-7.343-8.784-1.95 3.64h3.886l-1.937-3.64h.001Zm12.08 8.785h-2.467V13.47h2.954l5.206 7.212 5.159-7.212h2.937v12.06h-2.845v-7.75l-4.11 5.828h-2.33l-4.126-5.761v7.684h-.378v-.001Zm26.078 0h-8.684V13.47h8.439c1.255 0 2.28.296 2.997.845a2.886 2.886 0 0 1 1.15 2.407c.01.5-.11.997-.347 1.44a2.948 2.948 0 0 1-1.01 1.09c.428.193.813.473 1.128.82.488.557.75 1.275.734 2.012 0 1.09-.414 1.962-1.204 2.563-.75.571-1.83.882-3.204.882Zm.58-9.366c-.266-.207-.681-.314-1.233-.314h-5.087v2.385h5.104c.426.024.848-.097 1.195-.343a1.096 1.096 0 0 0 .384-.881 1.01 1.01 0 0 0-.361-.847h-.001Zm.356 4.823c-.305-.234-.775-.354-1.378-.354h-5.298v2.515h5.348c.621 0 1.07-.114 1.354-.328a1.063 1.063 0 0 0 .388-.898 1.11 1.11 0 0 0-.414-.935Zm8.841 4.543h-2.612V13.47h2.992v12.06h-.38Zm6.597 0h-2.612V13.47h7.9c1.426 0 2.543.36 3.315 1.021.803.687 1.223 1.679 1.223 2.909 0 1.113-.375 2.033-1.084 2.701a4.266 4.266 0 0 1-2.188 1.036l4.119 4.394h-3.821l-3.866-4.152h-2.606v4.152h-.378l-.002-.001Zm6.39-9.21c-.315-.257-.81-.389-1.478-.389h-4.532v2.984h4.532c.656 0 1.153-.134 1.473-.392.294-.24.45-.605.45-1.091 0-.498-.15-.872-.444-1.112h-.001Zm17.617 9.21h-11.276V13.47h11.54v2.462h-8.598v2.224h7.685v2.446h-7.685v2.466H120v2.463h-.378v-.001Z"
        clipRule="evenodd"
      />
      <Path
        fill="#6000FF"
        d="m21.02 14.718 5.167 10.894a.307.307 0 0 1-.063.34L12.53 38.96a.152.152 0 0 1-.232-.03.148.148 0 0 1-.023-.084v-11.95l8.566-8.19a.277.277 0 0 0 .09-.214l.024-3.774c0-.025.051-.025.064 0Z"
      />
      <Path
        fill="url(#b)"
        fillRule="evenodd"
        d="M12.276 26.896v11.95a.148.148 0 0 0 .09.142.152.152 0 0 0 .165-.028l13.593-13.008a.308.308 0 0 0 .063-.34l-5.306-6.948-8.605 8.232Z"
        clipRule="evenodd"
      />
      <Path
        fill="url(#c)"
        fillRule="evenodd"
        d="M20.985 14.686h-.003a.029.029 0 0 0-.023.008.028.028 0 0 0-.008.022l-.022 3.774a.308.308 0 0 1-.05.176l5.328 7.121a.33.33 0 0 0-.025-.189l-5.167-10.893a.033.033 0 0 0-.031-.018Z"
        clipRule="evenodd"
      />
      <Path
        fill="url(#d)"
        fillRule="evenodd"
        d="M26.208 25.786a.332.332 0 0 0-.025-.189l-.267-.566-4.81-6.066 5.103 6.821Z"
        clipRule="evenodd"
      />
      <Path
        fill="#6000FF"
        d="m8.802 5.573-2.43 6.817a.318.318 0 0 0 .012.24l2.266 4.415-6.236 3.497a.164.164 0 0 1-.216-.063l-1.35-2.78a.264.264 0 0 1 .026-.29L8.74 5.534a.039.039 0 0 1 .062.014.038.038 0 0 1 .001.025Z"
      />
      <Path
        fill="url(#e)"
        fillRule="evenodd"
        d="M8.766 5.524h-.002a.032.032 0 0 0-.024.01L1.21 16.903l-.008.015 5.17-4.527.017-.046.001-.003 2.413-6.77a.037.037 0 0 0-.02-.044.038.038 0 0 0-.017-.004l-.001.001Z"
        clipRule="evenodd"
      />
      <Path
        fill="url(#f)"
        fillRule="evenodd"
        d="M.873 17.41a.266.266 0 0 0-.025.29l1.349 2.78a.165.165 0 0 0 .216.063l6.236-3.497-2.265-4.416a.308.308 0 0 1-.012-.239l-5.498 5.02Z"
        clipRule="evenodd"
      />
      <Path
        fill="url(#G)"
        fillRule="evenodd"
        d="M12.277.063v10.605a.303.303 0 0 1-.064.176L.06 27.159a.29.29 0 0 0 .038.39L8.625 35.7a.147.147 0 0 0 .242-.05l9.265-21.473a.339.339 0 0 0 0-.227L12.392.037A.055.055 0 0 0 12.34 0a.062.062 0 0 0-.062.062h-.001Z"
        clipRule="evenodd"
      />
      <Path
        fill="url(#h)"
        fillRule="evenodd"
        d="M12.337.001h-.005a.063.063 0 0 0-.06.062l.003 10.605a.322.322 0 0 1-.015.088l5.794 3.02L12.387.039a.056.056 0 0 0-.05-.037Z"
        clipRule="evenodd"
      />
      <Path
        fill="url(#i)"
        fillRule="evenodd"
        d="M18.151 14.069v-.003a.339.339 0 0 0-.017-.11l-.074-.18-5.799-3.02 1.111.628 4.78 2.684v.001Z"
        clipRule="evenodd"
      />
      <Path fill="#B46CF3" d="m1.198 16.921-.32.483 5.494-5.014-5.174 4.531Z" />
    </G>
    <Defs>
      <LinearGradient
        id="b"
        x1="19.983"
        x2="12.592"
        y1="30.439"
        y2="28.71"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#6000FF" />
        <Stop offset=".651" stopColor="#4900C3" />
        <Stop offset="1" stopColor="#320086" />
      </LinearGradient>
      <LinearGradient
        id="c"
        x1="21.199"
        x2="26.575"
        y1="13.72"
        y2="18.217"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#6A0AFF" />
        <Stop offset=".047" stopColor="#892AFF" />
        <Stop offset=".102" stopColor="#6A0AFF" />
        <Stop offset=".902" stopColor="#A94AFF" />
        <Stop offset="1" stopColor="#A94AFF" />
      </LinearGradient>
      <LinearGradient
        id="d"
        x1="21.29"
        x2="27.531"
        y1="18.986"
        y2="23.756"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#9335FE" />
        <Stop offset=".031" stopColor="#A954FE" />
        <Stop offset="1" stopColor="#BF73FF" />
      </LinearGradient>
      <LinearGradient
        id="e"
        x1="9.338"
        x2="-.969"
        y1="6.23"
        y2="13.192"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#6A0AFF" />
        <Stop offset=".51" stopColor="#8C2DFF" />
        <Stop offset=".969" stopColor="#AF50FF" />
        <Stop offset="1" stopColor="#AF50FF" />
      </LinearGradient>
      <LinearGradient
        id="f"
        x1="4.341"
        x2="5.098"
        y1="14.81"
        y2="18.9"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#6000FF" />
        <Stop offset="1" stopColor="#3E00A5" />
      </LinearGradient>
      <LinearGradient
        id="G"
        x1="-9.547"
        x2="20.169"
        y1="38.211"
        y2="36.251"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#9838FF" />
        <Stop offset=".322" stopColor="#AF50FF" />
        <Stop offset="1" stopColor="#6000FF" />
      </LinearGradient>
      <LinearGradient
        id="h"
        x1="11.617"
        x2="21.07"
        y1="3.776"
        y2="7.619"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#6F0FFF" />
        <Stop offset=".702" stopColor="#A94AFF" />
        <Stop offset="1" stopColor="#A94AFF" />
      </LinearGradient>
      <LinearGradient
        id="i"
        x1="12.35"
        x2="15.145"
        y1="10.782"
        y2="15.598"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#AE60FF" />
        <Stop offset=".031" stopColor="#B669FF" />
        <Stop offset="1" stopColor="#BF73FF" />
      </LinearGradient>
      <clipPath id="a">
        <Path fill="#fff" d="M0 0h120v39H0z" />
      </clipPath>
    </Defs>
  </Svg>
)

export default React.memo(AmbireLogoWithText)
