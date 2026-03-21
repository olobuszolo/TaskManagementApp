"use client";
import React, { use } from "react";
import { useState } from "react";
import { loginUser } from "../utils/auth";
import { useRouter } from "next/navigation";

export default function loginPage() {
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const router = useRouter();


	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password === "" || username === "") {
			return;
		}
		try {
			await loginUser(username, password);
			alert("Yay! Logged in successfully!");
			router.push("/user");
		} catch (e) {
			alert("OOps!");
		}
	};
	return (
		<div className="min-h-screen bg-gray-100 items-center flex flex-col justify-center">
			<form
				onSubmit={handleSubmit}
				className="bg-gray-600 p-8 flex flex-col rounded-lg"
			>
				<label>Username</label>
				<input
					className="text-white-600"
					type="text"
					value={username}
					required
					onChange={(e) => {
						setUsername(e.target.value);
					}}
				/>
				<br />

				<label>Password</label>
				<input
					className="text-white-600"
					type="password"
					value={password}
					required
					onChange={(e) => {
						setPassword(e.target.value);
					}}
				/>
				<br />
                <button
                className="bg-blue-400 p-1 rounded-sm"
                type="submit">Login</button>
			</form>
		</div>
	);
}