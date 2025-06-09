// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 text-center text-sm py-4 mt-auto lg:ml-64">
      <p>© {new Date().getFullYear()} My App. All rights reserved.</p>
    </footer>
  );
}
