export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-semibold mb-4">Notepad</h1>
      <p className="mb-6">Welcome! Use the links above to sign in and manage notes.</p>
      <ul className="list-disc pl-6 space-y-2">
        <li><a className="link" href="/signin">Sign in</a></li>
        <li><a className="link" href="/signup">Sign up</a></li>
        <li><a className="link" href="/notes">Notes</a> (requires sign-in)</li>
      </ul>
    </main>
  );
}
