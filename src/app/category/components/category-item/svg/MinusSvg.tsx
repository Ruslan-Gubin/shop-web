export const MinusSvg = (props: { fill?: string; size?: number }) => {
  return (
    <svg
      width={props.size || "20"}
      height={props.size || "20"}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Убрать</title>
      <path d="M3 9H17V11H3V9Z" fill={props.fill || "currentColor"}></path>
    </svg>
  );
};
