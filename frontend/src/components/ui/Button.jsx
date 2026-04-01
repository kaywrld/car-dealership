export default function Button({ children, variant = 'primary', className = '', ...props }) {
    const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer border-0 outline-none'
  
    const variants = {
      primary:   'bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 text-sm',
      secondary: 'bg-transparent border border-blue-500 text-blue-300 hover:bg-blue-900 px-6 py-3 text-sm',
      ghost:     'bg-transparent text-blue-300 hover:text-white px-4 py-2 text-sm',
      danger:    'bg-red-700 hover:bg-red-600 text-white px-6 py-3 text-sm',
    }
  
    return (
      <button className={`${base} ${variants[variant]} ${className}`} {...props}>
        {children}
      </button>
    )
  }