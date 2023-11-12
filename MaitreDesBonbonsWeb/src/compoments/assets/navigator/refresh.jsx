const Refresh = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="svg-snoweb svg-theme-light"
      x="0"
      y="0"
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <style>
          {`
            .svg-fill-primary {
              fill: #090D49;
            }

            .svg-fill-secondary {
              fill: #65CDAE;
            }

            .svg-fill-tertiary {
              fill: #E5E7EB;
            }

            .svg-stroke-primary {
              stroke: #fff;
            }

            .svg-stroke-secondary {
              stroke: #65CDAE;
            }

            .svg-stroke-tertiary {
              stroke: #E5E7EB;
            }
          `}
        </style>
      </defs>
      <path
        d="M17.9,17.9V38h2.3m61.7,8a32.1,32.1,0,0,0-61.7-8m0,0H38M82.1,82.1V62H79.8m0,0a32.1,32.1,0,0,1-61.7-8m61.7,8H62"
        fill="none"
        className="svg-stroke-primary"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
    </svg>
  );
};

export default Refresh;
