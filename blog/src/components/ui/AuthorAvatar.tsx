import { useState } from "react";
import { useMetadata } from "../../hooks/useMetadata";

interface AuthorAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-28 h-28 text-3xl",
};

export default function AuthorAvatar({ name, size = "md" }: AuthorAvatarProps) {
  const { metadata } = useMetadata();
  const [imgError, setImgError] = useState(false);
  const github = metadata?.author?.social?.github;
  const avatarUrl = github ? `https://github.com/${github}.png?size=96` : null;

  const cls = sizeClasses[size];

  if (avatarUrl && !imgError) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        onError={() => setImgError(true)}
        className={`${cls} rounded-full object-cover shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${cls} rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold shrink-0`}
    >
      {name.charAt(0)}
    </div>
  );
}
