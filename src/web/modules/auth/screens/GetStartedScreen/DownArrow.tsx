const DownArrow: React.FC<any> = ({ isActive }: { isActive: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15.586"
    height="9.173"
    viewBox="0 0 15.586 9.173"
    transform={!isActive ? 'rotate(180)' : 'rotate(0)'}
  >
    <path
      id="down_arrow"
      data-name="down arrow"
      d="M6.347,12.758,0,6.385,6.347,0"
      transform="translate(1.414 7.761) rotate(-90)"
      fill="none"
      stroke="#2d314d"
      strokeLinecap="round"
      strokeWidth="2"
    />
  </svg>
)

export default DownArrow
