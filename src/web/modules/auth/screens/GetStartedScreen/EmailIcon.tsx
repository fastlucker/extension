const EmailIcon: React.FC<any> = ({ color, props }: { color: string; props: any }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" {...props}>
    <g id="emial_icon" data-name="emial icon" transform="translate(-348 -239)">
      <g id="icon_email" data-name="icon email" transform="translate(364 263)">
        <path
          id="Icon_material-email"
          data-name="Icon material-email"
          d="M60.6,6H9.4a6.2,6.2,0,0,0-6.368,6L3,48a6.228,6.228,0,0,0,6.4,6H60.6A6.228,6.228,0,0,0,67,48V12A6.228,6.228,0,0,0,60.6,6Z"
          transform="translate(-3 -6)"
          fill="none"
          stroke={color || '#b6b9ff'}
          strokeWidth="2"
        />
        <path
          id="Path_2143"
          data-name="Path 2143"
          d="M-4074.472-21252.465v6.439l25.757,15.715,25.443-16.139v-6.016l-25.443,15.674Z"
          transform="translate(4080.872 21258.77)"
          fill="none"
          stroke={color || '#b6b9ff'}
          strokeLinecap="round"
          strokeWidth="2"
        />
      </g>
      <rect
        id="Rectangle_1210"
        data-name="Rectangle 1210"
        width="96"
        height="96"
        transform="translate(348 239)"
        fill="none"
      />
    </g>
  </svg>
)

export default EmailIcon
