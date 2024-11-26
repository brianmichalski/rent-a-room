import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getCsrfToken, getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import HomeLink from "../../app/components/layout/home-link";
import AuthPage from "../../app/components/auth/auth-page";

export default function SignIn({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Check for session and redirect if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push("/"); // Redirect to the main page if already logged in
      }
    };
    checkSession();
  }, [router]);

  // Detect changes to the autofilled input fields
  useEffect(() => {
    // Check if email and password are autofilled
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;

    if (email === "" && emailInput?.value) {
      setEmail(emailInput.value);
    }
    if (password === "" && passwordInput?.value) {
      setPassword(passwordInput.value);
    }
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Prevent automatic redirection
    });

    if (result?.error) {
      setError("Invalid credentials. Please try again.");
    } else {
      router.push("/"); // Redirect to the main page upon successful login
    }
  };

  return (
    <AuthPage title="Sign in to your account">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-gray-700">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"  // Suggest saved emails
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <div className="text-sm">
                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"  // Suggest saved password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* Error display */}
          <div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className='w-full py-3 mt-6 text-white font-semibold rounded-md bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'>
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?
          <Link href="/auth/register" className="ml-0.5 font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Register a new account.
          </Link>
        </p>
      </div>
    </AuthPage>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/", // Redirect to the main page if the user is logged in
        permanent: false,
      },
    };
  }

  return {
    props: {
      csrfToken: await getCsrfToken(context), // Provide the CSRF token
    },
  };
}
