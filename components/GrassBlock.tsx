// Original pixel-art grass block (isometric cube), not Mojang's logo. Decorative: callers label the link.
export default function GrassBlock({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      {/* top: grass */}
      <path d="M8 1 15 4.5 8 8 1 4.5Z" fill="#5fb83a" />
      <path d="M5 3h1v1H5zM10 4h1v1h-1zM7 5h1v1H7z" fill="#4a9a2c" />
      {/* left face: grass lip over dirt */}
      <path d="M1 4.5 8 8v7L1 11.5Z" fill="#8a5a36" />
      <path d="M1 4.5 8 8v2L1 6.5Z" fill="#4a9a2c" />
      <path d="M3 9h1v1H3zM5 11h1v1H5z" fill="#6e4528" />
      {/* right face: darker */}
      <path d="M15 4.5 8 8v7l7-3.5Z" fill="#6e4528" />
      <path d="M15 4.5 8 8v2l7-3.5Z" fill="#3c7f23" />
      <path d="M11 10h1v1h-1zM13 9h1v1h-1z" fill="#57361f" />
    </svg>
  );
}
