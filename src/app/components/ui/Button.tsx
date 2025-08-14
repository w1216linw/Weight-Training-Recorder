interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "accent" | "secondary";
  className?: string;
  disabled?: boolean;
}

const Button = ({ 
  children, 
  onClick, 
  type = "button", 
  variant = "primary", 
  className = "",
  disabled = false 
}: ButtonProps) => {
  const baseClasses = "py-1 rounded-md hover:opacity-50 transition-colors text-lg";
  
  const variantClasses = {
    primary: "bg-primary text-primary-content",
    accent: "bg-accent text-accent-content",
    secondary: "bg-secondary text-secondary-content"
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
};

export default Button;