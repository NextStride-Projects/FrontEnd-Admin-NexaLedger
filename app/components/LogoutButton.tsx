'use client';

interface LogoutButtonProps {
  children: React.ReactNode;
}

export default function LogoutButton({ children }: LogoutButtonProps) {
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-3 py-2 rounded hover:bg-green-600 transition"
    >
      {children}
      <span className="sr-only">Logout</span>
    </button>
  );
}
