import HomeLink from "./home-link";

const AuthPage: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <div className="w-full flex items-end justify-end">
          <HomeLink />
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthPage;