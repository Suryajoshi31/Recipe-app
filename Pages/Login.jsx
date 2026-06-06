import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContextHelper';

export default function Login() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    // Extract username from email if logging in, otherwise use the provided name
    const finalName = isLogin ? email.split('@')[0] : name;
    login(finalName, email);
    alert(isLogin ? 'Successfully logged in!' : 'Successfully signed up!');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-100 px-4 py-12 relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 rounded-full bg-orange-200/40 blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 rounded-full bg-red-200/30 blur-3xl" />

      <div className="w-full max-w-md bg-white/85 backdrop-blur-md border border-orange-100 p-8 rounded-2xl shadow-xl z-10 transition-all duration-300">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-extrabold tracking-tight">
            Recipe<span className="text-red-600">Nest</span>
          </Link>
          <p className="text-gray-500 mt-2 text-sm">
            {isLogin ? 'Welcome back! Please login to your account' : 'Join our culinary community today'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200 mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Chef Guest"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 focus:outline-none transition duration-200 bg-white/50"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 focus:outline-none transition duration-200 bg-white/50"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-gray-700 text-sm font-semibold" htmlFor="password">
                Password
              </label>
              {isLogin && (
                <a href="#" className="text-xs text-orange-600 hover:text-orange-700 transition font-medium">
                  Forgot Password?
                </a>
              )}
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 focus:outline-none transition duration-200 bg-white/50"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition duration-200 cursor-pointer transform hover:-translate-y-0.5"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <span className="relative bg-white px-3 text-xs text-gray-400 uppercase">Or continue with</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => {
              const googleEmail = window.prompt("Simulate Google Login - Enter your Google email:", "user@gmail.com");
              if (googleEmail) {
                const username = googleEmail.split('@')[0];
                login(username, googleEmail);
                alert(`Successfully logged in as ${username}!`);
                navigate('/');
              }
            }}
            className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition cursor-pointer text-sm font-medium text-gray-700 bg-white"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.59c-.28 1.48-1.12 2.74-2.38 3.59v2.98h3.84c2.24-2.06 3.53-5.1 3.53-8.68z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.84-2.98c-1.06.7-2.43 1.12-4.12 1.12-3.17 0-5.86-2.14-6.82-5.02H1.24v3.09C3.21 21.12 7.32 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.18 14.21c-.24-.7-.38-1.46-.38-2.21s.14-1.51.38-2.21V6.7H1.24C.45 8.3.01 10.1.01 12s.44 3.7 1.23 5.3l3.94-3.09z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.96 1.19 15.24 0 12 0 7.32 0 3.21 2.88 1.24 6.7l3.94 3.09c.96-2.88 3.65-5.04 6.82-5.04z"
              />
            </svg>
            Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition cursor-pointer text-sm font-medium text-gray-700 bg-white"
          >
            <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 24 24">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="font-semibold text-orange-600 hover:text-orange-700 hover:underline transition cursor-pointer"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
}
