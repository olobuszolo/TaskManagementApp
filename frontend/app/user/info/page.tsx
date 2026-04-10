"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Category, UserInfo } from "@/types";
import { fetchCurrentUser } from "@/app/services/user";
import { createCategory, fetchCategories, updateCategory } from "@/app/services/categories";

const DEFAULT_CATEGORY_COLOR = "#2563eb";

export default function UserInfoPage() {
	const [user, setUser] = useState<UserInfo | null>(null);
	const [categories, setCategories] = useState<Category[]>([]);
	const [newCategoryName, setNewCategoryName] = useState("");
	const [newCategoryColor, setNewCategoryColor] = useState(DEFAULT_CATEGORY_COLOR);

	useEffect(() => {
		const loadPageData = async () => {
			try {
				const [userData, categoriesData] = await Promise.all([
					fetchCurrentUser(),
					fetchCategories(),
				]);

				setUser(userData);
				setCategories(categoriesData);
			} catch (error) {
				console.error("Failed to load user info page:", error);
			}
		};

		loadPageData();
	}, []);

	const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const trimmedName = newCategoryName.trim();
		if (!trimmedName) {
			return;
		}

		try {
			await createCategory({
				name: trimmedName,
				color: newCategoryColor,
			});
			const categoriesData = await fetchCategories();
			setCategories(categoriesData);
			setNewCategoryName("");
			setNewCategoryColor(DEFAULT_CATEGORY_COLOR);
		} catch (error) {
			console.error("Failed to create category:", error);
		}
	};

	const handleCategoryColorChange = (categoryId: number, color: string) => {
		setCategories((prev) =>
			prev.map((category) =>
				category.id === categoryId
					? { ...category, color }
					: category,
			),
		);
	};

	const handleUpdateCategoryColor = async (category: Category) => {
		try {
			const updatedCategory = await updateCategory(category.id, {
				color: category.color || DEFAULT_CATEGORY_COLOR,
			});

			setCategories((prev) =>
				prev.map((item) => (item.id === category.id ? updatedCategory : item)),
			);
		} catch (error) {
			console.error("Failed to update category color:", error);
			const categoriesData = await fetchCategories();
			setCategories(categoriesData);
		}
	};

	return (
		<div className="min-h-screen bg-slate-900 px-4 py-8 text-white">
			<div className="mx-auto max-w-4xl">
				<div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div>
						<p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
							Account
						</p>
						<h1 className="mt-1 text-3xl font-semibold text-white">
							User information
						</h1>
						<p className="mt-2 text-sm text-slate-400">
							Manage your account details and personal event categories
						</p>
					</div>

					<Link
						href="/user"
						className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
					>
						Back to calendar
					</Link>
				</div>

				<div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
					<section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-lg shadow-slate-950/20">
						<h2 className="text-xl font-semibold text-white">Your details</h2>
						<div className="mt-5 space-y-4">
							<div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
								<p className="text-sm text-slate-400">Username</p>
								<p className="mt-1 text-lg font-medium text-white">
									{user?.username ?? "Loading..."}
								</p>
							</div>

							<div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
								<p className="text-sm text-slate-400">Email</p>
								<p className="mt-1 text-lg font-medium text-white">
									{user?.email || "No email provided"}
								</p>
							</div>
						</div>
					</section>

					<section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-lg shadow-slate-950/20">
						<h2 className="text-xl font-semibold text-white">Your categories</h2>
						<p className="mt-2 text-sm text-slate-400">
							Here you can create custom categories to organize your events.
						</p>

						<form onSubmit={handleCreateCategory} className="mt-5 space-y-3">
							<div>
								<label htmlFor="category-name" className="text-sm font-medium text-slate-300">
									New category
								</label>
								<input
									id="category-name"
									type="text"
									value={newCategoryName}
									onChange={(e) => setNewCategoryName(e.target.value)}
									placeholder="e.g. Work, Personal, Studies"
									className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
								/>
							</div>

							<div>
								<label htmlFor="category-color" className="text-sm font-medium text-slate-300">
									Category color
								</label>
								<div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5">
									<input
										id="category-color"
										type="color"
										value={newCategoryColor}
										onChange={(e) => setNewCategoryColor(e.target.value)}
										className="h-10 w-16 cursor-pointer rounded border-none bg-transparent p-0"
									/>
									<span className="text-sm text-slate-300">{newCategoryColor}</span>
								</div>
							</div>

							<button
								type="submit"
								// disabled={isSavingCategory}
								className="w-full rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-700"
							>
								Add category
							</button>
						</form>


						<div className="mt-5">
							<p className="text-sm font-medium text-slate-300">Saved categories</p>
							{categories.length === 0 ? (
								<p className="mt-3 text-sm text-slate-500">
									No categories yet. Add your first one above.
								</p>
							) : (
								<ul className="mt-3 space-y-2">
									{categories.map((category) => (
										<li
											key={category.id}
											className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-3 text-sm text-slate-200 sm:flex-row sm:items-center"
										>
											<div className="flex items-center gap-3">
												<span
													className="h-3 w-3 rounded-full"
													style={{ backgroundColor: category.color || DEFAULT_CATEGORY_COLOR }}
												/>
												<span className="font-medium">{category.name}</span>
											</div>

											<div className="flex flex-1 items-center gap-3 sm:justify-end">
												<input
													type="color"
													value={category.color || DEFAULT_CATEGORY_COLOR}
													onChange={(e) => handleCategoryColorChange(category.id, e.target.value)}
													className="h-10 w-16 cursor-pointer rounded border-none bg-transparent p-0"
												/>
												<span className="min-w-20 text-xs text-slate-500">
													{category.color}
												</span>
												<button
													type="button"
													onClick={() => handleUpdateCategoryColor(category)}
													className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
												>
													Save color
												</button>
											</div>
										</li>
									))}
								</ul>
							)}
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
