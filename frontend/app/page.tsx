"use client";
import { useState } from "react";
import { loginUser, registerUser } from "../utils/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [mode, setMode] = useState<"login" | "register">("login");
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: { preventDefault: () => void; }) => {
		e.preventDefault();
		if (password === "" || username === "") {
			setErrorMessage("Please fill in username and password.");
			return;
		}

		setErrorMessage("");
		setSuccessMessage("");
		setIsSubmitting(true);

		try {
			if (mode === "login") {
				await loginUser(username, password);
				router.push("/user");
				return;
			}

			await registerUser(username, password);
			setSuccessMessage("Account created. You can now log in.");
			setMode("login");
			setPassword("");
		} catch (e) {
			const message = e instanceof Error ? e.message : "Something went wrong.";
			setErrorMessage(message);
			console.error(`${mode} failed:`, e);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
			<div className="w-full max-w-md">
				<div className="mb-8 text-center">
					<h1 className="text-3xl font-bold text-white">TaskFlow</h1>
					<p className="text-slate-400 mt-2">
						Plan your tasks like a pro
					</p>
				</div>

				<form
					onSubmit={handleSubmit}
					className="bg-slate-800 border border-slate-700 shadow-lg rounded-2xl p-8 space-y-5"
				>
					<h2 className="text-xl font-semibold text-slate-100 mb-2">
						{mode === "login" ? "Log in" : "Register"}
					</h2>
					<p className="text-sm text-slate-400">
						{mode === "login"
							? "Use your existing account to continue."
							: "Create a new account with a unique username and password."}
					</p>

					<div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-900 p-1">
						<button
							type="button"
							onClick={() => {
								setMode("login");
								setErrorMessage("");
								setSuccessMessage("");
							}}
							className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
								mode === "login"
									? "bg-blue-600 text-white"
									: "text-slate-300 hover:bg-slate-800"
							}`}
						>
							Login
						</button>
						<button
							type="button"
							onClick={() => {
								setMode("register");
								setErrorMessage("");
								setSuccessMessage("");
							}}
							className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
								mode === "register"
									? "bg-blue-600 text-white"
									: "text-slate-300 hover:bg-slate-800"
							}`}
						>
							Register
						</button>
					</div>

					<div>
						<label className="text-sm text-slate-400">Username</label>
						<input
							type="text"
							value={username}
							autoComplete="username"
							required
							onChange={(e) => setUsername(e.target.value)}
							className="w-full mt-1 p-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label className="text-sm text-slate-400">Password</label>
						<input
							type="password"
							value={password}
							autoComplete={mode === "login" ? "current-password" : "new-password"}
							required
							onChange={(e) => setPassword(e.target.value)}
							className="w-full mt-1 p-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					{errorMessage && (
						<p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
							{errorMessage}
						</p>
					)}

					{successMessage && (
						<p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
							{successMessage}
						</p>
					)}

					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white font-medium py-3 rounded-lg disabled:cursor-not-allowed disabled:bg-blue-400"
					>
						{isSubmitting
							? mode === "login"
								? "Logging in..."
								: "Creating account..."
							: mode === "login"
								? "Login"
								: "Register"}
					</button>
				</form>
			</div>
		</div>
	);
}
