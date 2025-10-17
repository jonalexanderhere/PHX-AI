interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  return (
    <div className={`${sizes[size]} ${className}`}>
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M40 5L10 20V40C10 60 40 75 40 75C40 75 70 60 70 40V20L40 5Z"
          fill="#4A90E2"
          opacity="0.9"
        />
        <path d="M40 25L30 40H40V55L50 40H40V25Z" fill="white" />
      </svg>
    </div>
  )
}

