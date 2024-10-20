export const DownArrowSwapButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="relative -my-5 mx-auto flex justify-center items-end">
      <svg
        onClick={onClick}
        className="hover:cursor-pointer hover:opacity-80"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_dd_832_4121)">
          <circle cx="22.8047" cy="21.9688" r="18" fill="#1A1A1A" />
          <circle
            cx="22.8047"
            cy="21.9688"
            r="17"
            stroke="url(#paint0_linear_832_4121)"
            strokeWidth="2"
          />
        </g>
        <path
          d="M22.8047 30.9688L27.1348 23.4687L18.4746 23.4688L22.8047 30.9688ZM22.0547 13.9688L22.0547 24.2187L23.5547 24.2187L23.5547 13.9687L22.0547 13.9688Z"
          fill="#6C6C6C"
        />
        <defs>
          <linearGradient
            id="paint0_linear_832_4121"
            x1="22.8047"
            y1="3.96875"
            x2="22.8047"
            y2="39.9688"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#121212" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
