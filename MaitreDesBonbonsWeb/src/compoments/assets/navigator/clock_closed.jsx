const Lock_closed = () => {
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
        d="M50,62.1v8.1M25.8,86.3H74.2a8.1,8.1,0,0,0,8.1-8.1V54a8.1,8.1,0,0,0-8.1-8H25.8a8.1,8.1,0,0,0-8.1,8V78.2A8.1,8.1,0,0,0,25.8,86.3ZM66.1,46V29.8a16.1,16.1,0,1,0-32.2,0V46Z"
        fill="none"
        className="svg-stroke-primary"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
    </svg>
  );
};

export default Lock_closed;
