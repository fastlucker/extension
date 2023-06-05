const HWIcon: React.FC<any> = ({ color, props }: { color: string; props: any }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" {...props}>
    <g id="HW_icon" data-name="HW icon" transform="translate(-350.5 -242.5)">
      <g id="icon_HW" data-name="icon HW" transform="translate(-237.337 -111.756)">
        <path
          id="shadow"
          d="M41.459,0H6.541A6.441,6.441,0,0,0,0,6.338l.01,39.2a6.194,6.194,0,0,0,1.077,3.481L9.325,61.146A6.6,6.6,0,0,0,14.789,64H33.148a6.6,6.6,0,0,0,5.464-2.854l8.241-12.133a6.2,6.2,0,0,0,1.077-3.472L48,6.348A6.441,6.441,0,0,0,41.459,0"
          transform="translate(609.337 366.756)"
          fill={color || '#6000ff'}
          stroke={color || '#b6b9ff'}
          strokeWidth="1"
          opacity="0"
        />
        <path
          id="hw"
          d="M41.459,0H6.541A6.441,6.441,0,0,0,0,6.338l.01,39.2a6.194,6.194,0,0,0,1.077,3.481L9.325,61.146A6.6,6.6,0,0,0,14.789,64H33.148a6.6,6.6,0,0,0,5.464-2.854l8.241-12.133a6.2,6.2,0,0,0,1.077-3.472L48,6.348A6.441,6.441,0,0,0,41.459,0"
          transform="translate(609.337 366.756)"
          fill="none"
          stroke={color || '#b6b9ff'}
          strokeWidth="2"
        />
        <g id="components" transform="translate(617.224 379.729)">
          <g
            id="Rectangle_1047"
            data-name="Rectangle 1047"
            fill="none"
            stroke={color || '#b6b9ff'}
            strokeWidth="2"
          >
            <rect width="32.226" height="20.293" rx="2" stroke="none" />
            <rect x="1" y="1" width="30.226" height="18.293" rx="1" fill="none" />
          </g>
          <g
            id="Rectangle_1048"
            data-name="Rectangle 1048"
            transform="translate(0 24.976)"
            fill="none"
            stroke={color || '#b6b9ff'}
            strokeWidth="2"
          >
            <rect width="12.89" height="6.244" rx="2" stroke="none" />
            <rect x="1" y="1" width="10.89" height="4.244" rx="1" fill="none" />
          </g>
          <g
            id="Rectangle_1049"
            data-name="Rectangle 1049"
            transform="translate(19.335 24.976)"
            fill="none"
            stroke={color || '#b6b9ff'}
            strokeWidth="2"
          >
            <rect width="12.89" height="6.244" rx="2" stroke="none" />
            <rect x="1" y="1" width="10.89" height="4.244" rx="1" fill="none" />
          </g>
        </g>
      </g>
    </g>
  </svg>
)

export default HWIcon
