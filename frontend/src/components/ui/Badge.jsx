const Badge = ({ children, variant = 'new' }) => {
  const variants = {
    new: 'bg-blue-500 text-white',
    sale: 'bg-red-500 text-white',
    hot: 'bg-orange-500 text-white',
  };

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded ${variants[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;