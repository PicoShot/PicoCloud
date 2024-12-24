"use client";
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { login, autoLogin } from "../../store/slices/userSlice";
import { Input, Button, Spacer } from "@nextui-org/react";
import { Eye, EyeClosed } from "lucide-react";
import { isEmail, isLength, isAlphanumeric } from "validator";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const isLoading = useSelector((state: RootState) => state.user.isLoading);
  const isAuth = useSelector((state: RootState) => state.user.isAuth);
  const error = useSelector((state: RootState) => state.user.error);

  const validateEmail = (email: string) =>
    isEmail(email) && isLength(email, { min: 6, max: 64 });
  const isEmailInvalid = useMemo(() => {
    if (email === "") return false;
    return !validateEmail(email);
  }, [email]);

  const validateUsername = (username: string) =>
    isAlphanumeric(username) && isLength(username, { min: 4, max: 15 });
  const isUsernameInvalid = useMemo(() => {
    if (username === "") return false;
    return !validateUsername(username);
  }, [username]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuth) {
      navigate("/admin/panel");
    }
  });

  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      dispatch(autoLogin());
    }
  }, [isAuth, dispatch]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ userEmail: email, pass }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className=" p-8 rounded-xl max-w-md w-full transform-gpu duration-700">
        <h2 className="text-2xl font-bold text-white mb-6 text-center fade-item">
          Register
        </h2>

        {error && (
          <div className="text-sm fade-item duration-300 text-center text-danger mb-2 items-center justify-center">
            {error}
          </div>
        )}
        <Spacer y={3} />
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            isClearable
            isRequired
            variant="bordered"
            type="text"
            label="Username"
            className="max-w-full fade-item"
            disabled={isLoading}
            isInvalid={isUsernameInvalid}
            color={isUsernameInvalid ? "danger" : "default"}
            errorMessage="Please enter valid username!"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onClear={() => setUsername("")}
            size="sm"
          />

          <Input
            isClearable
            isRequired
            variant="bordered"
            type="email"
            label="Email"
            className="max-w-full fade-item"
            disabled={isLoading}
            isInvalid={isEmailInvalid}
            color={isEmailInvalid ? "danger" : "default"}
            errorMessage="Please enter valid email!"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onClear={() => setEmail("")}
            size="sm"
          />

          <Input
            isRequired
            variant="bordered"
            type={showPassword ? "text" : "password"}
            label="Password"
            className="max-w-full fade-item"
            disabled={isLoading}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            size="sm"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="toggle password visibility"
              >
                {showPassword ? <Eye /> : <EyeClosed />}
              </button>
            }
          />
          <Button
            isLoading={isLoading}
            type="submit"
            className={`w-full text-white font-semibold transition-colors fade-item duration-500 ${
              isAuth
                ? "bg-green-600 hover:bg-green-500"
                : "bg-purple-900 hover:bg-purple-950"
            }`}
            disabled={isLoading}
          >
            {isAuth ? "Success" : isLoading ? "Loading..." : "Register"}
          </Button>
        </form>
        <Spacer y={2} />
        <Link to="/auth/login" className=" text-center text-blue-500">
          Login Now
        </Link>
      </div>
    </div>
  );
}
export default Register;
