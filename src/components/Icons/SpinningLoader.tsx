export const SpinningLoader = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="100"
      viewBox="0 0 100 100"
      className="mx-auto"
    >
      <rect
        x="0"
        y="0"
        width="100"
        height="100"
        rx="50"
        fill="#1A1A1A"
        stroke="#3A3A3A"
        stroke-width="1"
      />
      <radialGradient
        id="a9"
        cx=".4"
        fx=".4"
        cy=".3125"
        fy=".3125"
        gradientTransform="scale(1.5)"
      >
        <stop offset="0" stop-color="#FF6B26"></stop>
        <stop offset=".3" stop-color="#FF6B26" stop-opacity="1"></stop>
        <stop offset=".6" stop-color="#FF6B26" stop-opacity=".9"></stop>
        <stop offset=".9" stop-color="#FF6B26" stop-opacity=".01"></stop>
        <stop offset="1" stop-color="#FF6B26" stop-opacity="0"></stop>
      </radialGradient>
      <circle
        transform-origin="center"
        fill="none"
        stroke="url(#a9)"
        stroke-width="5"
        stroke-linecap="round"
        stroke-dasharray="50 20 200"
        stroke-dashoffset="0"
        cx="50"
        cy="50"
        r="35"
      >
        <animateTransform
          type="rotate"
          attributeName="transform"
          calcMode="spline"
          dur="1.5"
          values="0;360"
          keyTimes="0;1"
          keySplines="0 0 1 1"
          repeatCount="indefinite"
        ></animateTransform>
      </circle>
    </svg>
  )
}
