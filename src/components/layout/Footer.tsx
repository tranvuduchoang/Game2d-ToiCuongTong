export default function Footer() {
  return (
    <div className="border-t border-gray-700/60 mt-10">
      <div className="mx-auto max-w-6xl px-6 py-6 text-sm opacity-70 flex items-center justify-between">
        <span>© {new Date().getFullYear()} Tối Cường Tông</span>
        <div className="flex gap-4">
          <a className="hover:opacity-100 opacity-80" href="/register">Đăng ký</a>
          <a className="hover:opacity-100 opacity-80" href="/login">Đăng nhập</a>
          <a className="hover:opacity-100 opacity-80" href="/sect">Vào game</a>
        </div>
      </div>
    </div>
  );
}
// /components/layout/Footer.tsx