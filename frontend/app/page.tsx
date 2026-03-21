"use client";
import { useState } from "react";
import { loginUser } from "../utils/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const router = useRouter();


	const handleSubmit = async (e: { preventDefault: () => void; }) => {
		e.preventDefault();
		if (password === "" || username === "") {
			return;
		}
		try {
			await loginUser(username, password);
			router.push("/user");
		} catch (e) {
			console.error("Login failed:", e);
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
						Log in
					</h2>

					<div>
						<label className="text-sm text-slate-400">Username</label>
						<input
							type="text"
							value={username}
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
							required
							onChange={(e) => setPassword(e.target.value)}
							className="w-full mt-1 p-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<button
						type="submit"
						className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white font-medium py-3 rounded-lg"
					>
						Login
					</button>
				</form>
			</div>
		</div>
	);
}