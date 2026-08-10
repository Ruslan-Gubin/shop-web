type Props = {
  size?: { height: number; width: number };
  title?: string;
};

export const ArrowRightSvg = (props: Props) => {
  return (
    <svg
      height={props.size ? props.size.height : 24}
      width={props.size ? props.size.width : 16}
      viewBox="0 0 22 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{props.title ? props.title : "Навигация"}</title>
      <path
        d="M19.7222 9.00001L12.0833 16.6389M0.277781 9.00001H19.7222H0.277781ZM19.7222 9.00001L12.0833 1.36111L19.7222 9.00001Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      ></path>
    </svg>
  );
};
